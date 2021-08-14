import React, { memo, useState, useEffect, useRef } from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { motion } from 'framer-motion';
import Icon from '@material-ui/core/Icon';
import Input from '@material-ui/core/Input';
import { FormGroup } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import navigationService from 'app/services/navigationService';
import { Done, LensOutlined } from '@material-ui/icons';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import searchService from 'app/services/searchService';
import InputBase from '@material-ui/core/InputBase';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseScrollbars from '@fuse/core/FuseScrollbars';
import FuseUtils from '@fuse/utils';
import LinearProgress from '@material-ui/core/LinearProgress';
import clsx from 'clsx';
import _ from 'lodash';

import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
import SearchTableHeader from './searchResultsHeader';
import DialogSearchViewer from './searchDisplay';

const BootstrapInput = withStyles(theme => ({
	root: {
		'label + &': {
			marginTop: theme.spacing(3)
		}
	},
	input: {
		borderRadius: 4,
		position: 'relative',
		backgroundColor: theme.palette.background.paper,
		border: '1px solid #ced4da',
		fontSize: 16,
		padding: '10px 26px 10px 12px',
		transition: theme.transitions.create(['border-color', 'box-shadow']),
		// Use the system font instead of the default Roboto font.
		fontFamily: [
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
			'sans-serif',
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"'
		].join(','),
		'&:focus': {
			borderRadius: 4,
			borderColor: '#80bdff',
			boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
		}
	}
}))(InputBase);

const HeaderContainer = withStyles({
	root: {
		flexDirection: 'row',
		paddingTop: '20px',
		alignItems: 'flex-end'
	}
})(FormGroup);

const FraseIconUncheck = withStyles({
	root: {}
})(LensOutlined);

const FraseIconcheck = withStyles({
	root: {
		color: 'green'
	}
})(Done);

const HeaderFormControl = withStyles({
	root: {
		marginRight: '10px',
		'& div': {
			marginBottom: '0px',
			'& select': {
				border: '0px',
				borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
				backgroundColor: 'inherit',
				borderRadius: '0px'
			}
		}
	}
})(FormControl);

const useStyles = makeStyles({
	layoutRoot: {},
	search: {
		display: 'flex',
		alignItems: 'center',
		color: 'red'
	},
	loader: {
		height: '30%',
		display: 'flex',
		alignItems: 'center'
	}
});

