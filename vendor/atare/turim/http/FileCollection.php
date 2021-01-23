<?php

namespace atare\turim\http;
 
class FileCollection{

    public function count(){
        return count($_FILES);
    }

    public function all(){
        $files = array();

        foreach ($_FILES as $_file) {
            $files[] = new File( $_file );
        }

        return $files;
    }

    public function first(){
        if($this->count() == 0) return false;
        else return $this->all()[0];
    }

    public function debug(){
        var_dump($_FILES);
    }

}