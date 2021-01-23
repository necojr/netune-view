<?php

namespace atare\turim\session;


interface IAuthRepositorio{

    public function fetch($hash);
    public function insert($hash, $user);
    public function update($hash, $user);
    public function delete($hash);
    public function exist($hash);

}