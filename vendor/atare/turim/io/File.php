<?php

namespace atare\turim\io;
 
class File{    

    public static function name($filename){
        $info = pathinfo($filename);

        return isset($info['filename']) ? $info['filename'] : false;
    }

    public static function move($from, $to){
        rename($from, $to);
    }    

    public static function extension($filename){
        $path_info = pathinfo( $filename );

        return isset($path_info['extension']) ? $path_info['extension'] : '';
    }

    public static function MB($total){
        return File::KB($total) * 1000;
    }

    public static function KB($total){
        return $total * 1000;
    }

    public static function exist($filename){
        return file_exists($filename);
    }

    public static function delete($filename){
        if(!File::exist($filename)) return true;

        unlink($filename);

        return false;
    }

    public static function read($filename){
        return @file_get_contents( $filename );
    }

    public static function write($filename, $content){
        file_put_contents($filename, $content);
    }

}