<?php

namespace atare\turim\view;

use atare\turim\lib\Config;
use atare\turim\io\File;
 
class Template{
    
    public $helpers;

    protected $variables;
    protected $content;

    public function __construct($filename){
        if(File::exist($filename)){
            $this->content = File::read($filename);
        }else{
            $this->content = $filename;
        }

        $this->variables = array();
        $this->helpers = new Helpers();
    }

    public function inject($variables){
        $this->variables = $variables;
        
        return $this;
    }

    public function add($key, $value){
        $this->variables[$key] = $value;

        return $this;
    }

    public function render(){
        $this->injectHelpers();
        $this->injectVariables();
        
        return $this->content;
    }

    private function injectVariables(){
        foreach ($this->variables as $key => $value) {
            if(is_array($value)) $value = json_encode($value);
            if(is_object($value)) $value = json_encode($value);

            // $this->content = str_replace("{{{$key}}}", $value, $this->content);
            $this->content = str_replace($key, $value, $this->content);
        }

        return $this;
    }

    private function injectHelpers(){
        $tokens = $this->helpers->parse($this->content);

        foreach ($tokens as $token) {
            $this->variables[$token['stmt']] = $token['value'];
        }        
    }
}