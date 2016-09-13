(function () {
	'use strict';
	angular
		.module('APP')
		.factory('Auth', Auth);

	Auth.$inject = ['$firebaseAuth', '$rootScope', '$state'];

	function Auth($firebaseAuth, $rootScope, $state) {
		var authObj = $firebaseAuth();
		var service = {
			getAuth: getAuth,
			login: login,
			logout: logout,
			onAuth: onAuth,
			waitForAuth: waitForAuth,
		};

		return service;

		function getAuth() {
			return authObj.$getAuth();
		}

		function login(identity, pass) {
			return authObj.$signInWithEmailAndPassword(identity, pass)
				.then(function (user) {
					if ($rootScope.prevState) {
						$state.go($rootScope.prevState);
					} else {
						$state.go('blog.index');
					}
					console.log('logged in as:', user);
					return user;
				}).catch(function (error) {
					console.log('login error:', error.message);
					return error;
				});
		}

		function logout() {
			return authObj.$signOut();
		}

		function onAuth(callback) {
			return authObj.$onAuthStateChanged(callback);
		}

		function waitForAuth() {
			return authObj.$waitForSignIn();
		}
	}
})();
