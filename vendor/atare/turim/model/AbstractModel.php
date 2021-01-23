<?php

namespace atare\turim\model;

class AbstractModel {

    private function convertUnderscoreToCamelCase($str){
        $p = explode('_', $str);
        $arr = array();
        $arr[] = $p[0];
        $count = count($p);
        for ($i = 1; $i < $count; $i++) { 
            $arr[] = ucwords($p[$i]);
        }

        return implode('', $arr);
    }

    public function inject($obj){
        $arr = $this->convertObjToArray( $obj );

        foreach ($arr as $key => $value) {
            $this->$key = $value;
        }

        return $this;
    }

    public function convertToArray(){
        return $this->convertObjToArray( $this );
    }

    public static function factory($arr = array()){
        if(is_object($arr)) return self::createObject($arr);
        if(is_array($arr)) return self::createArray($arr);
    }
    
    protected function convertObjToArray($obj){
        return get_object_vars ( $obj );
    }

    protected static function createArray($arr){
        $result = array();

        foreach ($arr as $obj) {
            $result[] = self::createObject($obj);
        }

        return $result;
    }

    protected static function createObject($obj){
        $class = get_called_class();
        $newObj = new $class();
        $newObj->inject($obj);

        return $newObj;
    }

}