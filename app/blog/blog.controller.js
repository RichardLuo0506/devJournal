(function () {
	'use strict';
	angular
		.module('APP')
		.controller('Blog', Blog);

	Blog.$inject = ['posts'];

	function Blog(posts) {
		var vm = this;
		vm.posts = posts;

		vm.getAuthor = getAuthor;
		vm.getPostTypeIcon = getPostTypeIcon;

		function getAuthor(id) {
			if (id == 'ddGQxRex7sgqZ13C10IWB7P9Tuc2') {
				return { username: 'Richard Luo', avatar: 'app/assets/img/me.jpg' };
			}
			return { username: 'guest', avatar: 'app/assets/img/avatar-guest.jpg' };
		}

		function getPostTypeIcon(type) {
			var types = {
				'dev': 'ionicons ion-android-laptop',
				'lab': 'ionicons ion-erlenmeyer-flask',
				'food': 'ionicons ion-android-restaurant',
				'game': 'ionicons ion-ios-game-controller-a',
				'film': 'ionicons ion-social-youtube-outline'
			};
			return types[type];
		}

	}
})();
