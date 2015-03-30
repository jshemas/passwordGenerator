angular.module('jsApp', ['ngRoute']).config(
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