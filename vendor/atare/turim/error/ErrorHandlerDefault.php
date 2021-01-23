<?php

namespace atare\turim\error;

use atare\turim\lib\Config;
use atare\turim\lib\Wrapper;
use atare\turim\http\Request;
use atare\turim\view\View;

class ErrorHandlerDefault implements IError {

    public function run($type, $errno, $errstr){
        if(!is_dir($this->getDirectory())) return;

        $bypass = Config::get('app', 'bypass');
        if(strlen($bypass) > 0){
            return;
        }

        $now = date('d-m-Y H:i:s');
        $txt = "$now: error number $errno => $errstr";
        $filename = $this->getFilename($type);

        if(file_exists($filename)){
            file_put_contents($filename, $txt.PHP_EOL , FILE_APPEND | LOCK_EX);
        }else{
            file_put_contents($filename, $txt);
        }

        if(Request::getInstance()->isAjax()){
            $msgError = Config::get('error', 'message');
            if($msgError == '') $msgError = "Ops! Ocorreu um erro interno. <br>Código: $errno";
            echo Wrapper::error($msgError);
        }

        $filename = Config::get('error', 'page');
        if($filename == ''){
            $filename = 'app/mvc/views/error/page.html';
        }

        if(file_exists($filename)){
            $view = new View($filename);
            $view->ERROR_NO = $errno;
            $view->ERROR_DESCRIPTION = $errstr;
            $view->render();
            die;
        }else{
            echo $txt;die;
        }
    }

    protected function getFilename($type){
        $now = date('d-m-Y');
        $dir = $this->getDirectory();

        return "$dir/error.$type.log";
    }

    protected function getDirectory(){
        $path = Config::get('error', 'log');

        if($path == ''){
            $path = 'app/logs';
        }

        return $path;
    }
}