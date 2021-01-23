<?php

namespace atare\turim\http;
 
class Cookie{

    public $name;
    public $value = '';
    public $path = '/';

    private $time = 0;

    public function __construct($name, $value){
        $this->name = $name;
        $this->value = $value;

        $this->setDays(1);
    }

    public function setDays($days){
        $this->setTime(86400 * $days);
    }

    public function setHours($hours){
        $this->setTime(3600 * $days);
    }

    public function setTime($time){
        $this->time = time() + $time;
    }

    public function getTime(){
        return $this->time;
    }

}