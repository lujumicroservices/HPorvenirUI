import FusePageSimple from '@fuse/core/FusePageSimple';
import { makeStyles } from '@material-ui/core/styles';
import { yupResolver } from '@hookform/resolvers/yup';
import AppBar from '@material-ui/core/AppBar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Toolbar from '@material-ui/core/Toolbar';
import Icon from '@material-ui/core/Icon';
import TextField from '@material-ui/core/TextField';
import { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';

import _ from '@lodash';
import * as yup from 'yup';

const useStyles = makeStyles(theme => ({
	root: {
		'& > *': {
			margin: theme.spacing(1)
		}
	},
	header: {
		color: 'white'
	},
	mailform: {
		width: '80%',
		paddingTop: '20px',
		paddingBottom: '20px',
		paddingLeft: '100px',
		paddingRight: '100px'
	},
	contactContainer: {
		display: 'flex',
		justifyContent: 'center'
	},
	contact: {
		width: '40%'
	},
	contactTable: {
		width: '100%'
	},
	container: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	controlOverride: {
		'& label': {
			color: 'orange'
		}
	},
	card: {
		width: '40%'
	}
}));

const defaultValues = {
	id: '',
	name: '',
	lastName: '',
	avatar: 'assets/images/avatars/profile.jpg',
	nickname: '',
	company: '',
	jobTitle: '',
	email: '',
	phone: '',
	address: '',
	birthday: '',
	notes: ''
};

const schema = yup.object().shape({
	name: yup.string().required('You must enter a name')
});

function Contact() {
	const classes = useStyles();

	function onSubmit(data) {}

	const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: yupResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	const id = watch('id');
	const name = watch('name');
	const avatar = watch('avatar');

	return (
		<FusePageSimple
			classes={{
				root: classes.layoutRoot
			}}
			header={
				<div className="flex flex-col flex-1">
					<div className="flex items-center p-24 px-12">
						<div className="flex-1 lg:px-12">
							<h1 className={classes.header}>Contacto</h1>
						</div>
					</div>
				</div>
			}
			contentToolbar={<></>}
			content={
				<div className={classes.container}>
					<h4> Envianos tus comentarios y dudas</h4>
					<br />

					<Card className={classes.mailform}>
						<CardContent>
							<form
								noValidate
								onSubmit={handleSubmit(onSubmit)}
								className="flex flex-col md:overflow-hidden pt-24"
							>
								<div className="flex">
									<div className="min-w-48 pt-20">
										<Icon color="action">business</Icon>
									</div>
									<Controller
										control={control}
										name="business"
										render={({ field }) => (
											<TextField
												{...field}
												className={clsx(classes.controlOverride, 'mb-24')}
												label="Empresa"
												id="business"
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
										<Icon color="action">account_circle</Icon>
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
										name="lastname"
										render={({ field }) => (
											<TextField
												{...field}
												className={clsx(classes.controlOverride, 'mb-24')}
												label="Apellido"
												id="lastname"
												variant="outlined"
												fullWidth
											/>
										)}
									/>
								</div>

								<div className="flex">
									<div className="min-w-48 pt-20">
										<Icon color="action">phone</Icon>
									</div>
									<Controller
										control={control}
										name="phone"
										render={({ field }) => (
											<TextField
												{...field}
												className={clsx(classes.controlOverride, 'mb-24')}
												label="Telefono"
												id="phone"
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
										<Icon color="action">location_on</Icon>
									</div>
									<Controller
										control={control}
										name="city"
										render={({ field }) => (
											<TextField
												{...field}
												className={clsx(classes.controlOverride, 'mb-24')}
												label="City"
												id="city"
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
										name="state"
										render={({ field }) => (
											<TextField
												{...field}
												className={clsx(classes.controlOverride, 'mb-24')}
												label="Estado"
												id="state"
												name="state"
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
										name="country"
										render={({ field }) => (
											<TextField
												{...field}
												className={clsx(classes.controlOverride, 'mb-24')}
												id="country"
												label="Pais"
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
										name="accountType"
										render={({ field }) => (
											<TextField
												{...field}
												className={clsx(classes.controlOverride, 'mb-24')}
												label="Tipo cunta"
												id="accountType"
												variant="outlined"
												fullWidth
											/>
										)}
									/>
								</div>

								<div className="flex">
									<div className="min-w-48 pt-20">
										<Icon color="action">search</Icon>
									</div>
									<Controller
										control={control}
										name="searchType"
										render={({ field }) => (
											<TextField
												{...field}
												className={clsx(classes.controlOverride, 'mb-24')}
												label="Tipo busqueda"
												id="searchType"
												variant="outlined"
												fullWidth
											/>
										)}
									/>
								</div>

								<div className="flex">
									<div className="min-w-48 pt-20">
										<Icon color="action">note</Icon>
									</div>
									<Controller
										control={control}
										name="comments"
										render={({ field }) => (
											<TextField
												{...field}
												className={clsx(classes.controlOverride, 'mb-24')}
												label="Comentarios"
												id="comments"
												variant="outlined"
												multiline
												rows={5}
												fullWidth
											/>
										)}
									/>
								</div>
							</form>
						</CardContent>
						<CardActions>
							<Button>Enviar</Button>
						</CardActions>
					</Card>
					<div className={classes.contactContainer}>
						<Card className={clsx(classes.contact, classes.card, 'm-24')}>
							<CardContent>
								<Typography className={classes.title} color="textPrimary" gutterBottom>
									Oficinas Monterrey
								</Typography>
								<br/>
								<Typography variant="h8" component="h2">
									Galeana 344 Sur Col. Centro Entre Washington y 5 de Mayo Monterrey, N.L. C.P. 64000
								</Typography>
								<br/>
								<table className={classes.contactTable}>
									<tr>
										<td>
											<Typography variant="body2" component="p">
												Conmutador{' '}
											</Typography>
										</td>
										<td>
											<Typography variant="body2" component="p">
												8345-4080{' '}
											</Typography>
										</td>
									</tr>
									<tr>
										<td>
											<Typography variant="body2" component="p">
												Publicidad{' '}
											</Typography>
										</td>
										<td>
											<Typography variant="body2" component="p">
												8340-1616 Ext 241 y 244
											</Typography>
										</td>
									</tr>
									<tr>
										<td>
											<Typography variant="body2" component="p">
												Redacción
											</Typography>
										</td>
										<td>
											<Typography variant="body2" component="p">
												8345-4615
											</Typography>
										</td>
									</tr>
									<tr>
										<td>
											<Typography variant="body2" component="p">
												Dirección
											</Typography>
										</td>
										<td>
											<Typography variant="body2" component="p">
												8340-8239
											</Typography>
										</td>
									</tr>
									<tr>
										<td>
											<Typography variant="body2" component="p">
												Suscripciones
											</Typography>
										</td>
										<td>
											<Typography variant="body2" component="p">
												83-430240 / 71 / 83
											</Typography>
										</td>
									</tr>
									<tr>
										<td>
											<Typography variant="body2" component="p">
												Avisos Económicos
											</Typography>
										</td>
										<td>
											<Typography variant="body2" component="p">
												8340-6200
											</Typography>
										</td>
									</tr>
									<tr>
										<td>
											<Typography variant="body2" component="p">
												Fax
											</Typography>
										</td>
										<td>
											<Typography variant="body2" component="p">
												8345-77-95 y 8340-80-08
											</Typography>
										</td>
									</tr>
								</table>
							</CardContent>
						</Card>

						<Card className={clsx(classes.contact, classes.card, 'm-24')}>
							<CardContent>
								<Typography className={classes.title} color="textPrimary" gutterBottom>
									Oficinas México, D.F.
								</Typography>
								<br/>
								<Typography variant="h8" component="h2">
									Paseo de la Reforma # 30 3er Piso México, D.F. C.P. 06600 Tels: 5705-6178 / 81 / 82
								</Typography>
								<br/>
								<table className={classes.contactTable}>
									<tr>
										<td>
											<Typography variant="body2" component="p">
												Correos Electrónicos{' '}
											</Typography>
										</td>
										<td>
											<Typography variant="body2" component="p">
												publicidad@elporvenir.com.mx <br />
												relaciones@elporvenir.com.mx
												<br />
												porvenir@prodigy.net.mx
												<br />
											</Typography>
										</td>
									</tr>
								</table>
							</CardContent>
						</Card>
					</div>
				</div>
			}
		/>
	);
}

export default Contact;
