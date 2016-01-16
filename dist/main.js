(function(window, angular, undefined) {
    "use strict";
    angular.module("atDev", []).factory("AtDevExceptionService", [ AtDevExceptionService ]).factory("AtDevHttpErrorHandlingInterceptor", [ "$q", "AtDevExceptionService", AtDevHttpErrorHandlingInterceptor ]).provider("AtEnv", AtEnvFactoryProvider).directive("atDevAlertBox", [ AtDevAlertBoxDirective ]).config([ "AtEnvProvider", "$compileProvider", function(AtEnvProvider, $compileProvider) {
        if (!$compileProvider.debugInfoEnabled()) {
            AtEnvProvider.setEnv(AtEnvProvider.ENVS.PROD);
        }
    } ]).config([ "$provide", AtDevExceptionHandler ]).config([ "$httpProvider", function($httpProvider) {
        $httpProvider.interceptors.push("AtDevHttpErrorHandlingInterceptor");
    } ]);
    function AtDevAlertBoxController($scope, AtDevExceptionService, $cookies, $filter) {
        var DEV_OPEN = "dev-open", DEV_CLOSE = "dev-close", DEV_ICON_OPEN = "fa-plus", DEV_ICON_CLOSE = "fa-minus", DEV_COOKIE_KEY = "devErrors", DEV_POSITION_BOTTOM_LEFT = "bottom-left", DEV_POSITION_BOTTOM_RIGHT = "bottom-right", DEV_POSITION_TOP_LEFT = "top-left", DEV_POSITION_TOP_RIGHT = "top-right", dialogSettings = {
            position: DEV_POSITION_BOTTOM_LEFT,
            hideFor: 0,
            hideFrom: null
        };
        $scope.hasException = false;
        $scope.showModal = true;
        $scope.exceptions = [];
        $scope.openIndex = 0;
        $scope.askQuestion = false;
        $scope.closeButtonIcon = [ DEV_ICON_CLOSE ];
        $scope.modalState = [ DEV_OPEN, DEV_POSITION_BOTTOM_LEFT ];
        $scope.optionsHours = [];
        for (var i = 1; i <= 24; i++) {
            $scope.optionsHours.push(i);
        }
        $scope.hours = $scope.optionsHours[0];
        $scope.exitModal = function() {
            $scope.openIndex = -1;
            $scope.askQuestion = true;
        };
        $scope.exitDialog = function() {
            dialogSettings.hideFor = parseInt($scope.hours);
            dialogSettings.hideFrom = new Date();
            $cookies.putObject(DEV_COOKIE_KEY, dialogSettings);
            $scope.showModal = false;
        };
        $scope.toggleModal = function() {
            if ($scope.modalState[0] === DEV_OPEN) {
                $scope.modalState[0] = DEV_CLOSE;
                $scope.closeButtonIcon[0] = DEV_ICON_OPEN;
            } else {
                $scope.modalState[0] = DEV_OPEN;
                $scope.closeButtonIcon[0] = DEV_ICON_CLOSE;
            }
        };
        $scope.moveMin = function() {
            var currentPos = dialogSettings.position;
            switch (currentPos) {
              case DEV_POSITION_BOTTOM_LEFT:
                dialogSettings.position = DEV_POSITION_TOP_LEFT;
                break;

              case DEV_POSITION_BOTTOM_RIGHT:
                dialogSettings.position = DEV_POSITION_BOTTOM_LEFT;
                break;

              case DEV_POSITION_TOP_LEFT:
                dialogSettings.position = DEV_POSITION_TOP_RIGHT;
                break;

              case DEV_POSITION_TOP_RIGHT:
                dialogSettings.position = DEV_POSITION_BOTTOM_RIGHT;
                break;
            }
            $scope.modalState[1] = dialogSettings.position;
            $cookies.putObject(DEV_COOKIE_KEY, dialogSettings);
        };
        $scope.openException = function($index) {
            if ($scope.openIndex === $index) {
                $scope.openIndex = -1;
            } else {
                $scope.openIndex = $index;
            }
        };
        function displayDialog() {
            var from = dialogSettings.hideFrom;
            if (from !== null) {
                from = new Date(from);
                var now = new Date();
                from.setHours(from.getHours() + dialogSettings.hideFor);
                if (from < now) {
                    dialogSettings.hideFor = 0;
                    dialogSettings.hideFrom = null;
                    $cookies.putObject(DEV_COOKIE_KEY, dialogSettings);
                    return true;
                } else {
                    $scope.showModal = false;
                    return false;
                }
            } else {
                return true;
            }
        }
        function parseHttpException(exception, cause) {
            var e = {
                exception: exception,
                cause: cause
            };
            e.exception.stack = $filter("json")(exception.stack);
            return e;
        }
        function parseRegularException(exception, cause) {
            var e = {
                exception: exception,
                cause: cause
            };
            return e;
        }
        function init() {
            var cookie = $cookies.getObject(DEV_COOKIE_KEY);
            if (typeof cookie !== "undefined") {
                dialogSettings = cookie;
            }
            $scope.modalState[1] = dialogSettings.position;
            if (displayDialog()) {
                AtDevExceptionService.onException(function(exception, cause) {
                    if (exception instanceof AtHttpException) {
                        $scope.exceptions.push(parseHttpException.apply(null, arguments));
                    } else {
                        $scope.exceptions.push(parseRegularException.apply(null, arguments));
                    }
                    $scope.hasException = true;
                });
            }
        }
        init();
    }
    function AtDevAlertBoxDirective() {
        return {
            controller: [ "$scope", "AtDevExceptionService", "$cookies", "$filter", AtDevAlertBoxController ],
            template: '<div ng-show="hasException" ng-class="modalState" ng-if="showModal">' + '<div class="dev-header">' + "Errors! ({{exceptions.length}}) " + '<div class="close-button" ng-click="toggleModal()"><i class="fa" ng-class="closeButtonIcon"></i></div>' + '<div class="move-button" ng-click="moveMin()"><i class="fa"></i></div>' + '<div class="exit-button" ng-click="exitModal()"><i class="fa fa-times"></i></div>' + "</div>" + '<div class="dev-question" ng-if="askQuestion">' + "Do not show this dialog for: " + '<div class="input-group">' + '<select class="form-control input-sm" ng-model="hours" ng-options="hour for hour in optionsHours" ng-change="exitDialog()"></select>' + '<span class="input-group-addon">Hrs</span>' + "</div>" + '<button type="button" ng-click="exitDialog()" class="btn btn-danger btn-xs btn-block">Close</button>' + "</div>" + '<div class="dev-body">' + '<div ng-repeat="exception in exceptions">' + '<div class="title" ng-click="openException($index)">' + "{{$index + 1}} - {{exception.cause}}" + "</div>" + '<div class="info" ng-show="openIndex == $index">' + '<div class="exception">Exception: {{exception.exception.message}}</div>' + '<div class="stack">Stack: <pre>{{exception.exception.stack}}</pre></div>' + '<div class="cause">Cause: {{exception.cause}}</div>' + "</div>" + "</div>" + "</div>" + "</div>"
        };
    }
    function AtDevExceptionHandler($provide) {
        function init() {
            $provide.decorator("$exceptionHandler", [ "AtDevExceptionService", "$delegate", AtDevExceptionHandlingDecorator ]);
        }
        init();
    }
    function AtDevExceptionHandlingDecorator(AtDevExceptionService, $delegate) {
        return function(exception, cause) {
            AtDevExceptionService.triggerExceptionHandling(exception, cause);
            $delegate(exception, cause);
        };
    }
    function AtDevExceptionService() {
        var onExceptionCallbacks = [];
        return {
            onException: onException,
            triggerExceptionHandling: triggerExceptionHandling
        };
        function onException(cb) {
            onExceptionCallbacks.push(cb);
        }
        function triggerExceptionHandling(exception, cause) {
            for (var i in onExceptionCallbacks) {
                onExceptionCallbacks[i].apply(null, [ exception, cause ]);
            }
        }
    }
    function AtDevHttpErrorHandlingInterceptor($q, AtDevExceptionService) {
        return {
            responseError: function(res) {
                var deferred = $q.defer();
                AtDevExceptionService.triggerExceptionHandling(new AtHttpException("[" + res.status + "] " + res.config.url, res), "HTTP Exception [" + res.config.url + "] (" + res.status + ")");
                deferred.reject(res);
                return deferred.promise;
            }
        };
    }
    function AtEnvFactoryProvider() {
        this.ENVS = {
            DEV: "DEV",
            PROD: "PROD"
        };
        var _env = this.ENVS.DEV;
        this.setEnv = function(env) {
            _env = env;
        };
        this.$get = [ function() {
            return {
                _env: _env,
                is: function() {
                    return this._env;
                }
            };
        } ];
    }
    function AtHttpException(message, res) {
        this.message = message;
        this.stack = res;
    }
})(window, window.angular);