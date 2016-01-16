function AtEnvFactoryProvider() {
	this.ENVS = {
        DEV: 'DEV',
        PROD: 'PROD'
    };

    var _env = this.ENVS.DEV;

    this.setEnv = function(env) {
        _env = env;
    };

    this.$get = [
        function() {
            return {
                _env: _env,
                is: function() {
                    return this._env;
                }
            };
        }
    ];
}