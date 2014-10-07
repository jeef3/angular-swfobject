angular.module('swfobject', [])
  .factory('SwfObject', ['$window', function ($window) {
    return $window.swfobject;
  }])
  .directive('swfObject', ['$window', '$timeout', 'SwfObject', function ($window, $timeout, SwfObject) {
    'use strict';

    return {
      restrict: 'EAC',
      template: '<div id="{{id}}" ng-transclude></div>',
      transclude: true,
      scope: {
        params: '=swfParams',
        attrs: '=swfAttrs',
        callbacks: '=swfCallbacks'
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
            null,
            scope.params,
            scope.attrs);
        }, 0);

        if (scope.callbacks) {
          var cbs = scope.callbacks;
          var cbNames = Object.keys(cbs);

          cbNames.forEach(function (cbName) {
            $window[cbName] = cbs[cbName];
          });
        }
      }
    };
  }]);
