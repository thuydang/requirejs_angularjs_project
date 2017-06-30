var myApp = angular.module('myApp', []);


myApp.factory('services', function() {
  var services = {};
  services.cast = [{
    value: "exeCatagory_001",
    text: "Weather"
  }, {
    value: "exeCatagory_002",
    text: "Parking"
  }, {
    value: "exeCatagory_003",
    text: "Renting"
  }, {
    value: "exeCatagory_002",
    text: "Add service..."
  }];
  return services;
})

myApp.factory('wSensors', function() {
  var wSensors = {};
  wSensors.cast = [{
      value: "exeCatagory_001",
      text: "Temperature"
    }, {
      value: "exeCatagory_002",
      text: "Humidity"
    }, {
      value: "exeCatagory_002",
      text: "Both"
    }

  ];
  return wSensors;
})
myApp.factory('pSensors', function() {
  var pSensors = {};
  pSensors.cast = [{
    value: "exeCatagory_001",
    text: "Car"
  }, {
    value: "exeCatagory_002",
    text: "Bike"
  }];
  return pSensors;
})
myApp.factory('setNulls', function() {
  var setNulls = {};
  setNulls.cast = [{
    value: "00",
    text: "Select Service first"
  }];
  return setNulls;
})


myApp.factory('newService', function() {
  var newOne = {};
  newOne.cast = [{
    value: "exeCatagory_001",
    text: "added"

  }];
  return newOne;
})

myApp.factory('sType', function() {
  var sType = {};
  sType.cast = [{
    value: "exeCatagory_001",
    text: "Manual"
  }, {
    value: "exeCatagory_002",
    text: "Random"
  }];
  return sType;
})

myApp.controller('exerciseTypeCtrl', function($scope, sType, newService, wSensors, pSensors, setNulls, services) {

  $scope.services = services;
  $scope.tmpServices = {};
  $scope.activeServices = {};
  $scope.addMe ="";
  
  $scope.saveService = function() {
    // $scope.services.add($scope.tmpService)
  };
  
  //initially no sensor available
  $scope.types = setNulls;
  $scope.sType = setNulls;
  $scope.add = false;
  $scope.changeData = function() {
    //console.log($scope.itemsuper);

    if ($scope.itemsuper.text == "Weather") {
      $scope.types = wSensors;
      $scope.sType = sType;
    } else if ($scope.itemsuper.text == "Parking") {
      $scope.types = pSensors;
      $scope.sType = sType;
    } else if ($scope.itemsuper.text == "Add service...") {
      $scope.types = newService;
      $scope.add = true;
    } else {
      $scope.types = setNulls;
    }
    
  }
  
  $scope.addItem=function(){
		$scope.error="";
		if(!$scope.addMe)
			{
				$scope.error="Empty Product!";
				$scope.show=true;
			return;
			}
		if($scope.services.indexOf($scope.addMe)==-1)
		{
			$scope.services.push = ($scope.addMe);
			$scope.show=false;
		}
		else
			{
				$scope.show=true;
				$scope.error="The item is already on your list."
			}
			
			}

	$scope.removeItem=function(x)
	{
		$scope.show=false;
		$scope.error="";
		$scope.products.splice(x,1);
	}
		
	$scope.sort=function(){$scope.products.sort();}
		
	$scope.revsort=function()
	{
		$scope.products.sort();
		$scope.products.reverse();
	}
		

});