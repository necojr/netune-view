<?php

namespace atare\turim\session;

use atare\turim\cache\Cache;
use atare\turim\lib\Config;

class AuthFile implements IAuthRepositorio{

    private $cache;

    public function __construct(){
        $this->cache = new Cache(null, Config::get('auth', 'directory'));
    }

    public function fetch($hash){
        if(!$this->exist($hash)) return false;

        $auth = $this->cache->setID($hash)->loadItems()->get('auth');

        return $auth;
    }

    public function insert($hash, $user){
        $auth = new Auth();
        $auth->hash = $hash;
        $auth->user = $user;
        $auth->createAt = @date("Y-m-d H:i:s");
        $this->cache->setID($hash)->set('auth', $auth)->save();
    }

    public function update($hash, $user){
        $auth = new Auth();
        $auth->hash = $hash;
        $auth->user = $user;
        $auth->createAt = @date("Y-m-d H:i:s");
        $this->cache->setID($hash)->loadItems()->set('auth', $auth)->save();
    }

    public function delete($hash){
        $this->cache->setID($hash)->destroy();

        return $this;
    }

    public function exist($hash){
        $cache = $this->cache->setID($hash);

        return $cache->exist();
    }
}