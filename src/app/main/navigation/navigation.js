import React, { useRef, useState, useEffect } from 'react';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import navigationService from 'app/services/navigationService';
import { grey } from '@material-ui/core/colors';
import Hidden from '@material-ui/core/Hidden';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import clsx from 'clsx';
import DialogDayViewer from './navigationDay';

const useStyles = makeStyles(theme => ({
	root: {
		'& > *': {
			margin: theme.spacing(1)
		}
	},
	days: {
		display: 'flex',
		flexDirection: 'row',
		flexFlow: 'wrap',
		padding: '10px',
		justifyContent: 'flex-start'
	},
	day: {
		width: '14%',
		height: '15%',
		textAlign: 'center'
	},
	dayHeader: {
		width: '14%',
		height: '15%',
		textAlign: 'center'
	},
	header: {
		color: 'white'
	},
	activeMonth: {
		color: 'white'
	},
	listItem: {
		color: 'inherit!important',
		textDecoration: 'none!important',
		height: 40,
		width: '100%',
		borderRadius: 6,
		paddingLeft: 12,
		paddingRight: 12,
		marginBottom: 4,
		'&.active': {
			backgroundColor:
				theme.palette.type === 'light' ? 'rgba(0, 0, 0, .05)!important' : 'rgba(255, 255, 255, .1)!important',
			pointerEvents: 'none',
			'& .list-item-icon': {
				color: 'inherit'
			}
		},
		'& .list-item-icon': {
			fontSize: 16,
			width: 16,
			height: 16,
			marginRight: 16
		}
	},
	leftSidebarHeader: {
		height: '64px',
		alignSelf: 'flex-end',
		width: '200px',
		marginLeft: '20px',
		'& .yearsHeader': {
			backgroundColor: theme.palette.secondary.dark,
			pointerEvents: 'none',
			'border-top-right-radius': '20px',
			'border-top-left-radius': '20px'
		}
	},
	leftSidebarContent: {
		height: '500px',
		'& .yearActive': {
			backgroundColor: grey[200],
			pointerEvents: 'none'
		}
	}
}));

