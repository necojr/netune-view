<?php

namespace app\mvc\controllers;

use atare\turim\controller\Controller;
use atare\turim\session\Auth;
use atare\turim\cache\Cache;
use atare\turim\lib\Wrapper;
use atare\turim\lib\Config;

use app\mvc\models\user\User;
use app\mvc\models\user\UserRepositorio;

class IndexController extends Controller{

    public function __construct(){
        parent::__construct();

        // $this->filter->register('index', 'auth');
    }

    public function index(){

    }

}