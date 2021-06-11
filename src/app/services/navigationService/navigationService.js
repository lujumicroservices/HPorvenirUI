import FuseUtils from '@fuse/utils/FuseUtils';
import axios from 'axios';


class Year {

    constructor() {
        year,
        enable;
    }

}

class Month {

    constructor() {
        month,
        enable;
    }

}

class Day {

    constructor() {
        day,
        enable;
    }

}



class NavigationService extends FuseUtils.EventEmitter {


	monthsMap = {
		1 : "Enero",
		2 : "Febrero",
		3 : "Marzo",
		4 : "Abril",
		5 : "Mayo",
		6 : "Junio",
		7 : "Julio",
		8 : "Agosto",
		9 : "Septiembre",
		10 : "Octubre",
		11 : "Noviembre",
		12 : "Diciembre"
	}

	daysMap = {
		0 : "Domingo",
		1 : "Lunes",
		2 : "Martes",
		3 : "Miercoles",
		4 : "Jueves",
		5 : "Viernes",
		6 : "Sabado"		
	}

    loadNavigationInfo = () => {		
		if (localStorage.getItem("navigationExclusion") === null) {
			return new Promise((resolve, reject) => {
				axios
					.get('https://localhost:5001/navigation')
					.then(response => {						
						//console.log(process.env.REACT_APP_NAV_STARTDATE)						
						localStorage.setItem('navigationExclusion',JSON.stringify(response.data));
						resolve(response.data);	
					});
			});
		}else{

			return new Promise(function(resolve, reject) {
				resolve(JSON.parse(localStorage.getItem("navigationExclusion")));
			});
		}		
	};


	buildNavigationYears = () => {
			
		return this.loadNavigationInfo().then(info => {

			var years = [];
            var startDate = new Date("1919/01/01");
			var endDate = new Date();

			if (process.env.REACT_APP_NAV_STARTDATE){
				startDate = new Date(process.env.REACT_APP_NAV_STARTDATE)
			}
			if (process.env.REACT_APP_NAV_ENDDATE){
				endDate = new Date(process.env.REACT_APP_NAV_ENDDATE)
			}

			for(var i = startDate.getFullYear(); i < endDate.getFullYear(); i++){

				console.log(i);
				console.log(info[i]);
				var year = { value : i };				
				year.enable = info[i] == undefined || Object.keys(info[i]).length == 0;  
				years.push(year);
			}	
		
			return years;
		});
	}


	buildNavigationMonths = (year) => {			
		return this.loadNavigationInfo().then(info => {
			var yearSelected = info[year]; 
			var months = [];
			
			for(var i = 1; i <= 12; i++){				
				var month = { value : i };				
				month.enable = yearSelected == undefined || yearSelected[i] == undefined || Object.keys(yearSelected[i]).length > 0;  
				month.name = this.monthsMap[i];
				months.push(month);
			}	
			
			return months;			
		});
	}

	buildNavigationDays = (year,month) => {			
		return this.loadNavigationInfo().then(info => {
			var yearSelected = info[year];
			var monthSelected = yearSelected ? yearSelected[month] : undefined; 
			var days = [];

			var currentDate = new Date(year,month-1,1);
			var nextMonth = new Date(new Date(year,month-1,1).setMonth(currentDate.getMonth() + 1));
			var lastDayCurrent = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1);									
			lastDayCurrent.setDate(lastDayCurrent.getDate()-1);

			for(var i = 1; i <= lastDayCurrent.getDate(); i++){				
				var day = { value : i };				
			
				day.enable = monthSelected == undefined || !monthSelected.find(element => element == i) ;  
				day.name = this.daysMap[new Date(year,month-1,i).getDay()];
				days.push(day);
			}

			return days;			
		});
	}


}

const instance = new NavigationService();

export default instance;
