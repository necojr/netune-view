<?php

namespace atare\turim\http;

use atare\turim\lib\UUID;
use atare\turim\io\File as IOFile;
 
class File{

    public $name;
    public $type;
    public $size;
    public $hash;

    private $temp;
    private $error;
    private $directory;

    public function __construct($file){
        $this->name = $file['name'];
        $this->type = $file['type'];
        $this->size = $file['size'];
        $this->error = $file['error'];
        $this->temp = $file['tmp_name'];

        $this->hash = UUID::create(1) . "."  . $this->getExtension();
    }

    public function getName(){
        return IOFile::name($this->name);
    }

    public function getExtension(){
        return IOFile::extension($this->name);
    }

    public function getDirectoryTemporary(){
        return $this->temp;
    }

    public function setDirectory($directory){
        $this->directory = $directory;
    }

    public function getFullPath(){
        $filename = "$this->directory/$this->hash";

        return $filename;
    }

    public function getTemporaryFullPath(){
        return $this->temp;
    }

    public function isImage(){
        return strpos(strtolower($this->type), 'image') === false ? false : true;
    }

    public function save($directory = null){
        if($directory != null) $this->setDirectory($directory);

        move_uploaded_file($this->temp, $this->getFullPath());
    }

}