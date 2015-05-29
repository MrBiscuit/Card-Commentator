   $(document).ready(function () {

       //set up draggable on the card popup
       $('#CardPopup').draggable({
           cursor: 'move',
           containment: 'body',
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
           $scope.searchedCardList = [];
           $scope.cardList = {};
           $scope.cardPopupImage = "";
           $scope.poppedUpCardId = 0;
           $scope.selectedCard = null;
           $scope.hoveredCard = null;
           $scope.newCardOpen = false;
           $scope.showCardPopup = false;
           $scope.comment = "";


           $scope.cardLocations = {
               LEFTHAND: 0,
               LEFTBOARD: 1,
               LEFTGRAVEYARD: 2,
               LEFTEXILE: 3,
               RIGHTHAND: 4,
               RIGHTBOARD: 5,
               RIGHTGRAVEYARD: 6,
               RIGHTEXILE: 7,
               NEW: 8
           };

           $scope.cardGroups = {};
           $scope.cardGroups[$scope.cardLocations.LEFTBOARD] = {};
           $scope.cardGroups[$scope.cardLocations.LEFTHAND] = {};
           $scope.cardGroups[$scope.cardLocations.LEFTGRAVEYARD] = {};
           $scope.cardGroups[$scope.cardLocations.LEFTEXILE] = {};
           $scope.cardGroups[$scope.cardLocations.RIGHTBOARD] = {};
           $scope.cardGroups[$scope.cardLocations.RIGHTHAND] = {};
           $scope.cardGroups[$scope.cardLocations.RIGHTGRAVEYARD] = {};
           $scope.cardGroups[$scope.cardLocations.RIGHTEXILE] = {};

           /****************************************************************
            * Derective Functions
            ****************************************************************/

           //add a card to the list
           $scope.addCard = function () {

               var cardsFromApi = JSON.parse(httpGet("http://api.mtgapi.com/v1/card/name/" + $scope.cardSearch));
               var additionImages = [];
               if (cardsFromApi.length == 0) {
                   return;
               } else if (cardsFromApi.length > 0) {
                   for (var key in cardsFromApi) {
                       //console.log(cardsFromApi[key]);
                       additionImages.push("http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=" + cardsFromApi[key].id);
                   }
               }

               var uuid = guid();
               //var imageSource = "http://api.mtgdb.info/content/hi_res_card_images/" + cardsFromApi[cardsFromApi.length - 1].id + ".jpg";
               var imageSource = "http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=" + cardsFromApi[cardsFromApi.length - 1].id;
               var newCard = new Card(uuid, $scope.cardSearch, imageSource, $scope.cardLocations.NEW, additionImages);
               newCard.currentSourceIndex = cardsFromApi.length - 1;
               $scope.selectedCard = newCard;
               $scope.cardSearch = "";
               $scope.searchedCardList = [];
               showCardPopup();

           };

           //move card click handle
           $scope.moveCardClick = function (moveTo) {

               if (moveTo == $scope.selectedCard.location)
                   return;

               var currentSelected = $scope.selectedCard;
               hideCardPopup();
               addComment(currentSelected.name + " moved to hand");

               var movedCard = new Card(currentSelected.id, currentSelected.name, currentSelected.imageSource, moveTo, currentSelected.additionalImages);
               $scope.cardGroups[moveTo][movedCard.id] = movedCard;
               if (currentSelected.location != $scope.cardLocations.NEW) {
                   delete $scope.cardGroups[currentSelected.location][currentSelected.id];
               }

              
           };

           //Change in search dialog
           $scope.change = function () {

               if (searchBoxTimeout != null) {
                   clearTimeout(searchBoxTimeout);
               }
               searchBoxTimeout = setTimeout(queryCards, 250);


           };

           $scope.commentChange = function () {



           };

           $scope.addComment = function () {
               if ($scope.comment == "") {
                   return;
               }
               $('#commentList').append('<li>' + $scope.comment + '</li>');
               var objDiv = document.getElementById("commentList");
               objDiv.scrollTop = objDiv.scrollHeight;
               $scope.comment = "";
           }

           $scope.changeCardImage = function (direction) {
               var currentSelected = $scope.selectedCard;

               if (currentSelected.additionalImages.length == 1)
                   return;

               if (direction == "left") {
                   if (currentSelected.currentSourceIndex == 0) {
                       currentSelected.currentSourceIndex = currentSelected.additionalImages.length - 1;

                   } else {
                       currentSelected.currentSourceIndex--;
                   }

               } else {
                   if (currentSelected.currentSourceIndex == (currentSelected.additionalImages.length - 1)) {
                       currentSelected.currentSourceIndex = 0;

                   } else {
                       currentSelected.currentSourceIndex++;
                   }
               }
               currentSelected.imageSource = currentSelected.additionalImages[currentSelected.currentSourceIndex];

           };

           //Show jquery dialog on double click
           $scope.cardDoubleClick = function ($event, card) {
               $(function () {
                   $scope.selectedCard = card;
                   $("#CardPopup").css("visibility", "visible");
                   $("#CardPopup").css("top", ($event.clientY - 150) + "px");
                   $("#CardPopup").css("left", ($event.clientX - 100) + "px");
               });

           };

           $scope.cardPopupClose = function () {
               hideCardPopup();
           };

           $scope.cardPopupTrash = function ($event) {
               if ($scope.selectedCard.location != $scope.cardLocations.NEW) {
                   addComment($scope.selectedCard.name + " deleted");
                   delete $scope.cardGroups[$scope.selectedCard.location][$scope.selectedCard.id];
               }
               hideCardPopup();
           };

           /****************************************************************
            * Util Functions
            ****************************************************************/
    
            var addComment = function(commentText) {
                $('#commentList').append('<li>' + commentText + '</li>');
            }
           var showCardPopup = function () {
               $("#CardPopup").css("visibility", "visible");
               $("#CardPopup").css("top", '50%');
               $("#CardPopup").css("left", '50%');
           };

           var hideCardPopup = function () {
               $scope.selectedCard = null;
               $("#CardPopup").css("visibility", "hidden");
           };

           var moveCardToList = function (card, moveTo) {
               card.location = moveTo;

           };
    
           var convertLocationEnumToString = function(location) {
              /* switch(location){
                $scope.cardLocations.LEFTHAND: 
                    return "Hand"; 
                    break;
               $scope.cardLocations.LEFTBOARD: return "Hand"; break;
               $scope.cardLocations.LEFTGRAVEYARD: return "Hand"; break;
               $scope.cardLocations.LEFTEXILE: return "Hand"; break;
               $scope.cardLocations.RIGHTHAND: return "Hand"; break;
               $scope.cardLocations.RIGHTBOARD: return "Hand"; break;
               $scope.cardLocations.RIGHTGRAVEYARD: return "Hand"; break;
               $scope.cardLocations.RIGHTEXILE: return "Hand"; break;
               $scope.cardLocations.NEW: return "Hand"; break;
               }*/
           }

           var queryCards = function () {
               /*               var searchText = $scope.cardSearch;
                              if (searchText.length > 1) {
                                  //var cardsFromApi = JSON.parse(httpGet("http://api.mtgapi.com/v1/card/name/" + $scope.cardSearch));
                                  for (var key in names) {
                                      if (names.hasOwnProperty(key)) {
                                          console.log(key + " -> " + names[key]);
                                      }
                                  }

                                  if (cardsFromApi.length > 10) {
                                      $scope.searchedCardList = cardsFromApi.slice(0, 9);
                                  } else {
                                      $scope.searchedCardList = cardsFromApi;
                                  }
                              } else {
                                  $scope.searchedCardList = [];
                              }
                              
                              */

               var count = 0;
               var cardNames = names.names;
               var searchText = $scope.cardSearch;
               $scope.searchedCardList = [];
               var tempList = [];
               if (searchText.length > 0) {
                   for (var key in cardNames) {
                       if (cardNames.hasOwnProperty(key)) {
                           if (cardNames[key].toUpperCase().indexOf(searchText.toUpperCase()) == 0) {
                               tempList.push(cardNames[key]);
                               count++;
                               if (count == 10) {
                                   break;
                               }
                           }
                       }
                   }
               }
               $scope.searchedCardList = tempList;
               $scope.$apply();
           };

           var httpGet = function (theUrl) {
               var xmlHttp = null;

               xmlHttp = new XMLHttpRequest();
               xmlHttp.open("GET", theUrl, false);
               xmlHttp.send(null);
               return xmlHttp.responseText;
           };

           var Card = function (id, name, imageSource, location, additionalImages) {
               this.id = id;
               this.imageSource = imageSource;
               this.location = location;
               this.additionalImages = additionalImages;
               this.currentSourceIndex = 0;
               this.name = name;
           };

           //key registration for search box
           document.getElementById('searchBox').onkeypress = function (e) {
               if (!e) e = window.event;
               var keyCode = e.keyCode || e.which;
               if (keyCode == '13') {
                   $scope.addCard();
                   $scope.$apply();
                   return false;
               }
           }

           document.getElementById('commentInput').onkeypress = function (e) {
               if (!e) e = window.event;
               var keyCode = e.keyCode || e.which;
               if (keyCode == '13') {
                   $scope.addComment();
                   $scope.$apply();
                   return false;
               }
           }



}]);

   //Custom derective for creation of cards to add drawable
   myApp.directive('rightDraggable', function () {
       // return the directive link function. (compile function not needed)
       return function (scope, element, attrs) {
           $(element).draggable({
               containment: '#rightPlayerPlayField',
               cursor: 'move',
               stack: '.rotated-card-container'
           });
           $(element).css("top", 5);
           $(element).css("left", 5);
           $(element).click(function () {

               //$(this).draggable().stack('.rotated-card-container');
           });
       }
   });

   myApp.directive('leftDraggable', function () {
       return function (scope, element, attrs) {
           $(element).draggable({
               containment: '#leftPlayerPlayField',
               cursor: 'move',
               stack: '.rotated-card-container'
           });
           $(element).css("top", 5);
           $(element).css("left", 5);
           $(element).click(function () {
               // $(this).draggable().stack('.rotated-card-container');
           });
       }
   });



   /********************************************************************************************************
    * Temporary fix for filling columns to max height
    ********************************************************************************************************/
   //hacky attempt to get middle columns to fill the rest of the screen. http://blog.corunet.com/three-column-layout-with-full-page-height/
   function fillthescreen() {
       winH = windowHeight(); //This returns the screen heigth
       heightNeeded = winH - 50; //We need to substract the footer height
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