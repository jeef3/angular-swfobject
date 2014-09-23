angular.module('jeef3.swfobject', [])
  .directive('swfObject', function ($window) {
    'use strict';

    // TODO: Error if SWFObject not found

    var swfobject = $window.swfobject;

    return {
      restrict: 'EAC',
      scope: {
        callbacks: '&swfCallbacks'
      },

      link: function postLink(scope, element, attrs) {
        swfobject.embedSWF(attrs.swfObject || attrs.src,
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
  });
