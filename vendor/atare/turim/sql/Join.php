<?php

namespace atare\turim\sql;

class Join{

    private $joins = array();
    private $parameter;

    public function __construct($parameter){
        $this->parameter = $parameter;
    }
    
    public function inner($table, $on = ''){
        if(is_array($on)){
            $ons = array();
            foreach ($on as $key => $value) {
                if(strpos($value, '.') === false){
                    $ons[] = "$key = $value";
                }else{
                    $name =  $this->parameter->bind($value);
                    $ons[] = "$key = $name";
                }
            }
            $on = implode(" AND ", $ons);
        }

        $this->joins[] = "INNER JOIN $table ON $on";

        return $this;
    }
    
    public function left($table, $on = ''){
        if(is_array($on)){
            $ons = array();
            foreach ($on as $key => $value) {
                if(strpos($value, '.') === false){
                    $ons[] = "$key = $value";
                }else{
                    $name =  $this->parameter->bind($value);
                    $ons[] = "$key = $name";
                }
            }
            $on = implode(" AND ", $ons);
        }

        $this->joins[] = "LEFT JOIN $table ON $on";

        return $this;
    }
    
    public function right($table, $on = ''){
        if(is_array($on)){
            $ons = array();
            foreach ($on as $key => $value) {
                if(strpos($value, '.') === false){
                    $ons[] = "$key = $value";
                }else{
                    $name =  $this->parameter->bind($value);
                    $ons[] = "$key = $name";
                }
            }
            $on = implode(" AND ", $ons);
        }

        $this->joins[] = "RIGHT JOIN $table ON $on";

        return $this;
    }

    public function getSql(){
        return implode(" ", $this->joins);
    }

    public function isEmpty(){
        return count($this->joins) === 0;
    }


}