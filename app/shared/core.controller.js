(function () {
	'use strict';
	angular
		.module('APP')
		.controller('Core', Core);

	Core.$inject = ['$state', '$rootScope', '$scope', '$timeout', '$window', 'Auth'];

	function Core($state, $rootScope, $scope, $timeout, $window, Auth) {
		var core = this;
		$scope.$on('$stateChangeStart', hideView);
		$scope.$on('$stateChangeSuccess', showView);

		core.closeSidebar = closeSidebar;
		core.goPrevState = goPrevState;
		core.isActive = isActive;
		core.logout = logout;
		core.openSidebar = openSidebar;

		function closeSidebar() {
			core.sidebarShown = false;
		}

		function goPrevState() {
			$state.go($rootScope.prevState || 'blog.index');
		}

		function hideView() {
			core.showView = false;
			console.log('', 'state start');
		}

		function isActive(parent) {
			return $state.includes(parent);
		}

		function logout() {
			var loggedOut = Auth.logout();
			if ($state.current.requireLogin) {
				$state.go("auth.login");
			}
		}

		function openSidebar() {
			core.sidebarShown = true;
		}

		function showView() {
			$timeout(function () {
				core.showView = true;
				console.log('', 'state end');
			}, 150);
		}
	}
})();