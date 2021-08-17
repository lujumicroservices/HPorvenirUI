import FuseUtils from '@fuse/utils/FuseUtils';
import axios from 'axios';

class NavigationService extends FuseUtils.EventEmitter {
	monthsMap = {
		0: 'Enero',
		1: 'Febrero',
		2: 'Marzo',
		3: 'Abril',
		4: 'Mayo',
		5: 'Junio',
		6: 'Julio',
		7: 'Agosto',
		8: 'Septiembre',
		9: 'Octubre',
		10: 'Noviembre',
		11: 'Diciembre'
	};

	daysMap = {
		0: 'Domingo',
		1: 'Lunes',
		2: 'Martes',
		3: 'Miercoles',
		4: 'Jueves',
		5: 'Viernes',
		6: 'Sabado'
	};

	daysStringMap = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

	getMonthString = monthNumber => {
		return this.monthsMap[monthNumber];
	};

	getDayString = dayNumber => {
		return this.daysMap[dayNumber];
	};

	getDayNumber = day => {
		return this.daysStringMap.indexOf(day);
	};

	loadNavigationInfo = () => {
		if (localStorage.getItem('navigationExclusion') === null) {
			return new Promise((resolve, reject) => {
				axios.get(`${process.env.REACT_APP_WEBAPI}navigation`).then(response => {
					localStorage.setItem('navigationExclusion', JSON.stringify(response.data));
					resolve(response.data);
				});
			});
		}

		return new Promise(function (resolve, reject) {
			resolve(JSON.parse(localStorage.getItem('navigationExclusion')));
		});
	};

	buildNavigationYears = () => {
		return this.loadNavigationInfo().then(info => {
			const years = [];
			let startDate = new Date('1919/01/01');
			let endDate = new Date();

			if (process.env.REACT_APP_NAV_STARTDATE) {
				startDate = new Date(process.env.REACT_APP_NAV_STARTDATE);
			}
			if (process.env.REACT_APP_NAV_ENDDATE) {
				endDate = new Date(process.env.REACT_APP_NAV_ENDDATE);
			}

			for (let i = startDate.getFullYear(); i < endDate.getFullYear(); i += 1) {
				const year = { value: i };
				year.enable = info[i] === undefined || Object.keys(info[i]).length === 0;
				years.push(year);
			}

			return years;
		});
	};

	buildNavigationMonths = year => {
		return this.loadNavigationInfo().then(info => {
			const yearSelected = info[year];
			const months = [];

			for (let i = 1; i <= 12; i += 1) {
				const month = { value: i };
				month.enable =
					yearSelected === undefined ||
					yearSelected[i] === undefined ||
					Object.keys(yearSelected[i]).length > 0;
				month.name = this.monthsMap[i - 1];
				months.push(month);
			}

			return months;
		});
	};

	buildNavigationDays = (year, month) => {
		return this.loadNavigationInfo().then(info => {
			const yearSelected = info[year];
			const monthSelected = yearSelected ? yearSelected[month] : undefined;
			const days = [];

			const currentDate = new Date(year, month - 1, 1);
			const nextMonth = new Date(new Date(year, month - 1, 1).setMonth(currentDate.getMonth() + 1));
			const lastDayCurrent = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1);
			lastDayCurrent.setDate(lastDayCurrent.getDate() - 1);

			for (let i = 1; i <= lastDayCurrent.getDate(); i += 1) {
				const day = { value: i };

				day.enable = monthSelected === undefined || !monthSelected.find(element => element === i);
				day.name = this.daysMap[new Date(year, month - 1, i).getDay()];
				days.push(day);
			}

			return days;
		});
	};

	loadDay = (year, month, day) => {
		if (localStorage.getItem(`day_${year}_${month}_${day}`) === null) {
			return new Promise((resolve, reject) => {
				axios.get(`${process.env.REACT_APP_WEBAPI}navigation/day/${year}/${month}/${day}`).then(response => {
					localStorage.setItem(`day_${year}_${month}_${day}`, JSON.stringify(response.data));
					resolve(response.data);
				});
			});
		}
		return new Promise(function (resolve, reject) {
			resolve(JSON.parse(localStorage.getItem(`day_${year}_${month}_${day}`)));
		});
	};
}

const instance = new NavigationService();

export default instance;
