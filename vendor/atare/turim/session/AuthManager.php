<?php

namespace atare\turim\session;

use atare\turim\http\Cookie;
use atare\turim\lib\Config;
use atare\turim\http\Request;
use atare\turim\lib\UUID;

class AuthManager{

    private static $auth = null;
    private static $repositorio;

    public static function loadRepositorio(){
        AuthManager::setRepositorio( AuthManager::getRepositorio() );
    }

    private static function getRepositorio(){
        switch (Config::get('auth', 'type')) {
           case 'file': return new AuthFile();
           case 'db': return new AuthDb();
           case 'cache': return new AuthCache();
       }
    }

    public static function setRepositorio($repositorio){
        AuthManager::$repositorio = $repositorio;
    }

    public static function getInstance(){
        if(AuthManager::$auth == null) AuthManager::$auth = new Auth();

        return AuthManager::$auth;
    }

    public static function get($hash){
        $auth = AuthManager::$repositorio->fetch($hash);

        return $auth;
    }

    public static function current(){
        $cookie = AuthManager::getCookieSession();

        if($cookie == null) return null;

        return AuthManager::get($cookie->value);
    }

    public static function register($user){
        AuthManager::login($user);
    }

    public static function login($user){
        $sessioname = AuthManager::getSessionName();
        $cookie = new Cookie($sessioname, UUID::create());
        $cookie->setDays(365);

        Request::getInstance()->addCookie( $cookie );

        AuthManager::$repositorio->insert($cookie->value, $user);
    }

    public static function update($user){
        $cookie = AuthManager::getCookieSession();

        if($cookie == null) return null;

        AuthManager::$repositorio->update($cookie->value, $user);
    }

    public static function logout(){
        $cookie = AuthManager::getCookieSession();

        if($cookie == null) return;

        AuthManager::$repositorio->delete( $cookie->value );

        Request::getInstance()->deleteCookie( $cookie );
    }

    public static function isLogged(){
        $cookie = AuthManager::getCookieSession();

        if($cookie == null) return false;

        return AuthManager::$repositorio->exist( $cookie->value );
    }

    private static function getCookieSession(){
        $request = Request::getInstance();
        $sessionName = AuthManager::getSessionName();

        if(!$request->hasCookie($sessionName)) return null;
        return $request->getCookie($sessionName);
    }

    private static function getSessionName(){
        $sessionName = Config::get('auth', 'name');
        if(strlen($sessionName) == 0) $sessionName = 'auth';

        return $sessionName;
    }

}