<?php

namespace atare\turim\sql;

class Where{

    private $parameter;
    private $where = array();

    public function __construct($parameter){
        $this->parameter = $parameter;
    }

    public function isNotNull($column){
        $this->where[] = "($column IS NOT NULL )";

        return $this;
    }

    public function isNull($column){
        $this->where[] = "($column IS NULL )";

        return $this;
    }

    public function like($column, $value){
        $name =  $this->parameter->bind($value);
        $this->where[] = "$column LIKE CONCAT('%', $name, '%')";

        return $this;
    }
    
    public function in($column, $arr){
        $in = array();
        foreach ($arr as $key => $value) {
            $in[] =  $this->parameter->bind($value);
        }
        
        $keys = implode(',', $in);
        $this->where[] = "($column IN ($keys))";

        return $this;
    }

    public function notEqual($column, $value){
        $name =  $this->parameter->bind($value);
        $this->where[] = "($column <> $name)";
        
        return $this;
    }

    public function equal($column, $value){
        $name =  $this->parameter->bind($value);
        $this->where[] = "($column = $name)";
        
        return $this;
    }
    
    public function between($column, $value1, $value2){
        $name1 =  $this->parameter->bind($value1);
        $name2 =  $this->parameter->bind($value2);
        
        $this->where[] = "($column BETWEEN $name1 AND $name2)";

        return $this;
    }

    public function greaterEqualThan($column, $value){
        $name =  $this->parameter->bind($value);
        
        $this->where[] = "($column >= $name)";
        
        return $this;
    }
    
    public function lessEqualThan($column, $value){
        $name =  $this->parameter->bind($value);
        
        $this->where[] = "($column <= $name)";

        return $this;
    }

    public function isEmpty(){
        return count($this->where) === 0;
    }

    public function getSql(){
        return implode(" AND ", $this->where);
    }

}