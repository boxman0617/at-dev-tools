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
            onExceptionCallbacks[i].apply(null, [exception, cause]);
        }
    }
}