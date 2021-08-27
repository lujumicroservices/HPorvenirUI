import React, { memo, useState, useEffect, useRef } from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Button, FormGroup } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import { motion } from 'framer-motion';
import Icon from '@material-ui/core/Icon';
import Input from '@material-ui/core/Input';
import userService from 'app/services/userService';
import { Done, LensOutlined } from '@material-ui/icons';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import { useDispatch } from 'react-redux';
import { lightGreen } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/AddCircle';
import EditIcon from '@material-ui/icons/Edit';
import InputBase from '@material-ui/core/InputBase';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseScrollbars from '@fuse/core/FuseScrollbars';

import _ from 'lodash';
import UserTableHeader from './userResultHeader';
import AddUserDialog from './addUserDialog';

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

const emails = ['username@gmail.com', 'user02@gmail.com'];

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
	},
	headerContainer: {
		display: 'flex',
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'space-between'
	},
	addButton: {
		color: lightGreen[700]
	}
});

function User() {

	
	const dispatch = useDispatch();
	const viewerRef = useRef();

	const classes = useStyles();
	const [years, setYears] = useState([]);

	const [searchTerm, setSearchTerm] = useState('');
	const [isPhrase, setIsPhrase] = useState(false);
	const [selectedYear, setYear] = useState(0);
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

	const [open, setOpen] = React.useState(false);
	const [selectedValue, setSelectedValue] = React.useState(emails[1]);

	useEffect(() => {
		loadUsers();
	}, []);

	const handleDateTypeChange = event => {
		setDateType(event.target.value);
	};

	const handleIsPhraseChange = event => {
		setIsPhrase(event.target.checked);
	};

	const handleYearChange = event => {
		setYear(event.target.value);
	};

	const handleSearchChange = ev => {
		setSearchTerm(ev.target.value);
	};

	const handleKeyPress = ev => {
		if (ev.key === 'Enter') {
			// triggerSearch();
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

	function handleAddUser() {
		setOpen(true);
	}

	const handleClose = value => {
		setOpen(false);
		setSelectedValue(value);
	};

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

	function loadUsers() {
		setIsSearching(true);
		userService
			.getUsers()
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
				<div className="flex flex-col flex-1">
					<div className="flex items-center p-24 px-12">
						<div className="flex-1 lg:px-12">
							<h1 className={classes.header}>Administracion de Usuarios</h1>
						</div>
					</div>
				</div>
			}
			contentToolbar={
				<div className={classes.headerContainer}>
					<Paper
						initial={{ y: -20, opacity: 0 }}
						animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
						className="flex items-center w-full max-w-512 m-16 px-8 py-4 rounded-16 shadow"
					>
						<Icon color="action">search</Icon>

						<Input
							placeholder="Buscar"
							className="flex flex-1 mx-8"
							disableUnderline
							fullWidth
							value={searchTerm}
							inputProps={{
								'aria-label': 'Buscar'
							}}
						/>
					</Paper>

					<IconButton
						onClick={handleAddUser}
						className={classes.addButton}
						color="primary"
						aria-label="Borrar"
					>
						<AddIcon fontSize="large" />
					</IconButton>
					<AddUserDialog selectedValue={selectedValue} open={open} onClose={handleClose} />
				</div>
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
									<UserTableHeader
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
														case 'userName': {
															return o.userName;
														}
														case 'name': {
															return o.name;
														}
														case 'lastName': {
															return o.lastName;
														}
														case 'email': {
															return o.email;
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
													key={n.name}
													onClick={event => handleRowClick(n, index)}
												>
													<TableCell className="p-4 md:p-16" component="th" scope="row">
														{n.id}
													</TableCell>
													<TableCell className="p-4 md:p-16" component="th" scope="row">
														{n.userName}
													</TableCell>
													<TableCell className="p-4 md:p-16" component="th" scope="row">
														{n.password}
													</TableCell>
													<TableCell className="p-4 md:p-16" component="th" scope="row">
														{n.name}
													</TableCell>
													<TableCell className="p-4 md:p-16" component="th" scope="row">
														{n.lastName}
													</TableCell>
													<TableCell className="p-4 md:p-16" component="th" scope="row">
														{n.email}
													</TableCell>
													<TableCell className="p-4 md:p-16" component="th" scope="row">
														{n.role}
													</TableCell>
													<TableCell className="p-4 md:p-16" component="th" scope="row">
														<IconButton color="primary" aria-label="Editar">
															<EditIcon />
														</IconButton>
														<IconButton color="danger" aria-label="Borrar">
															<DeleteIcon />
														</IconButton>
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
				</>
			}
		/>
	);
}

export default User;
