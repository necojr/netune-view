<?php

namespace atare\turim\routing;

class ActionContext{

    public $action;
    public $controller;
    public $request;
    public $result;

    private $execute = true;

    public function stop(){
        $this->execute = false;
    }

    public function isExecute(){
        return $this->execute;
    }

}