<?php

namespace atare\turim\db;

class SqlCommand{

    private $command;

    public function __construct($command){
        $this->command = $command;
    }

    public function getCommand(){
        return $this->command;
    }

}