<?php

namespace atare\turim\http;

class Post{
    
    public function json(){
        $raw = $this->raw();
        if($raw == false) return false;

        return json_decode( $raw );
    }

    public function query($name){
        if(!isset($_POST[ $name ])) return false;
        else return $_POST[ $name ];
    }

    public function get($name){
        return $this->query($name);
    }

    public function raw(){
        return @file_get_contents("php://input");
    }

}