function AtDevExceptionHandlingDecorator(AtDevExceptionService, $delegate) {
	return function(exception, cause) {
		AtDevExceptionService.triggerExceptionHandling(exception, cause);
		$delegate(exception, cause);
	};
}