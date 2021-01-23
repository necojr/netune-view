<?php

namespace atare\turim\http;
 
class Url{

    protected $url;

    public function __construct($url){
        $this->url = $url;
    }

    public static function current(){
        return new Url($_SERVER['REQUEST_SCHEME'] . '://' . $_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI']);
    }

    public function host(){
        $p = parse_url($this->url);
        return isset($p['host']) ? $p['host'] : '';
    }

    public function getFullHost(){
        $p = parse_url($this->url);
        $s = isset($p['scheme']) ? $p['scheme'] : '';
        $h = isset($p['host']) ? $p['host'] : '';
        $p = isset($p['port']) ? $p['port'] : '';
        
        if(strlen($p) > 0){
            return "$s://$h:$p";
        }
        
        return "$s://$h";
    }
    
    public function toString(){
        return $this->url;
    }

}