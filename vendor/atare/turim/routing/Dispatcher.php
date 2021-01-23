<?php

namespace atare\turim\routing;

use atare\turim\view\View;
use atare\turim\lib\Wrapper;
use atare\turim\lib\Config;
use atare\turim\http\Request;
 
class Dispatcher{

    protected $router;
    protected $errorDispatcher;

    public function __construct($router){
        $this->errorDispatcher = null;

        $this->router = $router;
        $this->router->load();
    }

    public function setErrorDispatcher($errorDispatcher){
        $this->errorDispatcher = $errorDispatcher;
    }

    public function invoke(){
        $controllerName = $this->router->getControllerName();
        $actionName = $this->router->getActionName();

        if($controllerName == 'SetErrorJs'){
            $this->errorDispatcher->invoke('js', $_GET['no'], $_GET['description']);
            return;
        }

        $controllerNamespace = Config::get('app', 'controller_namespace');
        if(strlen($controllerNamespace) == 0) $controllerNamespace = 'app\\mvc\\controllers';

        $controllerNameFull = "$controllerNamespace\\" . ucfirst($controllerName) . "Controller";
        
        if(!class_exists($controllerNameFull)){
            $bypass = Config::get('app', 'bypass');

            if(strlen($bypass) == 0){
                echo "controller $controllerName não implementada";
                die;
            }

            $controllerName = $bypass;
            $controllerNameFull = "$controllerNamespace\\" . ucfirst($controllerName) . "Controller";
        }
        
        $controller = new $controllerNameFull();
        $view = new View($controllerName, $actionName);
                
        if(!method_exists($controller, $actionName)){
            $bypass = Config::get('app', 'bypass');
            
            if(strlen($bypass) == 0){
                echo "action $actionName não implementada na controller $controllerName";
                die;
            }
            
            $controllerName = $bypass;
            $controllerNameFull = "$controllerNamespace\\" . ucfirst($controllerName) . "Controller";
            $actionName = 'index';

            $controller = new $controllerNameFull();
            $view = new View($controllerName, $actionName);
        }

        $actionContext = new ActionContext();
        $actionContext->view       = $view;
        $actionContext->controller = $controllerName;
        $actionContext->action     = $actionName;
        $actionContext->request    = Request::getInstance();

        $controller->filter->actionWillExecute($actionContext);
        
        if(!$actionContext->isExecute()){
            echo $actionContext->result;
            return;
        }

        $controller->init($view);

        $result = null;

        try {
            if($actionContext->request->isPost()){
                if($_SERVER["CONTENT_TYPE"]  == 'application/json'){
                    $result = call_user_func_array(array($controller, $actionName), array($actionContext->request->post->json()));
                }else{
                    $result = call_user_func_array(array($controller, $actionName), (array)$_POST);
                }
            }else{
                $result = call_user_func_array(array($controller, $actionName), (array)$_GET);
            }
        } catch (\Exception $e) {
            $result = Wrapper::error($e->getMessage());
        }

        if(is_object($result)) echo Wrapper::ok($result);
        else if(is_array($result)) echo Wrapper::ok($result);
        else if(is_string($result)) echo $result;
        else if(is_numeric($result)) echo $result;
        else $view->render();
    }

}