(function () {
	'use strict';

	angular
		.module('APP')
		.directive('stopEvent', stopEvent);

	stopEvent.$inject = [];

	function stopEvent() {
		var directive = {
			restrict: 'A',
			link: linkFunc
		};

		return directive;

		function linkFunc(scope, element, attr) {
			if (attr && attr.stopEvent) {
				element.bind(attr.stopEvent, function (e) {
					e.stopPropagation();
				});
			}
		}
	}
})();