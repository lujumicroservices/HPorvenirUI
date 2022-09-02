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

function Who() {
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
							<h1 className={classes.header}>Quienes Somos</h1>
						</div>
					</div>
				</div>
			}
			contentToolbar={<></>}
			content={
				<div className={classes.container}>
					<div className="flex justify-around m-20">
						<div className="flex-none m-6">
							<img src="assets/images/primer-ejemplar.jpeg" alt="Tarjeta" />
						</div>
						<div className="flex-grow m-6">
							<div className="font-bold">103 años de Hablar con la Verdad</div>
							<br />
							<div>
								Hace 103 años Don Jesús Cantú Leal y el poeta colombiano Ricardo Arenales, conocido
								internacionalmente con el seudónimo de Porfirio Barba Jacob, tuvieron un sueño. Se
								trataba de crear un medio honesto, veraz y responsable que fuera espejo de lo que
								sucedía en la próspera ciudad de Monterrey.
								<br />
								<br />
								Eran los inicios de 1919 cuando México curaba las heridas de la Revolución y la
								población se disponía a entrar en una nueva etapa con la vista puesta en el porvenir.
								<br />
								<br />
								La tarea de Arenales y Don Jesús no era nada fácil, sin embargo estaban decididos, fue
								así como el 31 de enero iniciaron una aventura cuyo objetivo sería la búsqueda de la
								verdad; al poco tiempo el colombiano emigraría una vez más, sin embargo la semilla ya
								estaba sembrada.
								<br />
								<br />
							</div>
						</div>
					</div>

					<div className="flex justify-around m-20">
						<div className="flex-grow m-6">
							<div className="font-bold">Con Don Jesús Inicia la Historia</div>
							<br />
							<div>
								Don Jesús Cantú Leal, fue desde su juventud, un hombre visionario. Originario de
								Cadereyta Jiménez, nació el 17 de diciembre de 1877. Vino a Monterrey buscando
								convertirse en alguien productivo y en poco tiempo se convirtió en un destacado
								empresario de las artes gráficas. Su primer empleo fue en una pequeña imprenta de
								Zaragoza y Padre Mier.
								<br />
								<br />
								Incursionó en diversas empresas relacionadas con el oficio de las letras hasta
								establecer su propia imprenta en 5 de Mayo y Galeana. Al paso de los años conoció al
								reconocido poeta, Ricardo Arenales, quien en compañía de los hermanos Osuna y otros
								empresarios, le pidieron imprimir "El Porvenir". Dos meses después desistieron de seguir
								con su empresa dada la poca remuneración recibida, pero Don Jesús, todo un visionario,
								lo retuvo convirtiéndolo así en el decano del periodismo en Monterrey.
								<br />
								<br />
								Éste hombre, paradigma del periodismo nacional, falleció el día 26 de Marzo de 1947,
								pero su obra no concluyó con él; fue continuada por su hijo Rogelio y ahora, la tercera
								generación de su misma estirpe la sigue engrandeciendo.
								<br />
								<br />
							</div>
						</div>
						<div className="flex-none m-6">
							<img src="assets/images/jesus-cantu.jpeg" alt="Tarjeta" />
						</div>
					</div>

					<div className="flex justify-around m-20">
						<div className="flex-none m-6">
							<img src="assets/images/rogelio-cantu.jpeg" alt="Tarjeta" />
						</div>
						<div className="flex-grow m-6">
							<div className="font-bold">Don Rogelio "El Gerente"</div>
							<br />
							<div>
								Don Rogelio Cantú Gómez nació en Monterrey, Nuevo León, el 26 de febrero de 1917. En
								1951 se casó con la señorita Alicia Escalante Cano, con quien procreó a Jesús, Rogelio y
								José Gerardo.
								<br />
								<br />
								Pocos hombres como don Rogelio Cantú Gómez tuvieron tantas facetas en su vida terrenal,
								pero aún son menos los que destacan en todas.
								<br />
								<br />
								"El Gerente", como se le conocía, llegó a aprender desde el manejo de la publicidad,
								prensas, hasta linotipos y télex, en resumen, todo lo relacionado al periódico. Por
								haber entrado a laborar en el periódico desde muy temprana edad, tuvo una longeva
								actividad en el medio periodístico, un total de 51 años, logrando llevar a "El Porvenir"
								a los primeros planos.
								<br />
								<br />
								Su trabajo en la comunidad fue reconocido ampliamente ya que desde que tomó las riendas
								del periódico "El Porvenir" se preocupó por el bienestar de la sociedad.
								<br />
								<br />
								Entre sus múltiples actividades creó, en 1934, junto con otros 6 visionarios, la
								Asociación de Editores de los Estados (AEE) en 1934. También participó en la fundación
								del Patronato Universitario y los clubes de futbol Tigres y Rayados.
								<br />
								<br />
								Falleció el 29 de agosto de 1984.
								<br />
								<br />
							</div>
						</div>
					</div>

					<div className="flex justify-around m-20">
						<div className="flex-grow m-6">
							<div className="font-bold">Ricardo Arenales, el Poeta y Creador</div>
							<br />
							<div>
								Fue el primer director de "El Porvenir". Poeta, libre pensador, defensor de las ideas
								libertarias, Ricardo Arenales nació el 18 de julio de 1883 en Antioquía, Colombia. Tras
								participar en la guerra -donde no disparó ni un arma-, se lanzó a la aventura,
								recorriendo Centroamérica, Cuba y finalmente México, donde llegó impregnado de la poesía
								de Rubén Darío.
								<br />
								<br />
								Colaboró en varias publicaciones; también fue dueño de su propia revista
								"Contemporánea". Sus ideas liberales lo llevaron a ausentarse de México pero al
								regresar, se instaló en Monterrey donde junto con Don Jesús Cantú Leal, Federico Gómez y
								Eduardo Martínez Celis, fundaron "El Porvenir".
								<br />
								<br />
								A Arenales se le conoció también como Miguel Angel Osorio, Maín Ximénez y Porfirio Barba
								Jacob. "Rosas Negras" y "Poemas Intemporales", son algunas de sus obras, pero su trabajo
								completo no puede ser documentado. En el ocaso de su vida desapareció del entorno
								nacional y sólo se supo que falleció el 14 de enero de 1942, sin especificarse las
								causas de su deceso.
								<br />
								<br />
							</div>
						</div>
						<div className="flex-none m-6">
							<img src="assets/images/ricardo-arenales.jpeg" alt="Tarjeta" />
						</div>
					</div>

					<div className="flex justify-around m-20">
						<div className="flex-grow m-6">
							<div className="font-bold">En la Actualidad...</div>
							<br />
							<div>
								A lo largo de su trayectoria como medio informativos, El Porvenir, ha mantenido una
								conciencia plena de sus deberes profesionales, entre los cuales destaca, por excelencia,
								el de su independencia absoluta de toda liga mercantil, ideológica ó espiritual.
								<br />
								<br />
								La frase "Si lo leyó en El Porvenir ¡ es cierto !, que retrata a ciencia cierta nuestro
								andar cotidiano como medio informativo, seguirá teniendo significado todos los días
								cuando nuestros lectores tengan un encuentro con las noticias publicadas en las páginas
								de este diario, que sin duda, nos exigen un rigor y apego absoluto a los hechos, como
								son.
								<br />
								<br />
								Ayer, como hoy, un código de ética inspirado en los visionarios fundadores de esta casa
								editorial, rige nuestro oficio periodístico.
								<br />
								<br />
								Hoy la tercera y cuarta generación de los Cantú se mantienen al frente de esta
								editorial.
								<br />
								<br />
								Queremos seguir escribiendo la historia de nuestra ciudad, del Estado, del país y del
								mundo, con el respeto que la diversidad merece, con apego y amor a nuestro idioma y
								costumbres.
								<br />
								<br />
							</div>
						</div>
					</div>
				</div>
			}
		/>
	);
}

export default Who;
