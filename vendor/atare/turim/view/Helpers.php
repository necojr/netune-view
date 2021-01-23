<?php

namespace atare\turim\view;

use Exception;

class Helpers{

    protected $helpers;

    public function __construct(){
        $this->helpers = array();
    }

    public function add($key, $class){
        $this->helpers[$key] = $class;

        return $this;
    }

    public function parse($tpl){
        $tokens = $this->extractTokens($tpl);

        foreach ($tokens as &$token) {
            $token['value'] = $this->extractValue($token);
        }

        return $tokens;
    }

    private function extractValue($token){
        $helper = $this->createHelper($token);

        $this->executeHelper($helper);

        return $this->getHelperValue($helper);
    }

    private function createHelper($token){
        $classname = $token['classname'];
        if(!class_exists($classname)){
            throw new Exception("Helper $classname nao implementado", 1);
        }

        $helper = new $token['classname']();
        $helper->set($token['param']);
        return $helper;
    }

    private function executeHelper($helper){
        $helper->execute();
    }

    private function getHelperValue($helper){
        return $helper->get();
    }

    private function replace($old, $new,  $tpl){
        return str_replace($old, $new, $tpl);
    }

    private function extractTokens($tpl){
        $tokens = array();

        foreach ($this->helpers as $key => $value) {
            $i = 0;
            while (true) {
                $i = strpos($tpl, $key, $i);
                if($i === false) break;
                
                $i = strpos($tpl, ':', $i + 1);
                if($i === false) break;
                
                $i++;
                $f = strpos($tpl, '}}', $i + 1);
                if($f === false) break;

                $name = $key;
                $param = substr($tpl, $i, $f - $i);
                $stmt = $key . ':'. $param;

                $i = $f + 1;
                
                $tokens[] = array(
                    'name' => $name,
                    'param' => $param,
                    'stmt'  => $stmt,
                    'classname' => $value
                );    
            }
        }

        return $tokens;
    }

}