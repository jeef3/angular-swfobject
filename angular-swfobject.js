angular.module('swfobject', [])
  .factory('SwfObject', ['$window', function ($window) {
    return $window.swfobject;
  }])
  .directive('swfObject', ['$window', 'SwfObject', function ($window, SwfObject) {
    'use strict';

    return {
      restrict: 'EAC',
      template: '<div ng-transclude></div>',
      transclude: true,
      scope: {
        params: '=swfParams',
        attrs: '=swfAttrs',
        callbacks: '=swfCallbacks'
      },

      link: function link(scope, element, attrs) {
        SwfObject.embedSWF(attrs.swfUrl,
          element[0],
          attrs.swfWidth || 800,
          attrs.swfHeight || 600,
          attrs.swfVersion || '10',
          null,
          {},
          scope.params || {},
          scope.attrs || {});

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
