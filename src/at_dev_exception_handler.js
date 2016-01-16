function AtDevExceptionHandler($provide) {
	function init() {
		$provide.decorator('$exceptionHandler', [
			'AtDevExceptionService',
			'$delegate',

			AtDevExceptionHandlingDecorator
		]);
	}

	init();
}