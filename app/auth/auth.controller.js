(function () {
	'use strict';
	angular
		.module('APP')
		.controller('Auth', Auth);

	Auth.$inject = ['Auth', '$rootScope', '$state'];

	function Auth(Auth, $rootScope, $state) {
		var vm = this;

		vm.login = login;

		function login() {
			Auth.login('richardluo0506@gmail.com', vm.passwordInput);
		}
	}
})();