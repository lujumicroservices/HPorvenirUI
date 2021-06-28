import React, { memo, useState, useEffect } from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { makeStyles } from '@material-ui/core/styles';
import { useRef } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import navigationService from 'app/services/navigationService';
import DialogDayViewer from './navigationDay';
import { green, grey, yellow,blue,orange } from '@material-ui/core/colors';
import Hidden from '@material-ui/core/Hidden';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import clsx from 'clsx';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';


const useStyles = makeStyles((theme) => ({
	root: {
		'& > *': {
			margin: theme.spacing(1),
		},
	},
	days: {
		display: 'flex',
		flexDirection: 'row',
		flexFlow: 'wrap',
		justifyContent: 'center',
		padding: "20px"

	},
	day: {
		width: '15%',
		height: '15%',
		textAlign: 'center' 
	},
	header:{
		color:"white"
	},
	activeMonth:{
		color:"white"
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
	leftSidebarHeader:{
		'& .yearsHeader':{
			backgroundColor:grey[400],
				pointerEvents: 'none',
				
		}
	},
	leftSidebarContent:{
		'& .yearActive':{
			backgroundColor:grey[200],
				pointerEvents: 'none',
				
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
		navigationService.buildNavigationYears().then((years_info) => {
			console.log(years_info);
			setYears(years_info);
			handleYearSelection(years_info[0].value);
		});
	}

	useEffect(() => {
		getNavInfo();
	}, []);

	const item = {
		hidden: { opacity: 0, y: 40 },
		show: { opacity: 1, y: 0 }
	};

	const handleOpenDialog = (year,month,day) => {

		viewerRef.current.handleOpenDialog(year,month,day);
	}
	
	function handleYearSelection(year) {		
		setYear(year);
		navigationService.buildNavigationMonths(year).then((months_info) => {
			
			setMonths(months_info);
			setDays(null);
		});
	}

	function handleMonthSelection(month) {		
		setMonth(month);
		navigationService.buildNavigationDays(selectedYear,month).then((days_info) => {
			
			setDays(days_info);
		});
	}



	return (
		<FusePageSimple
			classes={{
				root: classes.layoutRoot
			}}
			header={
				<div className="flex flex-col flex-1">
					<div className="flex items-center p-24 px-12">
						<Hidden lgUp>
							<IconButton
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

			content={

				<div className="p-24">					
					<div className={classes.root}>
					{months && months.map(month => {	
						if(month.enable){
						  return <Button className={classes.activeMonth} onClick={() => handleMonthSelection(month.value)} variant="contained" color="primary">{month.name}</Button>								
						}else{
						  return <Button variant="contained" color="default">{month.name}</Button>								
						}
							
					})}

					</div>
					<br />

					<h4>Content</h4>
					<br />
					<Paper className="w-full rounded-20 shadow flex flex-col justify-between">

						<div className={classes.days}>

							{days && days.map(day => {
								
								if(day.enable){
									return <div className={classes.day}>
									<Typography variant="h3" onClick={() => handleOpenDialog(selectedYear,selectedMonth,day.value)} className="font-semibold leading-none text-blue-700 tracking-tighter">
										{day.value}
									</Typography>
									<Typography variant="subtitle1" className=" text-black-800 font-normal">{day.name}</Typography>
								</div>
								}else{
									return <div className={classes.day}>
									<Typography variant="h3"    className=" font-semibold leading-none text-red tracking-tighter">
										{day.value}
									</Typography>
									<Typography variant="subtitle1" className="text-gray-600 font-normal">{day.name}</Typography>
								</div>
								}

								
							})}

						</div>
					
					</Paper>

					<DialogDayViewer ref={viewerRef} />		

				</div>
			}
			leftSidebarHeader={
				<div className={classes.leftSidebarHeader}>
					<h4 className="yearsHeader p-24">Años Disponibles</h4>
				</div>
			}
			leftSidebarContent={
				<div className={clsx(classes.leftSidebarContent,"p-24")}>
					<List>
						{years && years.map(year => {
							
							var statusLink = "inactive";
							if (year.value == selectedYear) 
								statusLink = "yearActive";
							else
							statusLink = "yearInactive"
							
							
							return <ListItem button className={clsx(statusLink)}
							  			onClick={() => handleYearSelection(year.value)}
							  >
								<ListItemText primary={year.value} />
							 </ListItem> 
							
							
			})}
					</List>
				</div>
			}
			
			sidebarInner
			innerScroll
			ref={pageLayout}
		/>
	);
}

export default SimpleLeftSidebar3Sample;

/*
function SimpleFullWidthSample() {

	const [years, setYears] = useState([]);
	//const [months, setMonths] = useState<Array>(null);
	//const [days, setDays] = useState<Array>(null);


	const classes = useStyles();
	const pageLayout = useRef(null);


	const getNavInfo = () => {
		navigationService.buildNavigationYears().then((years_info)=>{
		   console.log(years_info);
		   setYears(years_info);
		});
	}

	useEffect(() => {
		getNavInfo();
	}, []);

	const item = {
		hidden: { opacity: 0, y: 40 },
		show: { opacity: 1, y: 0 }
	};

	function init(){
		navigationService.buildNavigationYears().then((years_info)=>{
			console.log(years_info);
		   useEffect(() => setYears(years_info), [years]);
		});
	}

		return (
			<FusePageSimple
				classes={{
					root: classes.layoutRoot
				}}

				contentToolbar={
					<div className="p-24">
						<h4>1950</h4>
					</div>
				}

				content={
					<div className={classes.root}>
						<Button variant="outlined" color="primary">Enero</Button>
						<Button variant="outlined" color="primary">Febrero</Button>
						<Button variant="outlined" color="primary">Marzo</Button>
						<Button variant="outlined" color="primary">Abril</Button>
						<Button variant="outlined" color="primary">Mayo</Button>
						<Button variant="outlined" color="primary">Junio</Button>
						<Button variant="outlined" color="primary">Julio</Button>
						<Button variant="outlined" color="primary">Agosto</Button>
						<Button variant="outlined" color="primary">Septiembre</Button>
						<Button variant="outlined" color="primary">Octubre</Button>
						<Button variant="outlined" color="primary">Noviembre</Button>
						<Button variant="outlined" color="primary">Diciembre</Button>
					</div>
				}

				leftSidebarContent={
					<div className="p-24">
						<Card component={motion.div} variants={item} className="w-full rounded-16 shadow mb-32">
						<AppBar position="static" elevation={0}>
							<Toolbar className="px-8">
								<Typography variant="subtitle1" color="inherit" className="flex-1 px-12 font-medium">
									Años
								</Typography>
								<Button color="inherit" size="small" className="font-medium">
									Ver Todos
								</Button>
							</Toolbar>
						</AppBar>
						<CardContent className="p-0">
							<List>
							{years && years.map(year => (


										<ListItem button>
											<ListItemText primary="" />
										</ListItem>
								))}
							</List>
						</CardContent>
						</Card>
					</div>
				}
				innerScroll
				ref={pageLayout}
			/>
		);
	}

export default SimpleFullWidthSample;
*/