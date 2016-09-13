(function () {
	'use strict';
	angular
		.module('APP')
		.config(config);

	config.$inject = ['$stateProvider', '$urlRouterProvider', '$urlMatcherFactoryProvider'];

	function config($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
		$urlMatcherFactoryProvider.strictMode(false);
		$urlRouterProvider.otherwise('/404');

		$stateProvider
			.state('notFound', {
				url: '/404',
				templateUrl: 'app/shared/404.html'
			})
			.state('about', {
				url: '/about',
				templateUrl: 'app/about/about.html'
			})
			.state('blog', {
				abstract: true,
				url: '',
				template: '<ui-view />',
				resolve: {
					posts: function (Blog) {
						var posts = Blog.getPosts();
						posts.$watch(function () {
							posts.sort(function (a, b) {
								return a.ctime < b.ctime ? 1 : -1;
							});
						});
						return posts.$loaded();
					}
				}
			})
			.state('blog.index', {
				url: '',
				templateUrl: 'app/blog/blog.html',
				controller: 'Blog as vm'
			})
			.state('blog.display', {
				url: '/display/:id',
				templateUrl: 'app/blog/display.html',
				controller: 'Display as vm',
				resolve: {
					post: function (Blog, $stateParams) {
						return Blog.getPost($stateParams.id).$loaded();
					},
					posts: function (Blog) {
						var posts = Blog.getPosts();
						posts.$watch(function () {
							posts.sort(function (a, b) {
								return a.ctime < b.ctime ? 1 : -1;
							});
						});
						return posts.$loaded();
					}
				}
			})
			.state('blog.create', {
				url: '/create',
				templateUrl: 'app/blog/create.html',
				requireLogin: true,
				controller: 'Crud as vm',
				resolve: {
					post: function (Blog, $stateParams) {
						return Blog.getPost($stateParams.id).$loaded();
					}
				}
			})
			.state('blog.edit', {
				url: '/edit/:id',
				templateUrl: 'app/blog/edit.html',
				controller: 'Crud as vm',
				resolve: {
					post: function (Blog, $stateParams) {
						return Blog.getPost($stateParams.id).$loaded();
					}
				}
			})
			.state('contact', {
				url: '/contact',
				templateUrl: 'app/contact/contact.html'
			})
			.state('lab', {
				abstract: true,
				url: '/lab',
				template: '<ui-view />'
			})
			.state('lab.index', {
				url: '',
				templateUrl: 'app/lab/lab.html',
				controller: 'Lab as vm'
			})
			.state('lab.goban', {
				url: '/goban',
				templateUrl: 'app/lab/goban.html',
				controller: 'Goban as vm'
			})
			.state('lab.kOn', {
				url: '/k-on',
				templateUrl: 'app/lab/k-on.html',
				controller: 'KOn as vm'
			})
			.state('auth', {
				abstract: true,
				url: '/auth',
				controller: 'Auth as vm',
				template: '<ui-view />'
			})
			.state('auth.login', {
				url: '/login',
				templateUrl: 'app/auth/login.html'
			});
	}
})();
