<?php

namespace app\filters;

use atare\turim\routing\Filter;
use atare\turim\lib\Wrapper;
use atare\turim\lib\Config;
use atare\turim\session\Auth;

Filter::add('auth', function($context){
    $auth = Auth::current();

    if($auth->session->hash == null){
        // return $context->request->redirectToRoute('/auth', array(
        //     'includeQueryString' => false
        // ));
    }
});
