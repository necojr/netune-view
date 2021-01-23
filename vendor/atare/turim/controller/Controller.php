<?php

namespace atare\turim\controller;

use atare\turim\view\View;
use atare\turim\http\Get;
use atare\turim\routing\ActionFilter;
use atare\turim\lib\Cookie;
use atare\turim\http\Request;
 
class Controller{

    public $view;
    public $request;
    public $filter;

    public function __construct(){
        $this->filter = new ActionFilter();
        $this->request = Request::getInstance();
    }

    public function init($view){
        $this->view = $view;
    }

}