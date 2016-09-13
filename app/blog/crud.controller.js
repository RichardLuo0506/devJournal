(function () {
	'use strict';
	angular
		.module('APP')
		.controller('Crud', Crud);

	Crud.$inject = ['Blog', '$scope', '$rootScope', '$state', 'post', 'Auth'];

	function Crud(Blog, $scope, $rootScope, $state, post, Auth) {
		var vm = this;
		vm.post = post;
		vm.crud = { author: Auth.getAuth().uid, tags: [] };
		angular.forEach(vm.post, function (val, key) {
			vm.crud[key] = val;
		});
		vm.postTypes = Blog.getPostTypes();
		vm.postTypes.$watch(function () {
			vm.postTypes.sort(function (a, b) {
				return a.name > b.name ? 1 : -1;
			});
		});
		$scope.editorOptions = editorOptions();

		getTagsAvailable();
		vm.inputTags = [];

		vm.createPost = createPost;
		vm.getTags = getTags;
		vm.onTagAdded = onTagAdded;
		vm.onTagAdding = onTagAdding;
		vm.updatePost = updatePost;

		function createPost() {
			try {
				vm.crud.ctime = new Date(vm.crud.ctime).getTime();
				if (isNaN(vm.crud.ctime)) throw "invalid date";
			} catch (e) {
				vm.crud.ctime = new Date().getTime();
			}

			// check for new tags
			var curTag;
			for (var i = 0, len = vm.inputTags.length; i < len; i++) {
				// if tag is new
				curTag = vm.inputTags[i];
				if (!$.grep(vm.tags, function (e) {
						return e.text == curTag.text;
					}).length) {
					vm.tags.$add(curTag)
				}
				vm.crud.tags.push(curTag.text);
			}
			Blog.createPost(vm.crud)
				.then(function (ref) {
					$state.go('blog.index');
				}, function (ref) {
					console.log('', ref);
				});
		}

		function editorOptions() {
			var options = {
				toolbarGroups: [{
						name: 'clipboard',
						groups: ['clipboard', 'undo']
					}, {
						name: 'editing',
						groups: ['find', 'selection', 'spellchecker', 'editing']
					}, {
						name: 'links',
						groups: ['links']
					}, {
						name: 'insert',
						groups: ['insert']
					}, {
						name: 'forms',
						groups: ['forms']
					}, {
						name: 'tools',
						groups: ['tools']
					}, {
						name: 'document',
						groups: ['mode', 'document', 'doctools']
					}, {
						name: 'others',
						groups: ['others']
					},
					'/', {
						name: 'basicstyles',
						groups: ['basicstyles', 'cleanup']
					}, {
						name: 'paragraph',
						groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph']
					}, {
						name: 'styles',
						groups: ['styles']
					}, {
						name: 'colors',
						groups: ['colors']
					}, {
						name: 'about',
						groups: ['about']
					}
				],
				removeButtons: 'PasteFromWord,PasteText'
			}
			return options;
		}

		function getTags(query) {
			var tags = angular.copy(vm.tags);
			var regex = new RegExp(query, 'i');
			var found = [];
			var curTag;
			for (var i = 0, len = tags.length; i < len; i++) {
				curTag = tags[i].text;
				if (curTag.match(regex)) {
					found[found.length] = tags[i];
				}
			}

			return found;
		}

		function getTagsAvailable() {
			vm.tags = Blog.getTags();
			vm.tags.$watch(function () {
				vm.tags.sort(function (a, b) {
					return a.text > b.text ? 1 : -1;
				});
			});
		}

		function onTagAdded(tag) {
			console.log('added', tag);
		}

		function onTagAdding(tag) {
			tag.type = 'blog';
			return tag;
		}

		function updatePost() {
			try {
				vm.crud.ctime = new Date(vm.crud.ctime).getTime();
				if (isNaN(vm.crud.ctime)) throw "invalid date";
			} catch (e) {
				vm.crud.ctime = new Date().getTime();
			}
			angular.forEach(vm.crud, function (val, key) {
				vm.post[key] = val;
			});
			vm.post.$save()
				.then(function (ref) {
					// $state.go($rootScope.prevState || 'blog.index');
					$state.go('blog.index');
				}, function (ref) {
					console.log('', ref);
				});
		}
	}
})();
