<?php

namespace atare\turim\lib;

class Paging{

    public $page;
    public $totalPerPage;
    public $totalRecords;

    public function __construct($page = 0, $totalPerPage = 0){
        $this->page = intval($page);
        $this->totalPerPage = intval($totalPerPage);
    }

    public function getLimitDown(){
        $down = ($this->page - 1) * $this->totalPerPage;
        return $down < 0 ? 0 : $down;
    }

    public function getLimitUp(){
        return $this->totalPerPage;
    }

    public function setTotalRecords($totalRecords){
        $this->totalRecords = $totalRecords;
        $this->total = ceil($totalRecords / $this->totalPerPage);
    }

}