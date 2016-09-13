(function () {
	'use strict';
	angular
		.module('APP')
		.config(config);

	config.$inject = ['tagsInputConfigProvider'];

	function config(tagsInputConfigProvider) {
		// firebase
		var config = {
			apiKey: "AIzaSyCYyAsDr5POlWp5gUxKdHhzDZTtE0V0YwY",
			authDomain: "project-1176563870953786141.firebaseapp.com",
			databaseURL: "https://project-1176563870953786141.firebaseio.com",
			storageBucket: "project-1176563870953786141.appspot.com",
		};
		firebase.initializeApp(config);

		// ng-tags-input
		tagsInputConfigProvider
			.setDefaults('tagsInput', {
				placeholder: 'New tag',
				minLength: 3,
				maxLength: 20,
				maxTags: 20,
				keyProperty: 'text',
				displayProperty: 'text',

			})
			.setDefaults('autoComplete', {
				selectFirstMatch: false,
				minLength: 0,
				maxResultsToShow: 3
			})
	}
})();
