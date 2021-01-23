<?php

namespace atare\turim\sql;

class Parameter{

    private $isDebug = false;
    private $counter = 0;
    protected $parameters = array();
    
    public function bind($value){
        $name = $this->createParameterName();

        if($this->isDebug){
            $this->parameters[$value] = $value;
            return is_string($value) ? "'$value'" : $value;
        }else{
            $this->parameters[$name] = $value;
            return $name;
        }
    }

    private function createParameterName(){
        $this->counter++;

        return ':p' . $this->counter;
    }

    public function setDebug($isDebug){        
        $this->isDebug = $isDebug;

        return $this;
    }

    public function get(){
        return $this->parameters;
    }

}