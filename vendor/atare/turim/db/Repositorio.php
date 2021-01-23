<?php

namespace atare\turim\db;

use atare\turim\lib\Config;
use atare\turim\model\AbstractModel;
use atare\turim\sql\SqlBuilder;
use PDO;
 
class Repositorio{

    private static $repo = null;

    public $db;
    protected $classname = '';

    public function __construct($classname = null){
        $this->classname = $classname;

        $engine = Config::get('db', 'engine');
        $host   = Config::get('db', 'host');
        $user   = Config::get('db', 'user');
        $pass   = Config::get('db', 'pass');
        $dbname = Config::get('db', 'dbname');

        if($this->db == null){
            if($engine == 'mysql'){
                $this->db = new PDO("$engine:host=$host;dbname=$dbname", $user, $pass,
                    array(
                        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8'"
                    )
                );
            }else{
                $this->db = new PDO("$engine:host=$host;dbname=$dbname", $user, $pass);
            }

            $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }
    }

    public function setClass($classname){
        $this->classname = $classname;

        return $this;
    }

    public static function getInstance(){
        if(Repositorio::$repo == null) Repositorio::$repo = new Repositorio();

        return Repositorio::$repo;
    }

    public function beginTransaction(){
        $this->db->beginTransaction();
    }

    public function endTransaction(){
        $this->db->commit();
    }

    public function stopTransaction(){
        $this->db->rollback();
    }
    
    public function getLastInsertId($seqName = null){
        return $seqName == null ? $this->db->lastInsertId() : $this->db->lastInsertId($seqName);
    }

    public function insert($tablename, $seqname, $model = null){
        $arr = array();

        if(is_object($seqname) || is_array($seqname)){
            $model = $seqname;
            $seqname = null;
        }

        if(is_object($model)) {
            unset($model->id);
            $arr = get_object_vars($model);
        }

        if(is_array($model)) $arr = $model;
        if($model instanceof AbstractModel) $arr = $model->convertToArray();
        
        $keys = array_keys( $this->extractPropertys($arr) );
        
        $columns    = $this->convertKeysToColumnsName( $keys );
        $values     = $this->convertModelToArray( $arr, $keys );
        $parameters = $this->convertKeysToParameters( $keys, $arr );

        $this->execute("INSERT INTO $tablename ($columns) VALUES ($parameters)", $values);

        $id = false;
        if($seqname == null) $id = $this->getLastInsertId();
        else $id = $this->getLastInsertId($seqname);

        if(is_array($model)) $model = (object)$model;
        
        $model->id = $id;

        return $model;
    }

    public function insertList($tablename, $list){
        if(count($list) == 0) return $this;
        $arr = array();

        $model = $list[0];
        if(is_array($model)) $arr = $model;
        if($model instanceof AbstractModel) $arr = $model->convertToArray();

        $keys       = array_keys( $this->extractPropertys($arr) );
        $columns    = $this->convertKeysToColumnsName( $keys );

        $q = array();
        for ($i=0; $i < count($keys); $i++) { 
            $q[] = '?';
        }
        $p = '(' . implode(',', $q)  . ')';

        $v = array();
        for ($i=0; $i < count($list); $i++) { 
            $v[] = $p;
        }
        $v = implode(',', $v);

        $values = array();
        foreach ($list as $obj) {
            foreach ($obj as $key => $value) {
                if($value === null) continue;
                if(is_object($value)) continue;
                if(is_array($value)) continue;
                $values[] = $value;
            }
        }

        $sql = "INSERT INTO $tablename ($columns) VALUES $v";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($values);

        return $this;
    }

    public function update($tablename, $model){
        $arr = array();

        if(is_array($model)) $arr = $model;
        else if($model instanceof AbstractModel) $arr = $model->convertToArray();
        else $arr = get_object_vars ( $model );

        $keys   = array_keys( $this->extractPropertys($arr) );
        $values = $this->convertModelToArray( $arr, $keys );

        $set = array();
        foreach ($keys as $key) {
            $set[] = "$key = :$key";
        }

        $set = implode(', ', $set);

        $this->execute("UPDATE $tablename SET $set WHERE id = :id", $values);

        return $this;
    }

    public function delete($tablename, $nameId, $id = null){
        if($id == null){
            $id = $nameId;
            $nameId = 'id';
        }
        
        $this->execute("DELETE FROM $tablename WHERE $nameId = :id", array(
            ':id' => $id
        ));
    }

    public function execute($sql, $parameters = null){
        if($sql instanceof SqlBuilder){
            $parameters = $sql->getParameters();
            $sql = $sql->getSql();
        }

        $stmt = $this->db->prepare($sql);

        $this->sqlBindParams($parameters);
        $stmt->execute($parameters);
        
        return $this;
    }

