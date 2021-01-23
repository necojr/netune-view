<?php

namespace atare\turim\routing;
 
class ActionFilter{

    private $filters = array();
    private $execute = true;

    public function __construct(){
        
    }

    public function stopPipe(){
        $this->execute = false;
    }

    public function register($action, $filters){
        if(!is_array($filters)) $filters = array($filters);
        foreach ($filters as $key => &$value) {
            $value = strtolower($value);
        }

        $this->filters[ $action ] = $filters;
    }

    public function actionWillExecute($actionContext){
        if(count($this->filters) == 0) return true;

        foreach ($this->filters as $actionName => $filters) {
            foreach ($filters as $filterName) {
                if($actionName == '*' || $actionName == $actionContext->action){
                    Filter::run($filterName, $actionContext);
                    if(!$actionContext->isExecute()) return;
                }
            }
        }

        return true;
    }

}