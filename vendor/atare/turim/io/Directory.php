<?php

namespace atare\turim\io;

class Directory{

    public static function readAllFiles($directory){
        $files = scandir($directory);

        array_splice($files, 0, 1);
        array_splice($files, 0, 1);

        return $files;
    }

    public static function dir(){
        $dir = __DIR__;
        
        for ($i=0; $i < 4; $i++) { 
            $dir = dirname($dir);
        }

        return $dir;
    }

}