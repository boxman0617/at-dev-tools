function AtDevAlertBoxDirective() {
	return {
		controller: [
			'$scope',
			'AtDevExceptionService',
			'$cookies',
			'$filter',

			AtDevAlertBoxController
		],
		template: '<div ng-show="hasException" ng-class="modalState" ng-if="showModal">' +
                    '<div class="dev-header">' +
                        'Errors! ({{exceptions.length}}) ' +
                        '<div class="close-button" ng-click="toggleModal()"><i class="fa" ng-class="closeButtonIcon"></i></div>' +
                        '<div class="move-button" ng-click="moveMin()"><i class="fa"></i></div>' +
                        '<div class="exit-button" ng-click="exitModal()"><i class="fa fa-times"></i></div>' +
                    '</div>' +
                    '<div class="dev-question" ng-if="askQuestion">' +
                        'Do not show this dialog for: ' +
                        '<div class="input-group">' +
                            '<select class="form-control input-sm" ng-model="hours" ng-options="hour for hour in optionsHours" ng-change="exitDialog()"></select>' +
                            '<span class="input-group-addon">Hrs</span>' +
                        '</div>' +
                        '<button type="button" ng-click="exitDialog()" class="btn btn-danger btn-xs btn-block">Close</button>' +
                    '</div>' +
                    '<div class="dev-body">' +
                        '<div ng-repeat="exception in exceptions">' +
                            '<div class="title" ng-click="openException($index)">' +
                                '{{$index + 1}} - {{exception.cause}}' +
                            '</div>' +
                            '<div class="info" ng-show="openIndex == $index">' +
                                '<div class="exception">Exception: {{exception.exception.message}}</div>' +
                                '<div class="stack">Stack: <pre>{{exception.exception.stack}}</pre></div>' +
                                '<div class="cause">Cause: {{exception.cause}}</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>'
	};
}