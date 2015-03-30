angular.module('jsApp').controller('appController', ['$scope', '$sce', 'wordDispenser', function ($scope, $sce, wordDispenser) {
	$scope.onMouseMoveResult = '';
	$scope.percentage = '0';
	$scope.displayProgressBar = false;
	$scope.displayChangeWordNumber = false;
	$scope.firstTimeOnPage = true;
	$scope.generatedWords = [];

	var getCrossBrowserElementCoords = function (mouseEvent) {
		var result = {
			x: 0,
			y: 0
		};
		if (!mouseEvent) {
			mouseEvent = window.event;
		}
		if (mouseEvent.pageX || mouseEvent.pageY) {
			result.x = mouseEvent.pageX;
			result.y = mouseEvent.pageY;
		} else if (mouseEvent.clientX || mouseEvent.clientY) {
			result.x = mouseEvent.clientX + document.body.scrollLeft +
			document.documentElement.scrollLeft;
			result.y = mouseEvent.clientY + document.body.scrollTop +
			document.documentElement.scrollTop;
		}
		if (mouseEvent.target) {
			var offEl = mouseEvent.target;
			var offX = 0;
			var offY = 0;
			if (typeof(offEl.offsetParent) !== 'undefined') {
				while (offEl) {
					offX += offEl.offsetLeft;
					offY += offEl.offsetTop;

					offEl = offEl.offsetParent;
				}
			} else {
				offX = offEl.x;
				offY = offEl.y;
			}
			result.x -= offX;
			result.y -= offY;
		}
		return result;
	};

    var getMouseEventResult = function (mouseEvent) {
		var coords = getCrossBrowserElementCoords(mouseEvent);
		return {'x':coords.x, 'y':coords.y};
    };

	$scope.onMouseMove = function ($event) {
		$scope.displayProgressBar = true;
		if (!Seeder.common.isDone()) {
			$scope.onMouseMoveResult = getMouseEventResult($event);
			var seed = [$scope.onMouseMoveResult.x, $scope.onMouseMoveResult.y, + new Date()];
			Seeder.common.push(seed);
			$scope.percentage = Seeder.common.percentage() + '%';
			$scope.percentageBarStyle = {'width':Seeder.common.percentage() + '%'};
		} else {
			if ($scope.firstTimeOnPage) {
				Passphrase.common.generate(6);
				$scope.firstTimeOnPage = false;
			}
		}
	};

	var Seeder = Seeder || {};
	Seeder.common = {
		seedLimit: 300,
		seeds: 0,
		push: function(seed) {
			Math.seedrandom(seed, true);
			this.seeds++;
		},
		isDone: function() {
			if (this.seeds === this.seedLimit) {
				return true;
			}
			return false;
		},
		percentage: function() {
			return Math.round((this.seeds / this.seedLimit) * 100);
		}
	};

	var Passphrase = Passphrase || {};
	Passphrase.common = {
		generate: function(wordCount) {
			this.reset();
			for (var i = 0; i < wordCount; i++) {
				var word = wordDispenser.common.getWord();
				$scope.generatedWords[i] = $sce.trustAsHtml('<span class=\'word\'>' + word.word + '<span class=\'word-color\' style=\'background-color:#' + word.hexColor() + '\'></span><span class=\'word-dice\'>' + word.dice() + '</span><span class=\'word-number\'>' + word.number + '</span></span>');
			}
			$scope.displayChangeWordNumber = true;
		},
		reset: function() {
			$scope.generatedWords = [];
		}
	};
}]);