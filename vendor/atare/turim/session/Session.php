<?php

namespace atare\turim\session;

use atare\turim\http\Cookie;
use atare\turim\lib\Config;
use atare\turim\http\Request;
use atare\turim\lib\UUID;

class Session
{
    public $hash;
    public $name;

    public function __construct($name = null){
        $this->setName($name);
        $this->load();
    }

    private function load(){
        $cookie = $this->getCookie();

        if($cookie == null){
            return;
        }

        $this->hash = $cookie->value;
    }

    public function create($sessionName = false){
        if($sessionName == false){
            $this->hash = UUID::create();
        }else{
            $this->hash = $sessionName;
        }

        $cookie = new Cookie($this->name, $this->hash);
        $cookie->setDays(365);

        Request::getInstance()->addCookie( $cookie );
    }

    public function getHash(){
        return $this->hash;
    }

    public function setName($name){
        $this->name = $name;

        if($name == null){
            $this->name = Session::getName();
        }
    }

    public function destroy(){
        $cookie = $this->getCookie();

        if($cookie == null) return;

        Request::getInstance()->deleteCookie( $cookie );
    }

    public function getCookie(){
        $request = Request::getInstance();

        if(!$request->hasCookie($this->name)) return null;
        return $request->getCookie($this->name);
    }

    private function getName(){
        $sessionName = Config::get('session', 'name');
        if(strlen($sessionName) == 0) $sessionName = 'session';

        return $sessionName;
    }
}
