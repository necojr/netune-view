<?php

namespace atare\turim;

use atare\turim\routing\Dispatcher;
use atare\turim\routing\Router;
use atare\turim\session\AuthManager;
use atare\turim\error\ErrorDispatcher;
 
class Bootstrap{

    protected $dispatcher;
    public $errorDispatcher;

    public function __construct($router){
        $this->errorDispatcher = new ErrorDispatcher();
        
        $this->dispatcher = new Dispatcher($router);
        $this->dispatcher->setErrorDispatcher($this->errorDispatcher);
    }

    public function init(){
        $this->dispatcher->invoke();
    }

    public static function loadFilters($directory){
        $files = scandir($directory);

        array_splice($files, 0, 1);
        array_splice($files, 0, 1);

        foreach ($files as $key => $filename) {
            include "$directory/$filename";
        }
    }

    public function addErrorHandler($type, $handler){
        $this->errorDispatcher->add($type, $handler);

        return $this;
    }

}