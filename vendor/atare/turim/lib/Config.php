<?php

namespace atare\turim\lib;

use atare\turim\http\Url;
use atare\turim\lib\ObjectAbstract;
 
class Config{

    public static function set($section, $key, $value, $filename = false){
        $configs = array();

        $host = Url::current()->host();
        if(strpos($host, 'local') > -1 && file_exists("config.local.ini")){
            $file = "config.local.ini";
            $configs = Config::readFileIni("config.local.ini");
        }else{
            $file = 'config.ini';
            $configs = Config::readFileIni($file);
        }

        if($filename == false){
            $filename = $file;
        }

        if(!isset($section)) $configs[$section] = array();

        $configs[$section][$key] = $value;

        Config::writeFileIni($configs, $filename);
    }

    public static function get($section, $key, $filename = false){
        $configHost = array();
        $configLocal = array();

        $host = Url::current()->host();
        if(strpos($host, 'local') > -1 && file_exists("config.local.ini")){
            $configHost = Config::readFileIni("config.local.ini");
        }

        if($filename == false) {
            $configLocal = Config::readFileIni('config.ini');
        }else{
            $configLocal = Config::readFileIni($filename);
        }

        $configs = ObjectAbstract::extend($configLocal, $configHost);

        if(!isset($configs[ $section ])) return '';
        if(!isset($configs[ $section ][ $key ])) return '';

        return $configs[ $section ][ $key ];
    }

    private static function readFileIni($filename){
        return parse_ini_file($filename, true, INI_SCANNER_RAW);
    }

    private static function writeFileIni($configs, $filename = false){
        $content = "";
        $firstInterate = true;

        foreach ($configs as $key => $elem) {
            if($firstInterate){
                $firstInterate = false;
                $content .= "[" . $key . "]\n";
            }else{
                $content .= PHP_EOL . "[" . $key . "]\n";
            }

            foreach ($elem as $key2 => $elem2) {
                if (is_array($elem2)) {
                    for ($i = 0; $i < count($elem2); $i++) {
                        $content .= $key2 . "[] = \"" . $elem2[$i] . "\"\n";
                    }
                } else if ($elem2 == "") {
                    $content .= $key2 . " = \n";
                } else{
                    $content .= $key2 . " = " . $elem2 . "\n";
                }
            }
        }

        if($filename == false){
            $filename = 'config.ini';
        }

        if (!$handle = fopen($filename, 'w')) {
            return false;
        }

        if (!fwrite($handle, $content)) {
            return false;
        }

        fclose($handle);
        return true;
    }

}