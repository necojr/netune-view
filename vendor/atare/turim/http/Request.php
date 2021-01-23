<?php

namespace atare\turim\http;

use atare\turim\lib\ObjectAbstract;

class Request{

    public $files;
    public $get;
    public $post;
    
    private static $current = null;

    public function __construct(){
        $this->files = new FileCollection();
        $this->get = new Get();
        $this->post = new Post();
    }

    public function isPost(){
        return $_SERVER['REQUEST_METHOD'] === 'POST';
    }

    public function isAjax(){
        return !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
    }

    public function redirectToUrl($url){
        header("location:$url");
    }

    public function redirectToRoute($route, $params = array()){
        $defaults = array(
            'includeQueryString' => true,
            'queryString' => array()
        );

        $options = ObjectAbstract::extend($defaults, $params);
        if($options['includeQueryString']){
            $partes = explode('?', $_SERVER['REQUEST_URI']);
            if(count($partes) > 1) {
                $p = explode('&', $partes[1]);
                for ($i=0; $i < count($p); $i++) {
                    $kv = explode('=', $p[$i]);
                    $options['queryString'][$kv[0]] = $kv[1];
                }
            }
        }

        $qs = array();
        foreach ($options['queryString'] as $key => $value){
            $qs[] = "$key=$value";
        }
        
        if(count($qs) > 0){
            $qs = "?" . implode($qs, '&');
        }else{
            $qs = '';
        }
        
        $protocol = $this->isSSL() ? 'https' : 'http';

        $url = $protocol . '://' . $_SERVER['HTTP_HOST'];
        header("location:$url$route$qs");
    }

    public function isSSL(){
        $url = '';

        if(!isset($_SERVER['SCRIPT_URI'])) $url = $_SERVER['SERVER_PROTOCOL'];
        if(strpos($url, 'https:') === false) return false;
        return true;
    }

    public static function getInstance(){
        if(Request::$current == null) Request::$current = new Request();
        return Request::$current;
    }

    public function addCookie($cookie, $isPermanent = false){
        if(strlen($cookie->name) == 0) return;

        if($isPermanent) $cookie->setDays(360);

        setcookie($cookie->name, $cookie->value, $cookie->getTime(), $cookie->path);
    }

    public function getCookie($name){
        if(!$this->hasCookie($name)) return null;

        return new Cookie($name, $_COOKIE[ $name ]);
    }

    public function hasCookie($name){
        return isset($_COOKIE[ $name ]);
    }

    public function deleteCookie($cookie){
        if(strlen($cookie->name) == 0) return;

        $cookie->value = '';
        $cookie->setTime(-3600);

        $this->addCookie($cookie);
    }

}