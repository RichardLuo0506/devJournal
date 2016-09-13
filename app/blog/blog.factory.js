(function () {
	'use strict';
	angular
		.module('APP')
		.factory('Blog', Blog);

	Blog.$inject = ['$firebaseArray', '$firebaseObject', '$q'];

	function Blog($firebaseArray, $firebaseObject, $q) {
		var service = {
			createPost: createPost,
			getAuthor: getAuthor,
			getPost: getPost,
			getPosts: getPosts,
			getPostTypes: getPostTypes,
			getTagsStartWith: getTagsStartWith,
			getTags: getTags
		};

		return service;

		function createPost(post) {
			return getPosts().$add(post);
		}

		function getAuthor(id) {
			return $firebaseObject(firebase.database().ref('users/' + id));
		}

		function getPost(id) {
			return $firebaseObject(firebase.database().ref('posts/' + id));
		}

		function getPosts() {
			return $firebaseArray(firebase.database().ref('posts'));
		}

		function getPostTypes() {
			return $firebaseArray(firebase.database().ref('postTypes'));
		}

		function getTags() {
			return $firebaseArray(firebase.database().ref('tags'));
		}

		function getTagsStartWith(query) {
			console.log('', 'wtf');
			var deferred = $q.defer();
			firebase.database().ref('tags')
				.orderByChild('text')
				.startAt(query)
				.once('value', function (snapshot) {
					var tags = [];
					snapshot.forEach(function (row) {
						tags.push(row.val());
					});
					tags.sort(function (a, b) {
						return a.text > b.text ? 1 : -1;
					});
					deferred.resolve(tags);
				});
			return deferred.promise;
			// return $firebaseArray(firebase.database().ref('tags'));
		}
	}
})();
