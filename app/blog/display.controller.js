(function () {
	'use strict';
	angular
		.module('APP')
		.controller('Display', Display);

	Display.$inject = ['Blog', '$scope', '$state', 'post', 'posts', '$sce'];

	function Display(Blog, $scope, $state, post, posts, $sce) {
		var vm = this;
		vm.post = post;
		vm.posts = posts;
		$scope.postContent = $sce.trustAsHtml(post.content);
		setRelatedLinks();

		vm.getAuthor = getAuthor;

		function getAuthor(id) {
			if (id == 'ddGQxRex7sgqZ13C10IWB7P9Tuc2') {
				return {
					username: 'Richard Luo',
					avatar: 'app/assets/img/me.jpg'
				};
			}
			return {
				username: 'guest',
				avatar: 'app/assets/img/avatar-guest.jpg'
			};
		}

		function setRelatedLinks() {
			vm.posts.sort(function (a, b) {
				return (a.ctime > b.ctime) ? 1 : ((b.ctime > a.ctime) ? -1 : 0)
			});
			for (var i = 0, len = vm.posts.length; i < len; i++) {
				if (vm.posts[i].$id == vm.post.$id) {
					if (i > 0) {
						vm.prevPost = vm.posts[i - 1];
					}
					if ((i + 1) < len) {
						vm.nextPost = vm.posts[i + 1];
					}
					return;
				}
			}
		}
	}
})();