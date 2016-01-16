function AtDevHttpErrorHandlingInterceptor($q, AtDevExceptionService) {
	return {
        responseError: function(res) {
            var deferred = $q.defer();

            AtDevExceptionService.triggerExceptionHandling(
                new AtHttpException('[' + res.status + '] ' + res.config.url, res),
                'HTTP Exception [' + res.config.url + '] (' + res.status + ')'
            );
            deferred.reject(res);

            return deferred.promise;
        }
    };
}