<?php

namespace atare\turim\session;

use atare\turim\db\Repositorio;
use atare\turim\lib\Config;

class AuthDb implements IAuthRepositorio{

    private static function getTableName(){
        $tablename = Config::get('auth', 'table');
        if(strlen($tablename) == 0) $tablename = 'auth';

        return $tablename;
    }

    public function fetch($hash){
        $db = Repositorio::getInstance();
        $db->setClass('\atare\turim\session\Auth');
        $tablename = AuthDb::getTableName();
        
        $auth = $db->fetch("SELECT * FROM $tablename WHERE hash = :hash", array(
            ':hash' => $hash
        ));

        $db->setClass(null);

        return $auth;
    }

    public function insert($hash, $user){
        $tablename = AuthDb::getTableName();
        $db = Repositorio::getInstance();
        $session = $db->execute("INSERT INTO $tablename(hash, user) VALUES(:hash, :user)", array(
            ':hash' => $hash,
            ':user' => $user
        ));
    }

    public function update($hash, $user){
        throw new \Exception('AuthDb update ainda nao implementada');
    }

    public function delete($hash){
        $tablename = AuthDb::getTableName();
        $db = Repositorio::getInstance();
        $db->execute("DELETE FROM $tablename WHERE hash = :hash", array(
            ':hash' => $hash
        ));
    }

    public function exist($hash){
        $tablename = AuthDb::getTableName();

        $db = Repositorio::getInstance();
        $session = $db->fetch("SELECT COUNT(*) AS total FROM $tablename WHERE hash = :hash", array(
            ':hash' => $hash
        ));

        return intval( $session->total ) > 0;
    }

}