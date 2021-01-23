<?php

namespace atare\turim\view;

use atare\turim\lib\Config;
use atare\turim\io\File;
 
class View{
    
    protected $template;

    private static $variables = array();
    private static $helpers = array();

    public function __construct($controllerName, $actionName = false){
        if($actionName == false){
            $this->template = new Template($this->readHtml($controllerName));
        }else{
            $this->template = new Template($this->readHtml($this->convertActionToFilename($controllerName, $actionName)));
        }
    }

    private function loadVariables(){
        foreach (View::$variables as $key => $value) {
            $this->template->add($key, $value);
        }
    }
    
    private function loadHelpers(){
        foreach (View::$helpers as $key => $value) {
            $this->template->helpers->add($key, $value);
        }
    }

    public static function addHelper($key, $class){
        View::$helpers[$key] = $class;
    }

    public static function add($name, $value = false){
        if(is_array($name)){
            foreach ($name as $n => $v) {
                View::$variables['{' . $n. '}'] = $v;
            }
        }else{
            View::$variables[$name] = $value;
        }
    }

    public function render(){
        $this->loadVariables();
        $this->loadHelpers();
        
        echo $this->template->render();
    }

    public function __set($name, $value){
        $this->template->add('{' . $name . '}', $value);
    }

    private function renderHeader($name, $filename, $type, $open = false){
        if($open){
            header('Content-Disposition: filename="' . $name . '"');
        }else{
            header('Content-Disposition: attachment; filename="' . $name . '"');
        }

        header("Content-type: $type");
	    header('Content-Length: ' . ( filesize( $filename ) ));
	    
	    ob_clean();
	    flush();
    }

    public function renderStream($stream, $type){
        $this->renderHeader($stream, $type);

	    echo $stream;
        exit();
    }

    public function downloadFile($name, $filename, $type){
        $filename = dirname(dirname(dirname(dirname(__DIR__)))) . $filename;
        $this->renderHeader($name, $filename, $type, false);

	    readfile( $filename );
        exit();
    }

    public function renderFile($name, $filename, $type){
        $filename = dirname(dirname(dirname(dirname(__DIR__)))) . $filename;
        $this->renderHeader($name, $filename, $type, true);

	    readfile( $filename );
        exit();
    }

    public function renderImage($filename, $type){
        $this->renderFile('', $filename, $type);
    }

    private function convertActionToFilename($controllerName, $actionName){
        $pathDefault = Config::get('app', 'views_directory');
        if(strlen($pathDefault) == 0) $pathDefault = 'app/mvc/views';

        $ctr = strtolower($controllerName);

        return "$pathDefault/$ctr/$actionName.html";
    }

    private function readHtml($filename){
        if(File::exist($filename)){
            $html = File::read($filename);
        }else{
            $html = "file: $filename não encontrado";
        }

        return $html;
    }

}