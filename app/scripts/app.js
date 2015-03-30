angular.module('jsApp', ['gist', 'ngRoute', 'angulartics', 'angulartics.google.analytics']).config(
	[
		function (
		) {}
	]
)
.run(['$route', function($route) {
	$route.reload();
}])
.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
		.when('/home', {
			templateUrl: '/views/home'
		})
		.otherwise({
			redirectTo: '/home'
		});
}]);