function SimpleLeftSidebar3Sample() {
	const viewerRef = useRef();

	const [years, setYears] = useState([]);
	const [months, setMonths] = useState([]);
	const [days, setDays] = useState([]);

	const [selectedYear, setYear] = useState(null);
	const [selectedMonth, setMonth] = useState(null);

	const [openDialog, setOpenDialog] = useState(false);

	const classes = useStyles();
	const pageLayout = useRef(null);

	const getNavInfo = () => {
		navigationService.buildNavigationYears().then(yearsInfo => {
			setYears(yearsInfo);
			handleYearSelection(yearsInfo[0].value);
		});
	};

	useEffect(() => {
		getNavInfo();
	}, []);

	const item = {
		hidden: { opacity: 0, y: 40 },
		show: { opacity: 1, y: 0 }
	};

	const handleOpenDialog = (year, month, day) => {
		viewerRef.current.handleOpenDialog(year, month, day);
	};

	function getWindowDimensions() {
		const { innerWidth: width, innerHeight: height } = window;
		return {
			width,
			height
		};
	}

	function handleYearSelection(year) {
		setYear(year);
		navigationService.buildNavigationMonths(year).then(monthsInfo => {
			setMonths(monthsInfo);
			setMonth(null);
			setDays(null);
		});
	}

	function handleMonthSelection(month) {
		setMonth(month);
		navigationService.buildNavigationDays(selectedYear, month).then(daysInfo => {
			const emptyArray = [];
			if (daysInfo.length > 0) {
				const dayNumber = navigationService.getDayNumber(daysInfo[0].name);
				for (let i = 0; i < dayNumber; i += 1) {
					emptyArray.push({
						enable: false,
						value: null,
						name: ''
					});
				}
			}

			const finalDays = emptyArray.concat(daysInfo);
			console.log(finalDays);
			setDays(finalDays);
		});
	}

	return (
		<FusePageCarded
			classes={{
				root: classes.layoutRoot
			}}
			header={
				<div className="flex flex-col flex-1">
					<div className="flex items-center p-24 px-12">
						<Hidden lgUp>
							<IconButton
								style={{ backgroundColor: '#FED441', padding: '5px' }}
								onClick={ev => pageLayout.current.toggleLeftSidebar()}
								aria-label="open left sidebar"
							>
								<Icon>menu</Icon>
							</IconButton>
						</Hidden>
						<div className="flex-1 lg:px-12">
							<h1 className={classes.header}>Navegacion Libre</h1>
						</div>
					</div>
				</div>
			}
			contentToolbar={
				<div className="px-24" style={{ display: 'flex', alignItems: 'center' }}>
					<Typography className="p-24"> Año : {selectedYear} </Typography>{' '}
					<Hidden lgUp>
						<Button
							onClick={ev => pageLayout.current.toggleLeftSidebar()}
							variant="contained"
							color="secondary"
						>
							Cambiar año
						</Button>
					</Hidden>
				</div>
			}
			content={
				<div className="p-24">
					<div className={classes.root}>
						{months &&
							months.map(month => {
								if (month.enable) {
									if (month.value === selectedMonth) {
										return (
											<Button
												className={classes.activeMonth}
												onClick={() => handleMonthSelection(month.value)}
												variant="contained"
												color="secondary"
												key={month.name}
											>
												{month.name}
											</Button>
										);
									}

									return (
										<Button
											className={classes.activeMonth}
											onClick={() => handleMonthSelection(month.value)}
											variant="contained"
											color="primary"
											key={month.name}
										>
											{month.name}
										</Button>
									);
								}

								return (
									<Button variant="contained" color="default" key={month.name}>
										{month.name}
									</Button>
								);
							})}
					</div>
					<br />

					<h4>Días disponibles</h4>
					<br />
					<Paper className="w-full rounded-20 shadow flex flex-col justify-between">
						<div className={classes.days}>
							{days &&
								navigationService.getWeekDays().map(day => (
									<div className={clsx(classes.day, 'p-14')} key={day.value}>
										<Typography
											variant="subtitle1"
											className="text-gray-600 font-normal invisible lg:visible sm:invisible"
										>
											{day}
										</Typography>
										<Typography
											variant="subtitle1"
											className=" text-black-800 font-normal lg:hidden"
										>
											{day[0]}
										</Typography>
									</div>
								))}

							{days &&
								days.map((day, index) => {
									if (day.enable) {
										return (
											<div className={clsx(classes.day, 'p-14 cursor-pointer')} key={index}>
												<Typography
													variant="h6"
													onClick={() =>
														handleOpenDialog(selectedYear, selectedMonth, day.value)
													}
													className="font-semibold leading-none text-blue-700 tracking-tighter"
												>
													{day.value}
												</Typography>
											</div>
										);
									}

									return (
										<div className={clsx(classes.day, 'p-14')} key={index}>
											<Typography
												variant="h6"
												className=" font-semibold leading-none text-red tracking-tighter"
											>
												{day.value ? day.value : '_'}
											</Typography>
										</div>
									);
								})}
						</div>
					</Paper>

					<DialogDayViewer ref={viewerRef} />
				</div>
			}
			leftSidebarHeader={
				<div borderRadius={16} className={classes.leftSidebarHeader}>
					<h4 className="yearsHeader p-24">Años Disponibles</h4>
				</div>
			}
			leftSidebarContent={
				<div className={clsx(classes.leftSidebarContent, 'p-24')}>
					<List>
						{years &&
							years.map(year => {
								let statusLink = 'inactive';
								if (year.value === selectedYear) statusLink = 'yearActive';
								else statusLink = 'yearInactive';

								return (
									<ListItem
										button
										className={clsx(statusLink)}
										onClick={() => handleYearSelection(year.value)}
										key={year.value}
									>
										<ListItemText primary={year.value} />
									</ListItem>
								);
							})}
					</List>
				</div>
			}
			innerScroll
			ref={pageLayout}
		/>
	);
}

export default SimpleLeftSidebar3Sample;