    public function fetch($sql, $parameters = array(), $classes = null, $cb = null){
        if($sql instanceof SqlBuilder){
            $cb = $classes;
            $classes = count($parameters) == 0 ? null: $parameters;
            $parameters = $sql->getParameters();
            $sql = $sql->getSql();
        }
        
        $stmt = $this->db->prepare($sql);

        $this->sqlBindParams($parameters);

        if($classes === null){
            $this->sqlExecute($stmt, $parameters);

            return $stmt->fetch();
        }else{
            $arr = $this->sqlExecuteWithLambda($stmt, $parameters, $classes, $cb);
            if(count($arr) == 0) return $arr;
            else return $arr[0];
        }
    }

    public function count($sql, $parameters = array()){
        if($sql instanceof SqlBuilder){
            $parameters = $sql->getParameters();
            $sql = $sql->getSql();
        }

        $stmt = $this->db->prepare($sql);

        $stmt->setFetchMode(PDO::FETCH_NUM);
        $stmt->execute($parameters);

        return intval($stmt->fetch()[0]);
    }

    public function fetchAll($sql, $parameters = array(), $classes = null, $cb = null){
        if($sql instanceof SqlBuilder){
            $cb = $classes;
            $classes = count($parameters) == 0 ? null: $parameters;
            $parameters = $sql->getParameters();
            $sql = $sql->getSql();
        }

        $stmt = $this->db->prepare($sql);

        $this->sqlBindParams($stmt, $parameters);

        if($classes === null){
            $this->sqlExecute($stmt, $parameters);

            return $stmt->fetchAll();
        }else{
            return $this->sqlExecuteWithLambda($stmt, $parameters, $classes, $cb);
        }
    }

    private function isBindParameter($parameters){
        if(count($parameters) == 0) return false;

        foreach ($parameters as $key => $value) {
            if(is_array($value)) return true;
            if(is_object($value)) return true;
            break;
        }

        return false;
    }

    private function sqlBindParams($stmt, $parameters = array()){
        $isBindParameters = $this->isBindParameter($parameters);
        
        if($isBindParameters){
            foreach ($parameters as $key => $value) {
                $stmt->bindValue($key, $value);
            }
        }
    }

    private function sqlExecute($stmt, $parameters = array()){
        $isBindParameters = $this->isBindParameter($parameters);

        if(is_string($this->classname)){
            $stmt->setFetchMode(PDO::FETCH_CLASS, $this->classname);
        }else{
            $stmt->setFetchMode(PDO::FETCH_OBJ);
        }

        if($isBindParameters) $stmt->execute();
        if(!$isBindParameters && count($parameters) > 0) $stmt->execute($parameters);
        else $stmt->execute();
    }

    private function sqlExecuteWithLambda($stmt, $parameters = array(), $classes = null, $cb = null){
        $stmt->setFetchMode(PDO::FETCH_NUM);
        $stmt->execute($parameters);
        $columns = array();
        for($i = 0 ; $i < $stmt->columnCount() ; $i++)
        {
            array_push($columns, $stmt->getColumnMeta($i)['name']);
        }
        
        $results = array();

        $rows = $stmt->fetchAll();
        for ($i=0; $i < count($rows); $i++) { 
            $row = $rows[$i];
            $objIndex = 0;
            $params = array();
            $params[$objIndex] = new $classes[$objIndex]();
            for($j = 0; $j < count($columns) ; $j++){                
                if($columns[$j] == 'id' && $j > 0){                        
                    $objIndex++;
                    array_push($params, new $classes[$objIndex]());                    
                }

                if($row[$j] == 'true'){
                    $params[$objIndex]->{$columns[$j]} = true;
                }else if($row[$j] == 'false'){
                    $params[$objIndex]->{$columns[$j]} = false;
                }else{
                    $params[$objIndex]->{$columns[$j]} = $row[$j];
                }

            }
            array_push($results, call_user_func_array($cb, $params));
        }

        return $results;
    }

    private function convertKeysToParameters($keys, $values){
        $p = array();

        for($i = 0 ; $i < count($keys) ; $i++){
            $k = $keys[$i];
            $v = $values[$k];

            if($v instanceof SqlCommand){
                $p[] = $v->getCommand();
            }else{
                $p[] = ":$k";
            }
        }

        return implode(', ', $p);
    }

    private function convertKeysToColumnsName($keys){
        return implode(', ', $keys);
    }

    private function convertModelToArray($model, $keys){
        $values = array();
        $isArray = is_array($model);

        foreach ($keys as $value) {
            if($model[$value] instanceof SqlCommand) continue;
            if($isArray) $values[ ":$value" ] = $model[$value];
            else $values[ ":$value" ] = $model->$value;
        }

        return $values;
    }

    private function extractPropertys($obj){
        $arr = array();
        
        foreach ($obj as $key => $value) {
            if($value === null) continue;
            if(is_object($value) && !($value instanceof SqlCommand)) continue;
            if(is_array($value)) continue;

            $arr[ $key ] = $obj[$key];
        }

        return $arr;
    }

}