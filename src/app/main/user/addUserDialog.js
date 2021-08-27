import FuseUtils from '@fuse/utils/FuseUtils';
import { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Icon from '@material-ui/core/Icon';
import TextField from '@material-ui/core/TextField';
import { Controller, useForm } from 'react-hook-form';
import { blue } from '@material-ui/core/colors';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';

import _ from '@lodash';
import * as yup from 'yup';

import { removeUser, updateUser, addUser, closeNewUserDialog, closeEditUserDialog } from './userSlice';

const emails = ['username@gmail.com', 'user02@gmail.com'];
const useStyles = makeStyles({
	avatar: {
		backgroundColor: blue[100],
		color: blue[600]
	},
	controlOverride: {
		'& label': {
			color: 'gray'
		}
	},
	mailform: {
		width: '500px'
	}
});

const defaultValues = {
	id: '',
	userName: '',
	password: '',
	name: '',
	lastName: '',
	email: '',
	role: 'usuario'
};

const schema = yup.object().shape({
	userName: yup.string().required('You must enter a name'),
	password: yup.string().required('You must enter a name')
});

function AddUserDialog(props) {
	const dispatch = useDispatch();
	const classes = useStyles();
	const userDialog = useSelector(({ usersApp }) => usersApp.users.userDialog);

	const { onClose, selectedValue, open } = props;

	const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: yupResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;


	/**
	 * Initialize Dialog with Data
	 */
	 const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'edit'
		 */
		if (userDialog.type === 'edit' && userDialog.data) {
			reset({ ...userDialog.data });
		}

		/**
		 * Dialog type: 'new'
		 */
		if (userDialog.type === 'new') {
			reset({
				...defaultValues,
				...userDialog.data,
				id: FuseUtils.generateGUID()
			});
		}
	}, [userDialog.data, userDialog.type, reset]);

	/**
	 * On Dialog Open
	 */
	useEffect(() => {
		if (userDialog.props.open) {
			initDialog();
		}
	}, [userDialog.props.open, initDialog]);





/**
	 * Close Dialog
	 */
	function closeComposeDialog() {
		return userDialog.type === 'edit' ? dispatch(closeEditUserDialog()) : dispatch(closeNewUserDialog());
	}


	function onSubmit(data) {
		if (userDialog.type === 'new') {
			dispatch(addUser(data));
		} else {
			dispatch(updateUser({ ...userDialog.data, ...data }));
		}
		closeComposeDialog();
	}

	

	const handleClose = () => {
		onClose(selectedValue);
	};

	const handleListItemClick = value => {
		onClose(value);
	};

	return (
		<Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
			<DialogTitle id="simple-dialog-title">Agregar nuevo usuario</DialogTitle>
			<Card className={classes.mailform}>
				<CardContent>
					<form
						noValidate
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col md:overflow-hidden pt-24"
					>
						<div className="flex">
							<div className="min-w-48 pt-20">
								<Icon color="action">account_circle</Icon>
							</div>
							<Controller
								control={control}
								name="userName"
								render={({ field }) => (
									<TextField
										{...field}
										className={clsx(classes.controlOverride, 'mb-24')}
										label="Usuario"
										id="userName"
										error={!!errors.name}
										helperText={errors?.name?.message}
										variant="outlined"
										required
										fullWidth
									/>
								)}
							/>
						</div>

						<div className="flex">
							<div className="min-w-48 pt-20">
								<Icon color="action">lock</Icon>
							</div>
							<Controller
								control={control}
								name="password"
								render={({ field }) => (
									<TextField
										{...field}
										className={clsx(classes.controlOverride, 'mb-24')}
										label="Password"
										id="password"
										variant="outlined"
										fullWidth
										required
									/>
								)}
							/>
						</div>

						<div className="flex">
							<div className="min-w-48 pt-20">
								<Icon color="action">perm_contact_calendar</Icon>
							</div>
							<Controller
								control={control}
								name="name"
								render={({ field }) => (
									<TextField
										{...field}
										className={clsx(classes.controlOverride, 'mb-24')}
										label="Nombre"
										id="name"
										variant="outlined"
										fullWidth
									/>
								)}
							/>
						</div>

						<div className="flex">
							<div className="min-w-48 pt-20" />
							<Controller
								control={control}
								name="lastName"
								render={({ field }) => (
									<TextField
										{...field}
										className={clsx(classes.controlOverride, 'mb-24')}
										label="Apellido"
										id="lastName"
										variant="outlined"
										fullWidth
									/>
								)}
							/>
						</div>

						<div className="flex">
							<div className="min-w-48 pt-20">
								<Icon color="action">email</Icon>
							</div>
							<Controller
								control={control}
								name="email"
								render={({ field }) => (
									<TextField
										{...field}
										className={clsx(classes.controlOverride, 'mb-24')}
										label="Email"
										id="email"
										variant="outlined"
										fullWidth
									/>
								)}
							/>
						</div>

						<div className="flex">
							<div className="min-w-48 pt-20">
								<Icon color="action">vpn_key</Icon>
							</div>
							<Controller
								control={control}
								name="role"
								render={({ field }) => (
									<Select {...field} variant="outlined">
										<MenuItem value="usuario" key="usuario">
											<em> usuario </em>
										</MenuItem>
										<MenuItem value="admin" key="admin">
											<em> admin </em>
										</MenuItem>
										<MenuItem value="superadmin" key="superadmin">
											<em> superadmin </em>
										</MenuItem>
									</Select>
								)}
							/>
						</div>
					</form>
				</CardContent>
				<CardActions>
					<Button>Enviar</Button>
				</CardActions>
			</Card>
		</Dialog>
	);
}

export default AddUserDialog;
