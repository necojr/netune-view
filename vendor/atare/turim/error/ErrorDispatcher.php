<?php

namespace atare\turim\error;

class ErrorDispatcher{

    public $handlers = array();

    public function __construct(){
        $this->handlers['php'] = array();
        $this->handlers['js'] = array();

        set_error_handler(array($this, 'handlerPHP'), E_ALL);
        register_shutdown_function(array($this, 'handlerFatal'));
    }

    public function handlerFatal(){
        $error = error_get_last();
        if ($error != null) {
            chdir(dirname(dirname(dirname(dirname(__DIR__)))));
            $this->invoke('php', $error['type'], $error['message']);
            die;
        }
    }

    public function invoke($type, $n, $str){
        $h = $this->handlers[$type];        

        for ($i=0; $i < count($h) ; $i++) { 
            $h[$i]->run($type, $n, $str);
        }
    }

    public function handlerJS($n, $str){
        $this->invoke('js', $n, $str);
    }
    
    public function handlerPHP($n, $str){
        $this->invoke('php', $n, $str);
    }

    public function add($type, $handler){
        $this->handlers[$type][] = $handler;

        return $this;
    }


}