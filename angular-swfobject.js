angular.module('swfobject', [])
    .factory('SwfObject', ['$window', function ($window) {
        return $window.swfobject;
    }])
    .directive('swfObject', ['$window', '$timeout', '$interval', 'SwfObject', function ($window, $timeout, $interval, SwfObject) {
        'use strict';

        return {
            restrict: 'EAC',
            template: '<div id="{{id}}" ng-transclude></div>',
            transclude: true,
            scope: {
                params: '=swfParams',
                attrs: '=swfAttrs',
                vars: '=?swfVars',
                callbacks: '=swfCallbacks',
                swfLoad: '&'
            },

            link: function link(scope, element, attrs) {

                scope.id = attrs.swfId ||
                    // Random hash looking thing
                'swf-' + Math.floor(Math.random() * 1000000000000).toString(16);

                $timeout(function () {
                    SwfObject.embedSWF(attrs.swfUrl,
                        scope.id,
                        attrs.swfWidth || 800,
                        attrs.swfHeight || 600,
                        attrs.swfVersion || '10',
                        null,
                        scope.vars,
                        scope.params,
                        scope.attrs,
                        embedHandler);
                }, 0);

                if (scope.callbacks) {
                    var cbs = scope.callbacks;
                    var cbNames = Object.keys(cbs);

                    cbNames.forEach(function (cbName) {
                        $window[cbName] = cbs[cbName];
                    });
                }


                // http://learnswfobject.com/advanced-topics/executing-javascript-when-the-swf-has-finished-loading/
                function swfLoadEvent(evt, fn){
                    //This timeout ensures we don't try to access PercentLoaded too soon
                    $timeout(function (){
                        //Ensure Flash Player's PercentLoaded method is available and returns a value
                        if(typeof evt.ref.PercentLoaded !== "undefined" && evt.ref.PercentLoaded()){
                            //Set up a timer to periodically check value of PercentLoaded
                            var loadCheckInterval = $interval(function (){
                                //Once value == 100 (fully loaded) we can do whatever we want
                                if(evt.ref.PercentLoaded() === 100){
                                    //Clear interval
                                    $interval.cancel(loadCheckInterval);
                                    loadCheckInterval = null;
                                    //Execute function
                                    fn();
                                }
                            }, 1500);
                        }
                    }, 200);
                }

                //This function is invoked by SWFObject once the <object> has been created
                function embedHandler (evt){
                    //Only execute if SWFObject embed was successful
                    if(!evt.success || !evt.ref){
                        return false;
                    }
                    if(scope.swfLoad) {
                        swfLoadEvent(evt, function () {
                            scope.swfLoad();
                        });
                    }

                }
            }
        };
    }]);
