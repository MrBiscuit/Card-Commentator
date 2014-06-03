function CardCtrl($scope) {

	var searchBoxTimeout = null;

	$scope.card1 = "http://mtgimage.com/card/Craw Wurm.jpg";
	$scope.card2 = "http://mtgimage.com/card/Serra_Angel.jpg";
	$scope.card3 = "http://mtgimage.com/card/Mountain.jpg";
	$scope.testCardList = [];

	$scope.cardList = [
		{
			src: "http://mtgimage.com/card/Craw Wurm.jpg",
			name: "Test1"
		},
		{
			src: "http://mtgimage.com/card/Serra_Angel.jpg",
			name: "Test2"
		}
	];

	$scope.addCard = function () {
		$scope.cardList.push({
			src: "http://mtgimage.com/card/Craw Wurm.jpg",
			name: "Test1"
		});
	}

	$scope.change = function () {

		if (searchBoxTimeout != null) {
			clearTimeout(searchBoxTimeout)
		}
		searchBoxTimeout = setTimeout(timeoutFunction, 500);
	};

	function timeoutFunction() {
		var searchText = $scope.cardSearch;
		if (searchText.length > 1) {
			var cardsFromApi = JSON.parse(httpGet("http://api.mtgdb.info/search/" + $scope.cardSearch));;

			if (cardsFromApi.length > 10) {
				$scope.testCardList = cardsFromApi.slice(0, 9);
			} else {
				$scope.testCardList = cardsFromApi;
			}
		}
	}

	function httpGet(theUrl) {
		var xmlHttp = null;

		xmlHttp = new XMLHttpRequest();
		xmlHttp.open("GET", theUrl, false);
		xmlHttp.send(null);
		return xmlHttp.responseText;
	}



}