function SimpleFullWidthSample() {
	const viewerRef = useRef();

	const classes = useStyles();
	const [years, setYears] = useState([]);

	const [searchTerm, setSearchTerm] = useState('');
	const [isPhrase, setIsPhrase] = useState(false);
	const [selectedYear, setYear] = useState(0);
	const [startDate, setStartDate] = useState(new Date('1919-01-01'));
	const [endDate, setEndDate] = useState(new Date('1919-01-01'));
	const [dateType, setDateType] = useState(0);

	const [order, setOrder] = useState({
		direction: 'asc',
		id: null
	});
	const [results, setResults] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const [isSearching, setIsSearching] = useState(false);
	const [payload, setPayload] = useState(null);

	const getNavInfo = () => {
		navigationService.buildNavigationYears().then(yearsInfo => {
			setYears(yearsInfo);
		});
	};

	const renderDateType = () => {
		switch (dateType) {
			case '1':
				return renderDateYear();
				
			case '2':
				return renderDateRange();
				

			default:
				return renderDateYear();
		}
	};

	const renderDateRange = () => {
		return (
			<>
				<HeaderFormControl className={classes.margin}>
					<KeyboardDatePicker
						margin="normal"
						id="date-picker-dialog"
						label="Fecha Inicial"
						format="yyyy/MM/dd"
						value={startDate}
						onChange={handleStartDateChange}
						KeyboardButtonProps={{
							'aria-label': 'change date'
						}}
					/>
				</HeaderFormControl>
				<HeaderFormControl className={classes.margin}>
					<KeyboardDatePicker
						margin="normal"
						id="date-picker-dialog"
						label="Fecha Final"
						format="yyyy/MM/dd"
						value={endDate}
						onChange={handleEndDateChange}
						KeyboardButtonProps={{
							'aria-label': 'change date'
						}}
					/>
				</HeaderFormControl>
			</>
		);
	};

	const renderDateYear = () => {
		return (
			<HeaderFormControl className={classes.margin}>
				<InputLabel htmlFor="demo-customized-select-native">Fechas</InputLabel>
				<NativeSelect
					id="demo-customized-select-native"
					value={selectedYear}
					onChange={handleYearChange}
					input={<BootstrapInput />}
				>
					<option aria-label="None" value="">
						Año
					</option>
					{years.map(year => (
						<option aria-label="None" value={year.value}>
							{year.value}
						</option>
					))}
				</NativeSelect>
			</HeaderFormControl>
		);
	};

	useEffect(() => {
		getNavInfo();
	}, []);

	useEffect(() => {
		if (searchTerm.length > 2) {
			triggerSearch();
		}
	}, [isPhrase, selectedYear, startDate, endDate]);

	const handleDateTypeChange = event => {
		setDateType(event.target.value);
	};

	const handleIsPhraseChange = event => {
		setIsPhrase(event.target.checked);
	};

	const handleYearChange = event => {
		setYear(event.target.value);
	};

	const handleStartDateChange = date => {
		setStartDate(date);
	};

	const handleEndDateChange = date => {
		setEndDate(date);
	};

	const handleSearchChange = ev => {
		setSearchTerm(ev.target.value);
	};

	const handleKeyPress = ev => {
		if (ev.key === 'Enter') {
			triggerSearch();
		}
	};

	function handleRequestSort(event, property) {
		const id = property;
		let direction = 'desc';
		if (order.id === property && order.direction === 'desc') {
			direction = 'asc';
		}
		setOrder({
			direction,
			id
		});
	}

	function handleChangePage(event, value) {
		setPage(value);
	}

	function handleChangeRowsPerPage(event) {
		setRowsPerPage(event.target.value);
	}

	function handleRowClick(item, index) {
		const orderedData = _.orderBy(
			results,
			[
				o => {
					switch (order.id) {
						case 'date': {
							return o.date;
						}
						case 'fileName': {
							return o.fileName;
						}
						default: {
							return o[order.id];
						}
					}
				}
			],
			[order.direction]
		);

		index = page * rowsPerPage + index;

		viewerRef.current.handleOpenDialog(index, orderedData, payload);
	}

	function triggerFileSearch() {}

	function triggerSearch() {
		setIsSearching(true);

		const terms = searchTerm.split(' ');

		const emptypayload = {
			terms,
			isPhrase
		};

		if (dateType === 1) {
			emptypayload.startDate = `${selectedYear}-01-01`;
			emptypayload.endDate = `${selectedYear * 1 + 1}-01-01`;
		} else if (dateType === 2) {
			emptypayload.startDate = startDate;
			emptypayload.endDate = endDate;
		}

		setPayload(emptypayload);

		searchService
			.simpleSearch(emptypayload)
			.then(result => {
				setResults(result.data);
			})
			.finally(() => {
				setIsSearching(false);
			});
	}

	return (
		<FusePageSimple
			classes={{
				root: classes.layoutRoot
			}}
			header={
				<div className={classes.search}>
					<Paper
						component={motion.div}
						initial={{ y: -20, opacity: 0 }}
						animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
						className="flex items-center w-full max-w-512 px-8 py-4 rounded-16 shadow"
					>
						<Icon color="action">search</Icon>

						<Input
							placeholder="Search"
							className="flex flex-1 mx-8"
							disableUnderline
							fullWidth
							value={searchTerm}
							inputProps={{
								'aria-label': 'Search'
							}}
							onChange={ev => handleSearchChange(ev)}
							onKeyPress={ev => handleKeyPress(ev)}
						/>
					</Paper>
				</div>
			}
			contentToolbar={
				<HeaderContainer className="px-24">
					<HeaderFormControl className={classes.margin}>
						<FormControlLabel
							control={
								<Checkbox
									icon={<FraseIconUncheck color="primary" />}
									onChange={handleIsPhraseChange}
									checkedIcon={<FraseIconcheck />}
									name="checkedH"
								/>
							}
							label="Frase Exacta"
						/>
					</HeaderFormControl>

					{years ? (
						<>
							<HeaderFormControl className={classes.margin}>
								<InputLabel htmlFor="demo-customized-select-native">Fechas</InputLabel>
								<NativeSelect
									id="demo-customized-select-native"
									value={dateType}
									onChange={handleDateTypeChange}
									input={<BootstrapInput />}
								>
									<option aria-label="None" value={0}>
										Fechas
									</option>
									<option value={1}>Año</option>
									<option value={2}>Rango</option>
								</NativeSelect>
							</HeaderFormControl>

							{dateType > 0 && renderDateType()}
						</>
					) : (
						<div>loading..</div>
					)}
				</HeaderContainer>
			}
			content={
				<>
					{isSearching && (
						<div>
							<div className="h-8">
								<FuseLoading />;
							</div>
						</div>
					)}

					{!isSearching && (
						<div className="w-full flex flex-col">
							<FuseScrollbars className="flex-grow overflow-x-auto">
								<Table stickyHeader className="min-w-xl mt-32" aria-labelledby="tableTitle">
									<SearchTableHeader
										order={order}
										onRequestSort={handleRequestSort}
										rowCount={results.length}
									/>

									<TableBody>
										{_.orderBy(
											results,
											[
												o => {
													switch (order.id) {
														case 'date': {
															return o.date;
														}
														case 'fileName': {
															return o.fileName;
														}
														default: {
															return o[order.id];
														}
													}
												}
											],
											[order.direction]
										)
											.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
											.map((n, index) => (
												<TableRow
													className="h-72 cursor-pointer"
													hover
													role="checkbox"
													tabIndex={-1}
													key={n.id}
													onClick={event => handleRowClick(n, index)}
												>
													<TableCell className="p-4 md:p-16" component="th" scope="row">
														hemeroteca, Monterrey
													</TableCell>
													<TableCell className="p-4 md:p-16" component="th" scope="row">
														{`${n.date.substring(0, 4)}-${n.date.substring(
															4,
															6
														)}-${n.date.substring(6, 8)}`}
													</TableCell>
													<TableCell className="p-4 md:p-16" component="th" scope="row">
														{n.fileName}
													</TableCell>
												</TableRow>
											))}
									</TableBody>
								</Table>
							</FuseScrollbars>
							<TablePagination
								className="flex-shrink-0 border-t-1"
								component="div"
								count={results.length}
								rowsPerPage={rowsPerPage}
								page={page}
								backIconButtonProps={{
									'aria-label': 'Previous Page'
								}}
								nextIconButtonProps={{
									'aria-label': 'Next Page'
								}}
								onChangePage={handleChangePage}
								onChangeRowsPerPage={handleChangeRowsPerPage}
							/>
						</div>
					)}

					<DialogSearchViewer ref={viewerRef} />
				</>
			}
		/>
	);
}

export default SimpleFullWidthSample;
