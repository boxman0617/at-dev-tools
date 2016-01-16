function AtDevAlertBoxController($scope, AtDevExceptionService, $cookies, $filter) {
	var DEV_OPEN = 'dev-open',
        DEV_CLOSE = 'dev-close',
        DEV_ICON_OPEN = 'fa-plus',
        DEV_ICON_CLOSE = 'fa-minus',
        DEV_COOKIE_KEY = 'devErrors',
        DEV_POSITION_BOTTOM_LEFT = 'bottom-left',
        DEV_POSITION_BOTTOM_RIGHT = 'bottom-right',
        DEV_POSITION_TOP_LEFT = 'top-left',
        DEV_POSITION_TOP_RIGHT = 'top-right',
        dialogSettings = {
            position: DEV_POSITION_BOTTOM_LEFT,
            hideFor: 0,
            hideFrom: null
        };

    $scope.hasException = false;
    $scope.showModal = true;
    $scope.exceptions = [];
    $scope.openIndex = 0;
    $scope.askQuestion = false;
    $scope.closeButtonIcon = [DEV_ICON_CLOSE];
    $scope.modalState = [DEV_OPEN, DEV_POSITION_BOTTOM_LEFT];
    $scope.optionsHours = [];
    for(var i = 1; i <= 24; i++) {
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
        if($scope.modalState[0] === DEV_OPEN) {
            $scope.modalState[0] = DEV_CLOSE;
            $scope.closeButtonIcon[0] = DEV_ICON_OPEN;
        } else {
            $scope.modalState[0] = DEV_OPEN;
            $scope.closeButtonIcon[0] = DEV_ICON_CLOSE;
        }
    };

    $scope.moveMin = function() {
        var currentPos = dialogSettings.position;
        switch(currentPos) {
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
        if($scope.openIndex === $index) {
            $scope.openIndex = -1;
        } else {
            $scope.openIndex = $index;
        }
    };

    function displayDialog() {
        var from = dialogSettings.hideFrom;
        if(from !== null) {
            from = new Date(from);
            var now = new Date();
            from.setHours(from.getHours() + dialogSettings.hideFor);
            if(from < now) {
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

        e.exception.stack = $filter('json')(exception.stack);

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
        if(typeof cookie !== 'undefined') {
            dialogSettings = cookie;
        }

        $scope.modalState[1] = dialogSettings.position;

        if(displayDialog()) {
            AtDevExceptionService.onException(function(exception, cause) {
                if(exception instanceof AtHttpException) {
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