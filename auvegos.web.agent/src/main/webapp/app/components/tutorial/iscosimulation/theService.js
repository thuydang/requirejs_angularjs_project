// service

var theService = function () {

    // List of services
    this.serviceList = [
        {
            name: "Weather",
            area: {},
            sensor: ['Temperature', 'Humidity'],
            selectedSensor: "",
            selectedTypeOfSensor: "",
            locations: []
        },
        {
            name: "Parking",
            area: {},
            sensor: ['Bike', 'Car'],
            selectedSensor: "",
            selectedTypeOfSensor: "",
            locations: []

        }
    ];

    this.dispServ = {
        name: "",
        area: {},
        sensor: [],
        selectedSensor: "",
        selectedTypeOfSensor: "",
        locations: []
    };

    //type of services
    this.setRandom = false;

    //open the details' card
    this.detailed = false;

    //manual set locations
    this.locations = [];


    //service to visualize
    this.searchTerm;

    //to show adding part of the menu
    this.newSensorBool = false;

    //new sensor name
    this.newSensor;


    //showtype of sensor
    this.showType = false;

    //array of temp changes
    this.tempArr = $scope.serviceList.slice();

    this.map = {
        center: { latitude: 52.512230, longitude: 13.327135 },
        zoom: 14,
        markers: [],
        events: {
        }
    };



}
