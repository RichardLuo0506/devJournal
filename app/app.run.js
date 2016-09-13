(function () {
	'use strict';
	angular
		.module('APP')
		.run(run);

	run.$inject = ['screenSize', '$rootScope', 'Auth', '$state', '$timeout', '$anchorScroll'];

	function run(screenSize, $rootScope, Auth, $state, $timeout, $anchorScroll) {
		// // screensize
		// screenSize.rules = {
		// 	xs: '(max-width: 768px)',
		// 	sm: '(min-width: 769px) and (max-width: 992px)',
		// 	md: '(min-width: 993px) and (max-width: 1200px)',
		// 	lg: '(min-width: 1201px) and (max-width: 1600px)',
		// 	xl: '(min-width: 1601px)'
		// };

		// if (screenSize.is('xs')) {
		// 	$rootScope.showNavLinks = false;
		// } else {
		// 	$rootScope.showNavLinks = true;
		// }

		// state change
		$rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
			var requireLogin = toState.requireLogin;
			Auth.waitForAuth().then(function (user) {
				if (requireLogin && !user) {
					event.preventDefault();
					$state.go("auth.login");
				}
			});
		});

		$rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
			// log prevState
			$rootScope.prevState = from.name;

			// scroll to top, thanks for nothing dumb behavior
			$anchorScroll();
		});

		// Auth state change
		Auth.onAuth(function (user) {
			$rootScope.user = user;
		});
	}
})();
