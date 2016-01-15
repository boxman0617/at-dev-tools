# at-dev-tools
Dev tools for Angular projects

## Install

```
bower install --save at-dev-tools
```

## Usage

Register this module within your Angular app
```javascript
(function() {
	angular.module('YourApp', ['atDev']);
})();
```

Put this directive in your main "layout" page
```html
<div at-dev-alert-box></div>
```

## Description
This will create a modal type alert box whenever an AngularJS, Javascript, or $http error occurs.

The alert box will be turned off automatically when you turn off Angular's debug info