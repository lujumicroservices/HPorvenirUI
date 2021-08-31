import React from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { makeStyles } from '@material-ui/core/styles';
import { yupResolver } from '@hookform/resolvers/yup';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Slide from '@material-ui/core/Slide';
import Icon from '@material-ui/core/Icon';
import TextField from '@material-ui/core/TextField';
import { Controller, useForm } from 'react-hook-form';
import navigationService from 'app/services/navigationService';
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
			color: 'gray'
		}
	},
	card: {
		width: '40%'
	},
	snackcontact: {
		bottom: '100px'
	}
}));

const defaultValues = {
	business: '',
	name: '',
	lastName: '',
	email: '',
	comments: '',
	phone: '',
	city: '',
	state: '',
	country: '',
	accountType: '',
	searchType: ''
};

const schema = yup.object().shape({
	email: yup.string().email('por favor introduzca un correo valido').required('debe introducir un correo valido'),
	comments: yup.string().required('debe introducir un comentario')
});

function SlideTransition(props) {
	return <Slide {...props} direction="up" />;
}

function Contact() {
	const [open, setOpen] = React.useState(false);
	const [transition, setTransition] = React.useState(undefined);

	const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: yupResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	const id = watch('id');
	const name = watch('name');
	const avatar = watch('avatar');

	function handleClick(Transition) {
		setTransition(() => Transition);
		setOpen(true);
	}

	const handleClose = () => {
		setOpen(false);
	};

	const classes = useStyles();

	function onSubmit(contact) {
		navigationService.contactRequest(contact).then(yearsInfo => {
			handleClick(SlideTransition);
			reset({
				...defaultValues
			});
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
							<h1 className={classes.header}>Contacto</h1>
						</div>
					</div>
				</div>
			}
			contentToolbar={<></>}
			content={
				<div className={classes.container}>
					<Snackbar
						open={open}
						onClose={handleClose}
						TransitionComponent={transition}
						message="graicas, tus Commentario fueron enviados existosamente!"
						key={transition ? transition.name : ''}
						className={classes.snackcontact}
					/>

					<h4> Envianos tus comentarios y dudas</h4>
					<br />

					<Card className={classes.mailform}>
						<form
							noValidate
							onSubmit={handleSubmit(onSubmit)}
							className="flex flex-col md:overflow-hidden pt-24"
						>
							<CardContent>
								<div className="flex">
									<div className="min-w-48 pt-20">
										<Icon color="action">account_circle</Icon>
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
												fullWidth
												variant="outlined"
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
												error={!!errors.email}
												helperText={errors?.email?.message}
												variant="outlined"
												fullWidth
												required
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
											<Select
												{...field}
												className={clsx(classes.controlOverride, 'mb-24')}
												variant="outlined"
											>
												<MenuItem value="Institucional" key="1">
													<em> Institucional / Business </em>
												</MenuItem>
												<MenuItem value="Personal" key="2">
													<em> Personal / Personal </em>
												</MenuItem>
											</Select>
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
											<Select
												{...field}
												className={clsx(classes.controlOverride, 'mb-24')}
												variant="outlined"
											>
												<MenuItem value="Fecha especifica" key="1">
													<em> Fecha especifica / Specific date </em>
												</MenuItem>
												<MenuItem value="Evento" key="2">
													<em> Evento / Event </em>
												</MenuItem>
												<MenuItem value="Investigación" key="3">
													<em> Investigación / Research </em>
												</MenuItem>
												<MenuItem value="Uso esporadico" key="4">
													<em> Uso esporadico / Sporadic use </em>
												</MenuItem>
												<MenuItem value="Uso permanente" key="5">
													<em> Uso permanente / Permanent use </em>
												</MenuItem>
												<MenuItem value="Otro" key="6">
													<em> Otro / Other </em>
												</MenuItem>
											</Select>
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
												error={!!errors.comments}
												helperText={errors?.comments?.message}
												variant="outlined"
												multiline
												rows={5}
												fullWidth
												required
											/>
										)}
									/>
								</div>
							</CardContent>
							<CardActions>
								<Button variant="contained" color="secondary" type="submit">
									Enviar
								</Button>
							</CardActions>
						</form>
					</Card>
					<div className={classes.contactContainer}>
						<Card className={clsx(classes.contact, classes.card, 'm-24')}>
							<CardContent>
								<Typography className={classes.title} color="textPrimary" gutterBottom>
									Oficinas Monterrey
								</Typography>
								<br />
								<Typography variant="h6" component="h2">
									Galeana 344 Sur Col. Centro Entre Washington y 5 de Mayo Monterrey, N.L. C.P. 64000
								</Typography>
								<br />
								<table className={classes.contactTable}>
									<tbody>
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
									</tbody>
								</table>
							</CardContent>
						</Card>

						<Card className={clsx(classes.contact, classes.card, 'm-24')}>
							<CardContent>
								<Typography className={classes.title} color="textPrimary" gutterBottom>
									Oficinas México, D.F.
								</Typography>
								<br />
								<Typography variant="h6" component="h2">
									Paseo de la Reforma # 30 3er Piso México, D.F. C.P. 06600 Tels: 5705-6178 / 81 / 82
								</Typography>
								<br />
								<table className={classes.contactTable}>
									<tbody>
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
									</tbody>
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
