<?php
    
    define('__APP_ROOT__', dirname(__DIR__));
    chdir(__APP_ROOT__);
       
    include 'vendor/atare/turim/autoloader.php';

    ini_set('display_startup_errors', -1);
    ini_set('display_errors', -1);
    error_reporting(-1);
    date_default_timezone_set('America/Sao_Paulo');

    atare\turim\Autoloader::init(array(
        'atare'     => __APP_ROOT__ . '/vendor/atare',
        'correio'     => __APP_ROOT__ . '/vendor/correio',
    ));

    atare\turim\view\View::add(array(
        'APP_VERSION'   => atare\turim\lib\Config::get('app', 'builder'),
    ));

    $bootstrap = new atare\turim\Bootstrap(new atare\turim\routing\Router());
    $bootstrap->loadFilters('app/filters/');
    $bootstrap->init();
