<?php

namespace atare\turim\sql;

class SqlBuilder{
    
    private $select = array();
    private $from = '';
    private $orders = array();
    private $limitDown = null;
    private $limitUp = null;

    public function __construct(){
        $this->parameter = new Parameter();

        $this->_join  = new Join($this->parameter);
        $this->_where = new Where($this->parameter);
    }

    public function where(){
        return $this->_where;
    }

    public function join(){
        return $this->_join;
    }
    
    public static function create(){
        return new SqlBuilder();
    }

    public function select($columns = null){
        if($columns === null) $this->select[] = "*.$this->from";
        else if(is_string($columns)) $this->select[] = $columns;
        else if(is_array($columns)) $this->select = array_merge($this->select, $columns);

        return $this;
    }

    public function from($table){
        $this->from = $table;

        return $this;
    }

    public function orderBy($orders = array()){
        if(is_string($orders)) $this->orders[] = $orders;
        else $this->orders = array_merge($this->orders, $orders);
        
        return $this;
    }
    
    public function limit($down, $up = null){
        $this->limitDown = $down;
        $this->limitUp = $up;
    }

    public function getParameters(){        
        return $this->parameter->get();
    }

    public function setDebug($isDebug){        
        $this->parameter->setDebug($isDebug);

        return $this;
    }

    public function getSql(){
        $sql = array();
        $sql[] = "SELECT " . implode(', ', $this->select) . " FROM $this->from";

        if(!$this->join()->isEmpty()){
            $sql[] = $this->join()->getSql();
        }

        if(!$this->where()->isEmpty()){
            $sql[] = "WHERE " . $this->where()->getSql();
        }

        if(count($this->orders) > 0){
            $sql[] = "ORDER BY " . implode(", ", $this->orders);
        }

        if($this->limitDown !== null && $this->limitUp !== null){
            $sql[] = "LIMIT $this->limitDown, $this->limitUp";
        }else if($this->limitDown !== null){
            $sql[] = "LIMIT $this->limitDown";
        }

        return implode(" ", $sql);
    }

}