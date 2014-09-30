# Angular SWFObject

## Usage

``` html
<swf-object src="my-swf.swf" swf-id="my-swf-id"></swf-object>
```

Also supports defining controller level callbacks if using `ExternalInterface`:

**View**

``` html
<swf-object src="my-swf.swf"
    swf-id="my-swf-id"
    swf-callbacks="{'externalCallback': myCallback}"></swf-object>
```

**Controller**
``` JavaScript
angular.controller('MyCtrl', function ($scope) {
  $scope.myCallback = function () {
    console.log('Called from Flash');
  }
});
```

**ActionScript**

``` ActionScript
ExternalInterface.call('externalCallback');
```
