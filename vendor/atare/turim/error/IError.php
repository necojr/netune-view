<?php

namespace atare\turim\error;

interface IError{

    public function run($type, $errno, $errstr);

}