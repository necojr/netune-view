<?php

namespace atare\turim\routing;

use atare\turim\lib\Config;

class Filter{

    private static $filters = array();

    public static function add($nome, $fn){
        Filter::$filters[ strtolower($nome) ] = $fn;
    }

    public static function run($nome, $params = array()){
        call_user_func(Filter::$filters[ strtolower($nome) ], $params);
    }

}