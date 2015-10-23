

// end  libs 
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}

if (!Array.prototype.remove) {
  Array.prototype.remove = function(val) {
    debugger;
    var i = this.indexOf(val);
         return i>-1 ? this.splice(i, 1) : [];
  };
}
// end  libs 



angular.module('ionic.utils', [])

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}]);

angular.module('starter.controllers', ['ionic.utils'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('FavoritesCtrl', function($ionicPlatform,$scope, $stateParams,$rootScope,$localstorage) {
   var cafeObject =  $localstorage.getObject("cafes");
 if( isEmpty(cafeObject) ){ 
        $scope.mess = "";
     } else { 
        $scope.mess = "";
        $scope.cafes=cafeObject;
   } 

   $scope.isFavorit=function(item){
     var  favoritObj = $localstorage.getObject("favorit");
     for(var i =0;  i< favoritObj.length; i++ ){
         if (favoritObj[i].c_id  == item.cafe.c_id )  { 
             return true;
           }
     }
     return false;
}
  $scope.showfinfo=function(item){
     return true;
  }

  $scope.addToFavorit=function(item) { 
  var  favoritObj = $localstorage.getObject("favorit");
  var tempArray = []; 
   if( isEmpty(favoritObj) ){
          tempArray[0] = {"c_id":item.cafe.c_id}
          $localstorage.setObject("favorit",tempArray);
       } else {
          tempArray = favoritObj;
          if(! $scope.isFavorit(item)){
            tempArray.push({"c_id":item.cafe.c_id});
            $localstorage.setObject("favorit",tempArray);
          } else {
             tempArray = $scope._removeFavoritItem(tempArray, item);
             $localstorage.setObject("favorit",tempArray);
          }
      }
}
$scope._removeFavoritItem=function(tempArray,item){
      for(var i =0;  i< tempArray.length; i++ ){
          if (tempArray[i].c_id  == item.cafe.c_id ) {
                tempArray.splice(i,1);
                return  tempArray;
          }
      }
}

})

.controller('CafeCtrl',
 [ "$http","$ionicPlatform", "$scope", "$stateParams", "$rootScope","$localstorage" ,
   function($http,$ionicPlatform, $scope, $stateParams,$rootScope,$localstorage){
   $scope.mess = "";
   var cafeObject =  $localstorage.getObject("cafes")
  if( isEmpty(cafeObject) ){ 
        $scope.mess = "Потяните вниз , смееле!";
     } else { 
        $scope.mess = "";
        $scope.cafes=cafeObject;
   } 

    $scope.refresh = function() {
        $http.get("http://lunch.in.ua/api/lunchs")
        .success(function(data){
            $scope.cafes=data;
            if( !isEmpty(data) ){ $scope.mess = ""; }
            $localstorage.setObject("cafes",data);
            $scope.$broadcast('scroll.refreshComplete');
        });   
    };

$scope.addToFavorit=function(item) { 
  var  favoritObj = $localstorage.getObject("favorit");
  var tempArray = []; 
   if( isEmpty(favoritObj) ){
          tempArray[0] = {"c_id":item.cafe.c_id}
          $localstorage.setObject("favorit",tempArray);
       } else {
          tempArray = favoritObj;
          if(! $scope.isFavorit(item)){
            tempArray.push({"c_id":item.cafe.c_id});
            $localstorage.setObject("favorit",tempArray);
          } else {
             tempArray = $scope._removeFavoritItem(tempArray, item);
             $localstorage.setObject("favorit",tempArray);
          }
      }
}

$scope.isFavorit=function(item){
     var  favoritObj = $localstorage.getObject("favorit");
     for(var i =0;  i< favoritObj.length; i++ ){
         if (favoritObj[i].c_id  == item.cafe.c_id )  { 
             return true;
           }
     }
     return false;
}

$scope._removeFavoritItem=function(tempArray,item){
      for(var i =0;  i< tempArray.length; i++ ){
          if (tempArray[i].c_id  == item.cafe.c_id ) {
                tempArray.splice(i,1);
                return  tempArray;
          }
      }
}

}])



.controller('MapsCtrl',['$scope', '$stateParams', function($scope, $stateParams){
      $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
}])

.controller('LunchCtrl', [ "$http", "$scope", "$stateParams","$localstorage", function($http,$scope, $stateParams,$localstorage){
var self=this;
var cafeid = $stateParams.cafeId | 0 ;
$scope.lunches=[];
 var cafeObject =  $localstorage.getObject("cafes");
  for(var i =0;  i< cafeObject.length; i++ ){
         if (cafeObject[i].c_id  == cafeid )  { 
              $scope.lunches = cafeObject[i].lunches_list;
             
           }
     }

}]);
