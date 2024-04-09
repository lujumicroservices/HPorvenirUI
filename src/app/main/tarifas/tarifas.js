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
import { Link } from 'react-router-dom';

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

function Tarifas() {
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
							<h1 className={classes.header}>Informacion y tarifas</h1>
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

					<h4>PRECIOS DE SUSCRIPCION PARA HEMEROTECA</h4>
					<br />

					<Card className={classes.mailform}>
						<div className="flex justify-around">
							<div>
								<div className="grid grid-cols-2">
									<div>SEMESTRAL</div>
									<div>$ 2,900.00 NETO</div>
								</div>

								<div className="grid grid-cols-2">
									<div>ANUAL</div>
									<div>$ 5,220.00 NETO</div>
								</div>
								<div className=''>Vigencia  al 31 de Diciembre de 2024</div>

								<div className="pt-6">
									<div className='font-bold'>DATOS BANCARIOS</div>
									<div className="pt-6">
										<div className="grid grid-cols-2">
											<div>NOMBRE</div>
											<div>EDITORIAL EL PORVENIR, SA DE CV</div>
										</div>
										<div className="grid grid-cols-2">
											<div>BANCO</div>
											<div>BANORTE CTA. 0100462128</div>
										</div>
										<div className="grid grid-cols-2">
											<div>CLABE</div>
											<div>072580001004621288</div>
										</div>

										<div className="pt-6">
											 A NOMBRE DE EDITORIAL EL PORVENIR SA DE CV </br>
Cuando este el pago envíar el comprobante y datos para facturar  y también usuario y contraseña que quiere poner al siguiente correo publicidad.porvenir@gmail.com se tardan de un día a dos días en darlo de alta cualquier duda estamos a sus ordenes
										</div>
									</div>
								</div>
							</div>
							<div>
								<img src="assets/images/card.png" width="100px" alt="Tarjeta" />
							</div>
						</div>

						<div className="pt-20 flex justify-center">
							<Link to={{ pathname: '/contact' }}>Contacto</Link>
						</div>
					</Card>
				</div>
			}
		/>
	);
}

export default Tarifas;
