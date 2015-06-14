# Angular SWFObject

## Usage

Minimal usage:

``` html
<swf-object swf-url="my-swf.swf"></swf-object>
```

Width, height and version are required parameters for SWFObject. If these are not provided then `angular-swfobject` defaults to: 800x600, version 10. You can override these.

``` html
<swf-object
  swf-url="my-swf.swf"
  swf-width="100%"
  swf-height="100%"
  swf-version="10.2"></swf-object>
```

You can also add additional parameters:

``` html
<swf-object
  swf-url="my-swf.swf"
  swf-params="{
    wmode: 'opaque'
  }"></swf-object>
```

Specify flash vars:

``` html
<swf-object
  swf-url="my-swf.swf"
  swf-vars="{
    user: 'alice'
  }"></swf-object>
```

Register a callback for swf load complete:
[check swfobject.embedSWF callback documentation](https://code.google.com/p/swfobject/wiki/api)

``` html
<swf-object
  swf-url="my-swf.swf"
  swf-load="onLoadHandler(evt)"
  ></swf-object>
```

###### http://learnswfobject.com/the-basics/adobes-express-install/
Specify expressInstallSwfurl : 
``` html
<swf-object
  swf-url="my-swf.swf"
  <!--- optional expressInstall.swf packaged with swfobject -->
  xi-swf-url-str="expressInstall.swf" 
  ></swf-object>
```

Also supports defining controller level callbacks if using `ExternalInterface` for example:

**View**

``` html
<swf-object 
    swf-url="my-swf.swf"
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
