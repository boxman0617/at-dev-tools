angular.module('atDev', [])
	.factory('AtDevExceptionService', [
		AtDevExceptionService
	])
	.factory('AtDevHttpErrorHandlingInterceptor', [
		'$q',
		'AtDevExceptionService',

		AtDevHttpErrorHandlingInterceptor
	])
	.provider('AtEnv', AtEnvFactoryProvider)
	.directive('atDevAlertBox', [
		AtDevAlertBoxDirective
	])
	.config([
		'AtEnvProvider',
		'$compileProvider',

		function(AtEnvProvider, $compileProvider) {
			if(!$compileProvider.debugInfoEnabled()) {
                AtEnvProvider.setEnv(AtEnvProvider.ENVS.PROD);
            }
		}
	])
	.config([
		'$provide',

		AtDevExceptionHandler
	])
	.config([
		'$httpProvider',

		function($httpProvider) {
			$httpProvider.interceptors.push('AtDevHttpErrorHandlingInterceptor');
		}
	]);