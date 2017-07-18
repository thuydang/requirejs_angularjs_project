// JavaScript source code

var mapModule = angular.module('mapModule', []);

mapModule.controller('mapController', function ($scope, theService) {
    $scope.theServices = theService;

    $scope.circles = [
        {
            id: 1,
            center: {},
            radius: 500,
            stroke: {
                color: '#08B21F',
                weight: 2,
                opacity: 1
            },
            fill: {
                color: '#08B21F',
                opacity: 0.5
            },
            geodesic: true, // optional: defaults to false
            draggable: true, // optional: defaults to false
            clickable: true, // optional: defaults to true
            editable: true, // optional: defaults to false
            visible: true, // optional: defaults to true
            control: {},
            events: {
                radius_changed: function (googleCircle, eventName, circle) {
                    console.log("Radius changed 1: " + googleCircle + " " +
                        "2: " + eventName + " " +
                        "3: " + circle);
                },
                center_changed: function (googleCircle, eventName, circle) {
                    console.log("Center changed 2: " + googleCircle + " " +
                        "2: " + eventName + " " +
                        "3: " + circle);
                }
            }
        }
    ];



    $scope.theSrvices.map.events = {
        click: function (maps, eventName, arguments) {
            //
            if ($scope.theServices.manual === true) {
                if ($scope.theServices.dispServ.name === "") {
                    alert("Select service first");
                    console.log($scope.theServices.dispServ.name);
                }
                else {
                    console.log($scope.theServices.dispServ.name);
                    var e = arguments[0];
                    $scope.lat = e.latLng.lat();
                    $scope.lng = e.latLng.lng();
                    console.log("my lat is:" + $scope.lat + ", lng is:" + $scope.lng);
                    var marker = {
                        id: Date.now(),
                        coords: {
                            latitude: $scope.lat,
                            longitude: $scope.lng
                        }
                    };
                    $scope.theServices.map.markers.push(marker);
                    //put the selected area in the temporary service (which is being modified)
                    $scope.theServices.dispServ.locations = $scope.map.markers;
                    //see if markers are added in the array
                    console.log($scope.theServices.dispServ.locations);
                    $scope.$apply();
                }
            }

            else if ($scope.setRandom === true) {
                var e = arguments[0];
                $scope.circles[0].center.latitude = e.latLng.lat();
                $scope.circles[0].center.longitude = e.latLng.lng();

                // refresh circle center
                $scope.$apply();
                //$scope.map.refresh = true;

                //$scope.circle = new google.maps.Circle({
                //  center: { latitude: 52.512230, longitude: 13.327135 },
                //  radius: 500,
                //  editable: true

            }

            else {
                return;
            }
        }
    };

    $scope.options = { scrollwheel: true };
    //allow manual selection
    $scope.theServices.setManual = function () {

        console.log("inside");
        $scope.theServices.dispServ.selectedTypeOfSensor = "Manual";
        $scope.theServices.manual = true;
        console.log($scope.theServices.dispServ.selectedTypeOfSensor);

    };

    $scope.makeRandom = function () {
        $scope.theServices.setRandom = true;
        $scope.theSrvices.dispServ.selectedTypeOfSensor = "Random";
    };

    //allow random generation (TODO)
    $scope.randomPos = function (event) {
        $scope.theServices.setRandom = true;
        $scope.theServices.positions = [[52.5128, 13.3119], [52.5127, 13.3120], [52.5125, 13.3121]];
    };

});
