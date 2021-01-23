<?php

namespace atare\turim\session;

class Auth{
    public $session;

    public static function signIn($sessionName = false){
        $auth = Auth::current();
        $auth->session->create($sessionName);

        return $auth;
    }
    
    public static function signOut(){
        $auth = Auth::current();
        $auth->session->destroy();

        return $auth;
    }

    public static function logged(){
        $auth = Auth::current();
        return $auth->session->hash != null;
    }
    
    public static function current(){
        $auth = new Auth();
        $auth->session = new Session('presence');

        return $auth;
    }
}