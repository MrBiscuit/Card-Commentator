   
$( document ).ready(function() {
    
     //set up draggable on the card popup
     $('#CardPopup').draggable({
        cursor: 'move'
    });
});

var myApp = angular.module('myApp', []);

myApp.controller('CardController', ['$scope',
function CardCtrl($scope) {

        /****************************************************************
        * Constants
        ****************************************************************/
        var searchBoxTimeout = null;

        /****************************************************************
        * Derective Fields
        ****************************************************************/
        $scope.streamName = "twingalaxieslive";
        $scope.testCardList = [];
        $scope.cardList = {};
        $scope.cardPopupImage = "";
        $scope.poppedUpCardId = 0;

        /****************************************************************
        * Derective Functions 
        ****************************************************************/
    
        //add a card to the list
        $scope.addCard = function () {
            var uuid = guid();
            
            $scope.cardList[uuid] = {
                src: "http://media.wizards.com/2015/dftyuvbd564776rvf/en_nwqoyktujb.png",
                name: "Test1",
                id: uuid
            };
      
        };
        
        //Change in search dialog
        $scope.change = function () {

            if (searchBoxTimeout != null) {
                clearTimeout(searchBoxTimeout)
            }
            searchBoxTimeout = setTimeout(timeoutFunction, 500);
        };
    
        //Show jquery dialog on double click
        $scope.cardDoubleClick = function ($event) {
              $(function() {
                $scope.cardPopupImage = $event.target.src;  
                $scope.poppedUpCardId = $event.target.parentElement.id;
                $( "#CardPopup" ).css("visibility", "visible");
                $("#CardPopup").css("top", '50%');
                $("#CardPopup").css("left", '50%');
            });
        };
    
        $scope.cardPopupClose = function() {
            $scope.cardPopupImage = "";
            $( "#CardPopup" ).css("visibility", "hidden");
        };
    
        $scope.cardPopupTrash = function($event) {
            $scope.cardPopupImage = "";
            $( "#CardPopup" ).css("visibility", "hidden");
            delete $scope.cardList[$scope.poppedUpCardId];
        };
    
        /****************************************************************
        * Util Functions 
        ****************************************************************/
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



}]);

//Custom derective for creation of cards to add drawable
myApp.directive('myDirective', function () {
    // return the directive link function. (compile function not needed)
    return function (scope, element, attrs) {


        $(element).draggable({
            containment: '#rightPlayerPlayField',
            cursor: 'move'
        });
        $(element).css("top", 5);
        $(element).css("left", 5);

    }
});

/********************************************************************************************************
 * Temporary fix for filling columns to max height
 ********************************************************************************************************/
//hacky attempt to get middle columns to fill the rest of the screen. http://blog.corunet.com/three-column-layout-with-full-page-height/
function fillthescreen() {
    winH = windowHeight(); //This returns the screen heigth
    heightNeeded = winH; //We need to substract the footer height
    /*	if (typeof (window.innerWidth) != 'number') { //Explorer doesn't recognize minHeight
    		document.getElementById('leftPlayerHand').style.height = heightNeeded + 'px'; //So, we use height (and explroer bug)
    	}*/

    document.getElementById('leftPlayerPlayField').style.height = heightNeeded + 'px'; //So, we use height (and explroer bug);
    document.getElementById('streamSection').style.height = heightNeeded + 'px'; //So, we use height (and explroer bug);
    document.getElementById('rightPlayerPlayField').style.height = heightNeeded + 'px'; //So, we use height (and explroer bug);

    document.getElementById('streamSection').style.height = heightNeeded + 'px'; //So, we use height (and explroer bug);
}

function windowHeight() {
    var alto = 0;
    if (typeof (window.innerWidth) == 'number') {
        alto = window.innerHeight;
    } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
        alto = document.documentElement.clientHeight;
    } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
        alto = document.body.clientHeight;
    }
    return alto;
}

//create a "guid" 
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

$(window).resize(function () {
    fillthescreen();
});