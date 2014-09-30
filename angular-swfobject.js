angular.module('swfobject', [])
  .factory('SwfObject', ['$window', function ($window) {
    return $window.swfobject;
  }])
  .directive('swfObject', ['$window', 'SwfObject', function ($window, SwfObject) {
    'use strict';

    return {
      restrict: 'EAC',
      scope: {
        callbacks: '&swfCallbacks'
      },

      link: function link(scope, element, attrs) {
        SwfObject.embedSWF(attrs.swfObject || attrs.src,
          element[0],
          attrs.swfWidth || 800,
          attrs.swfHeight || 600,
          10,
          null,
          {},
          {},
          { id: attrs.swfId });

        if (scope.callbacks) {
          var cbs = scope.callbacks();
          var cbNames = Object.keys(cbs);

          cbNames.forEach(function (cbName) {
            $window[cbName] = cbs[cbName];
          });
        }
      }
    };
  }]);
