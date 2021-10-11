import FuseUtils from '@fuse/utils/FuseUtils';
import axios from 'axios';
import storageService from '../storageService';

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

	getWeekDays = () => this.daysStringMap;

	getStringDate = stringdate => {
		const year = stringdate.substring(0, 4);
		const month = stringdate.substring(4, 6);
		const day = stringdate.substring(6, 8);
		const currentDate = new Date(year, month - 1, day);

		const stringDateResult = `${this.getDayString(
			currentDate.getDay()
		)}, ${currentDate.getDate()} De ${this.getMonthString(currentDate.getMonth())} De ${currentDate.getFullYear()}`;

		return stringDateResult;
	};

	loadNavigationInfo = () => {
		if (storageService.getItem('navigationExclusionv2') === null) {
			return new Promise((resolve, reject) => {
				axios.get(`${process.env.REACT_APP_WEBAPI}navigation`).then(response => {
					storageService.setItem('navigationExclusionv2', response.data);
					resolve(response.data);
				});
			});
		}

		return new Promise((resolve, reject) => {
			resolve(JSON.parse(storageService.getItem('navigationExclusionv2')));
		});
	};

	buildNavigationYears = () => {
		return this.loadNavigationInfo().then(info => {
			const years = [];

			const startDate = new Date(
				`${info.startDate.substring(0, 4)}/${info.startDate.substring(4, 6)}/${info.startDate.substring(6, 8)}`
			);
			const endDate = new Date(
				`${info.endDate.substring(0, 4)}/${info.endDate.substring(4, 6)}/${info.endDate.substring(6, 8)}`
			);

			for (let i = startDate.getFullYear(); i <= endDate.getFullYear(); i += 1) {
				const year = { value: i };
				year.enable = info.missingDate[i] === undefined || Object.keys(info.missingDate[i]).length === 0;
				years.push(year);
			}

			return years;
		});
	};

	buildNavigationMonths = year => {
		return this.loadNavigationInfo().then(info => {
			const endDate = new Date(
				`${info.endDate.substring(0, 4)}/${info.endDate.substring(4, 6)}/${info.endDate.substring(6, 8)}`
			);

			let maxMonths = 12;
			if (endDate.getFullYear() === year) {
				maxMonths = endDate.getMonth() + 1;
			}

			const yearSelected = info.missingDate[year];
			const months = [];

			for (let i = 1; i <= maxMonths; i += 1) {
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
			const yearSelected = info.missingDate[year];
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
		if (storageService.getItem(`day_${year}_${month}_${day}`) === null) {
			return new Promise((resolve, reject) => {
				axios.get(`${process.env.REACT_APP_WEBAPI}navigation/day/${year}/${month}/${day}`).then(response => {
					storageService.setItem(`day_${year}_${month}_${day}`, response.data);
					resolve(response.data);
				});
			});
		}
		return new Promise((resolve, reject) => {
			resolve(JSON.parse(storageService.getItem(`day_${year}_${month}_${day}`)));
		});
	};

	loadPage = page => {
		return new Promise((resolve, reject) => {
			axios
				.get(`${process.env.REACT_APP_WEBAPI}navigation/file/${encodeURIComponent(page)}`, {
					headers: {
						'Content-Type': 'application/json'
					},
					responseType: 'arraybuffer'
				})
				.then(response => {
					resolve(response);
				});
		});
	};

	downloadPage = page => {
		return new Promise((resolve, reject) => {
			axios
				.get(`${process.env.REACT_APP_WEBAPI}navigation/file/${encodeURIComponent(page)}`, {
					responseType: 'blob',
					headers: {
						'Content-Type': 'application/pdf'
					}
				})
				.then(({ data }) => {
					const downloadUrl = window.URL.createObjectURL(new Blob([data]));
					const link = document.createElement('a');
					link.href = downloadUrl;
					link.setAttribute('download', page.replace('.tif', '.pdf')); // any other extension
					document.body.appendChild(link);
					link.click();
					link.remove();
				});
		});
	};

	contactRequest = contact => {
		return new Promise((resolve, reject) => {
			axios.post(`${process.env.REACT_APP_WEBAPI}mail`, contact).then(response => {
				resolve(response);
			});
		});
	};
}

const instance = new NavigationService();

export default instance;
