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
        callbacks: '=swfCallbacks',
        vars: '=?swfVars',
        expressInstallSwfurl:'=?xiSwfUrlStr',
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
            scope.expressInstallSwfurl,
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
        function swfLoadEvent(evt, fn) {
            //This interval ensures we don't try to access PercentLoaded too soon
            var startCheckInterval = $interval(function () {
                //Ensure Flash Player's PercentLoaded method is available
                if (typeof evt.ref.PercentLoaded !== 'undefined') {
                    $interval.cancel(startCheckInterval);
                    startCheckInterval = null;
                    // If percent loaded returns immediately, callback now
                    if (evt.ref.PercentLoaded() === 100) {
                        onLoaded();
                        return;
                    }
                    // Otherwise, set up a timer to periodically check value of PercentLoaded
                    var loadCheckInterval = $interval(function () {
                        //Once value == 100 (fully loaded) we can do whatever we want
                        if (typeof evt.ref.PercentLoaded !== 'function' ||
                            evt.ref.PercentLoaded() === 100) {
                            $interval.cancel(loadCheckInterval);
                            loadCheckInterval = null;
                            onLoaded();
                            return;
                        }
                    }, 500);
                }
            }, 100);

            function onLoaded() {
                setFocusOnFlash();
                fn({evt: evt});
            }
        }

        // https://code.google.com/p/swfobject/wiki/api
        function embedHandler(evt) {
          if (scope.swfLoad && typeof(scope.swfLoad) === "function") {
            // if failure no reason to go and check if flash is 100% loaded 
            if (!evt.success || !evt.ref) {
              scope.swfLoad({evt: evt});
            } else {
              swfLoadEvent(evt, scope.swfLoad);
            }
          }

        }
      }
    };
  }]);
