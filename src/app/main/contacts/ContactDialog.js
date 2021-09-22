import FuseUtils from '@fuse/utils/FuseUtils';
import { yupResolver } from '@hookform/resolvers/yup';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { blue } from '@material-ui/core/colors';
import { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';

import _ from '@lodash';
import * as yup from 'yup';

import {
	removeContact,
	updateContact,
	addContact,
	closeNewContactDialog,
	closeEditContactDialog
} from './store/contactsSlice';

// const defaultValues = {
// 	id: '',
// 	name: '',
// 	lastName: '',
// 	avatar: 'assets/images/avatars/profile.jpg',
// 	nickname: '',
// 	company: '',
// 	jobTitle: '',
// 	email: '',
// 	phone: '',
// 	address: '',
// 	birthday: '',
// 	notes: ''
// };

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
	userName: '',
	password: '',
	name: '',
	lastName: '',
	email: '',
	roleArray: 'user'
};

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
	name: yup.string().required('You must enter a name')
});

function ContactDialog(props) {
	const classes = useStyles();

	const dispatch = useDispatch();
	const contactDialog = useSelector(({ contactsApp }) => contactsApp.contacts.contactDialog);

	const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: yupResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	// const id = watch('id');
	const name = watch('name');
	const avatar = watch('avatar');

	/**
	 * Initialize Dialog with Data
	 */
	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'edit'
		 */

		if (contactDialog.type === 'edit' && contactDialog.data) {
			reset({ ...contactDialog.data });
		}

		/**
		 * Dialog type: 'new'
		 */
		if (contactDialog.type === 'new') {
			reset({
				...defaultValues,
				...contactDialog.data
			});
		}
	}, [contactDialog.data, contactDialog.type, reset]);

	/**
	 * On Dialog Open
	 */
	useEffect(() => {
		if (contactDialog.props.open) {
			initDialog();
		}
	}, [contactDialog.props.open, initDialog]);

	/**
	 * Close Dialog
	 */
	const closeComposeDialog = () => {
		return contactDialog.type === 'edit' ? dispatch(closeEditContactDialog()) : dispatch(closeNewContactDialog());
	};

	/**
	 * Form Submit
	 */
	function onSubmit(data) {
		if (contactDialog.type === 'new') {
			dispatch(addContact(data));
		} else {
			dispatch(updateContact({ ...contactDialog.data, ...data }));
		}
		closeComposeDialog();
	}

	/**
	 * Remove Event
	 */
	const handleRemove = () => {
		dispatch(removeContact(1));
		closeComposeDialog();
	};

	return (
		<Dialog
			classes={{
				paper: 'm-24'
			}}
			{...contactDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
		>
			<AppBar position="static" elevation={0}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						{contactDialog.type === 'new' ? 'New Contact' : 'Edit Contact'}
					</Typography>
				</Toolbar>
				<div className="flex flex-col items-center justify-center pb-24">
					<Avatar className="w-96 h-96" alt="contact avatar" src={avatar} />
					{contactDialog.type === 'edit' && (
						<Typography variant="h6" color="inherit" className="pt-8">
							{name}
						</Typography>
					)}
				</div>
			</AppBar>
			<form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:overflow-hidden">
				<DialogContent classes={{ root: 'p-24' }}>
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
							name="roleArray"
							render={({ field }) => (
								<Select {...field} variant="outlined">
									<MenuItem value="user" key="usuario">
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
				</DialogContent>

				{contactDialog.type === 'new' ? (
					<DialogActions className="justify-between p-4 pb-16">
						<div className="px-16">
							<Button
								variant="contained"
								color="secondary"
								type="submit"
								disabled={_.isEmpty(dirtyFields) || !isValid}
							>
								Add
							</Button>
						</div>
					</DialogActions>
				) : (
					<DialogActions className="justify-between p-4 pb-16">
						<div className="px-16">
							<Button
								variant="contained"
								color="secondary"
								type="submit"
								disabled={_.isEmpty(dirtyFields) || !isValid}
							>
								Save
							</Button>
						</div>
						<IconButton onClick={handleRemove}>
							<Icon>delete</Icon>
						</IconButton>
					</DialogActions>
				)}
			</form>
		</Dialog>
	);
}

export default ContactDialog;
