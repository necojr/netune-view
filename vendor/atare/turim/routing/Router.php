<?php

namespace atare\turim\routing;

use atare\turim\lib\Config;
 
class Router{

    protected $controllerName;
    protected $actionName;

    public function getActionName(){
        $name = $this->actionName;

        $name = str_replace('?', '', $name);

        $p = explode('-', $name);
        
        $_name = $p[0];
        if(count($p) > 1){
            for($i = 1 ; $i < count($p) ; $i++){
                $_name .= ucfirst($p[$i]);
            }
        }

        $name = $_name;

        return $name;
    }

    public function getControllerName(){
        return $this->convertUrlToName($this->controllerName);
    }

    private function convertUrlToName($url){
        $u = explode('-', $url);
        $s = '';

        foreach ($u as $key => $value) {
            $s .= ucfirst($value);
        }

        return $s;
    }

    private function extractRoutes(){
        $requestUri= $_SERVER['REQUEST_URI'];
        $partes = explode('/', $requestUri);

        array_splice($partes, 0, 1);

        if(!isset($partes[0])) $partes[0] = '';
        if(!isset($partes[1])) $partes[1] = '';

        $partes[0] = explode('?', $partes[0])[0];
        $partes[1] = explode('?', $partes[1])[0];
        
        if(strlen($partes[0]) == 0) $partes[0] = Config::get('app', 'defaultControllerName');
        if(strlen($partes[1]) == 0) $partes[1] = Config::get('app', 'defaultActionName');

        return $partes;
    }

    public function get(){
        return "$this->controllerName/$this->actionName";
    }

    public function load(){
        $routes = $this->extractRoutes();
        
        $this->controllerName = $routes[0];
        $this->actionName     = $routes[1];
    }

}