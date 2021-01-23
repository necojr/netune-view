<?php

namespace atare\turim\http;
 
class Get{

    public function query($name){
        $value = @$_GET[ $name ];

        return $value === false ? '' : $value;
    }
    
    public function exist($name){
        $value = @$_GET[ $name ];

        return $value === false ? false : true;
    }
}