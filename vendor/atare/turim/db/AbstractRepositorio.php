<?php

namespace atare\turim\db;

class AbstractRepositorio{

    protected $classname;

    public function __construct($classname){
        $this->setClass( $classname );
    }

    public function getRepositorio(){
        $db = Repositorio::getInstance();
        $db->setClass( $this->classname );
        
        return $db;
    }

    public function setClass($classname){
        $this->classname = $classname;
    }

}