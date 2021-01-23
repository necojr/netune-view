<?php

namespace atare\turim\lib;

class String{

    public static function format($str){
        $numargs = func_num_args();
        $args = func_get_args();

        for ($i = 0; $i < $numargs - 1; $i++) {
            $p = '{' . $i . '}';
            $str = str_replace($p, $args[$i + 1], $str);
        }

        return $str;
    }

    public static function firstAndLastWord($text){
        $arr = explode(' ',$text);
        
        if(count($arr) == 0) return '';
        if(count($arr) == 1) return $arr[0];

        $first_word = $arr[0];
        $last_word  = $arr[count($arr) - 1];

        return "$first_word $last_word";
    }

	public static function decode($text){
		return html_entity_decode(urldecode(trim($text)));
	}

    public static function decodeHtml($html){
        return utf8_encode(html_entity_decode(urldecode($html)));
    }
	
	public static function removeAcentos($string){
		return preg_replace(array("/(á|à|ã|â|ä)/","/(Á|À|Ã|Â|Ä)/","/ç/","/Ç/","/(é|è|ê|ë)/","/(É|È|Ê|Ë)/","/(í|ì|î|ï)/","/(Í|Ì|Î|Ï)/","/(ó|ò|õ|ô|ö)/","/(Ó|Ò|Õ|Ô|Ö)/","/(ú|ù|û|ü)/","/(Ú|Ù|Û|Ü)/","/(ñ)/","/(Ñ)/"),explode(" ","a A c C e E i I o O u U n N"),$string);
	}

}