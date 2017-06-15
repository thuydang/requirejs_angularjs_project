/*
 * (c) 2016 Christian Kuster
 */
function Table(tableItems) {
	
	this.setItems = function(i) {
		items = i;
	}
	
	this.getItems = function() {
		return filteredItems;
	}

	this.searchUtil = function(item, toSearch) {
		return (item.Application.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.Operation.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.Ip.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.Time.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.Entity.toLowerCase().indexOf(toSearch.toLowerCase()) > -1) ? true : false;
	};

	/*
	 * should be private
	 */
	this.searched = function(valLists,toSearch) {
		return _.filter(valLists, 
				function (i) {
			return searchUtil(i, toSearch);
		});        
	};
	
	this.resetTablesAll = function () {
		filteredItems = items;
	};
	
	this.search = function(searchText) {
		filteredItems = this.searched(items, searchText);

		if (searchText == '') {
			filteredItems = items;
		}
	};
	
	this.showEntry = function(string) {
		filteredItems = [string];
	}
	
	/*
	 * Takes the log data from controller scope and transforms it to a chart data format.
	 * The 'string' parameter is used to filter the data on the attribute of parameter 'member'.
	 * If the parameter 'string' contains a comma then it is checked if the value of the
	 * parameter 'member' value is contained in 'string'; otherwise the opposite is checked.
	 */
	var createData = function(string, member) {
		var filterFunc;
		if (string === undefined) {
			filterFunc = function(value) {return true;}
		} else if (string === null) {
			filterFunc = function(value) {return value[member].indexOf("-") > -1 || value[member].length === 0;}
		} else {
			filterFunc = function(value) {if (string.indexOf(",") > -1) return string.indexOf(value[member]) > -1; else return value[member].indexOf(string) > -1;};
		}
		var values = [];
		items.forEach(function(log) {
			if (filterFunc(log)) {
				values.push(log);
			}
		});
		
		// if the resulting set is empty then add an empty line with all properties set to '-'.
		if (values.length === 0) {
			var emptyLine = {};
			_.keys(items[0]).forEach(function(item){emptyLine[item]="-"});
			values.push(emptyLine)
		}
		
		return values;
	}
	
	this.filterData = function(string, member) {
		filteredItems = createData(string, member);
	};
	
//	this.sort = function(sortBy, header){
//		this.resetTablesAll();  
//
//		controllerScope.columnToOrder = sortBy; 
//
//		this.tableFilteredList = $filter('orderBy')(controllerScope.tableFilteredList, controllerScope.columnToOrder, controllerScope.reverse); 
//
//		var iconName;
//
//		if(controllerScope.reverse)
//			iconName = 'glyphicon glyphicon-chevron-up';
//		else
//			iconName = 'glyphicon glyphicon-chevron-down';
//
//		header = iconName;
//
//		this.reverse = !this.reverse;
//	};
	
	var that = this;
	var items = tableItems;
	var filteredItems = createData();
	var reverse = false;
	
}