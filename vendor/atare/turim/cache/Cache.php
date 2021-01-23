<?php

namespace atare\turim\cache;

use atare\turim\lib\Config;
use atare\turim\io\File;
use atare\turim\io\Directory;

class Cache{

    private $id = null;
    private $items = array();
    private $directory = null;

    public function __construct($id, $directory = null){
        $this->id = $id;
        
        $this->directory = $directory;
        if($directory == null) $this->directory = Config::get('cache', 'directory');

        $this->loadItems();
    }

    public function setID($id){
        $this->id = $id;

        return $this;
    }

    public function getID(){
        return $this->id;
    }

    public static function all($directory){
        $caches = array();

        $files = Directory::readAllFiles($directory);

        foreach ($files as $key => $file) {
            $caches[] = new Cache(Cache::extractFileID($file), $directory);
        }

        return $caches;
    }

    private static function extractFileID($filename){
        $p = explode('file-', $filename);
        return $p[1];
    }

    public function loadItems(){
        $items = $this->deserialize();
        if($items == false) $items = array();

        $this->items = $items;

        return $this;
    }

    private function createObj($class){
        $newObj = null;
        if($class === false) $newObj = new \stdClass();
        else $newObj = new $class();

        return $newObj;
    }

    private function injectObj($obj, $class){
        $newObj = $this->createObj( $class );
        $properties = get_object_vars($obj);

        foreach ($properties as $key => $value) {
            $newObj->$key = $value;
        }

        return $newObj;
    }

    public function get($id){
        $index = $this->getIndexItem($id);
        if($index === false) return false;

        $protocol = $this->items[$index];
        $class = $protocol->class;        
        $obj = $protocol->obj;
        $result = null;

        if(is_array($obj)){
            $result = array();
            $arr = $obj;
            
            foreach ($arr as $obj) {                
                $result[] = $this->injectObj($obj, $class);
            }
        }else{
            $result = $this->injectObj($obj, $class);
        }

        return $result;
    }

    public function save(){
        $this->serialize();

        return $this;
    }

    public function set($id, $obj, $classname = null){
        $index = $this->getIndexItem($id);

        if($index === false) $this->add($id, $obj, $classname);
        else $this->update($id, $obj, $classname);

        return $this;
    }    

    public function add($id, $obj, $classname = null){
        $index = $this->getIndexItem($id);
        if($index !== false) return false;

        $this->addItem($id, $obj, $classname);

        return true;
    }

    public function update($id, $obj, $classname = null){
        $index = $this->getIndexItem($id);        
        if($index === false) return false;

        $this->remove($id);
        $this->addItem($id, $obj);

        return true;
    }

    public function remove($id){
        $index = $this->getIndexItem($id);
        if($index === false) return;

        array_splice($this->items, $index, 1);
    }

    public function destroy(){
        File::delete($this->getPath());
    }

    public function exist(){
        return File::exist($this->getPath());
    }

    public function isLoaded(){
        return count( $this->items ) == 0 ? false : true;
    }

    private function addItem($id, $obj, $classname = null){
        $protocol = $this->convertToProtocol($id, $obj, $classname);

        $this->items[] = $protocol;
    }

    private function convertToProtocol($id, $obj, $classname = null){
        return array(
            'id'    => $id,
            'class' => $classname == null ? (is_array($obj) ? false : get_class($obj)) : $classname,
            'obj'   => $obj
        );
    }

    private function getIndexItem($id){        
        foreach ($this->items as $key => $value) {     
            if(is_array($value)){
                 if($id == $value['id']) return $key;
            }
            else if($id == $value->id) return $key;
        }

        return false;
    }

    private function getPath(){
        return "$this->directory/file-$this->id";
    }

    private function serialize(){
        File::write($this->getPath(), json_encode($this->items));
    }

    private function deserialize(){
        return json_decode(File::read($this->getPath()));
    }

}