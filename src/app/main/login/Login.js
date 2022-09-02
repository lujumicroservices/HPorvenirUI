import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import MailIcon from '@material-ui/icons/Mail';
import Chip from '@material-ui/core/Chip';
import Auth0LoginTab from './tabs/Auth0LoginTab';
import FirebaseLoginTab from './tabs/FirebaseLoginTab';
import JWTLoginTab from './tabs/JWTLoginTab';

const useStyles = makeStyles(theme => ({
	root: {
		background: `linear-gradient(to right, ${theme.palette.primary.dark} 0%, ${darken(
			theme.palette.primary.dark,
			0.5
		)} 100%)`,
		color: theme.palette.primary.contrastText
	},
	leftSection: {},
	rightSection: {
		backgroundImage: 'url(assets/images/10portadaswallpaperGRISES.jpg)',
		color: theme.palette.primary.contrastText
	},
	rightSectionContent: {
		backgroundColor: 'white'
	},
	controlOverride: {
		'& label': {
			color: 'gray'
		}
	}
}));

function Login() {
	const classes = useStyles();
	const [selectedTab, setSelectedTab] = useState(0);

	function handleTabChange(event, value) {
		setSelectedTab(value);
	}

	return (
		<div
			className={clsx(
				classes.root,
				'flex flex-col flex-auto items-center justify-center flex-shrink-0 p-16 md:p-24'
			)}
		>
			<motion.div
				initial={{ opacity: 0, scale: 0.6 }}
				animate={{ opacity: 1, scale: 1 }}
				className="flex w-full max-w-400 md:max-w-3xl rounded-20 shadow-2xl overflow-hidden"
			>
				<Card
					className={clsx(
						classes.leftSection,
						'flex flex-col w-full max-w-sm items-center justify-center shadow-0'
					)}
					square
				>
					<CardContent className="flex flex-col items-center justify-center w-full py-96 max-w-320">
						<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.2 } }}>
							<div className="flex items-center mb-48">
								<div>
									<div className="logo">
										<img width="128" src="assets/images/logos/porvenir.png" alt="logo" />
									</div>
								</div>
							</div>
						</motion.div>

						<JWTLoginTab />
					</CardContent>

					<div className="flex flex-col items-center justify-center pb-32">
						<div>
							<a href="mailto:editorial@prodigy.net.mx">
								<Chip icon={<MailIcon />} label="editorial@prodigy.net.mx" clickable color="primary" />
							</a>
						</div>
						<div className="py-16">
						    <Link  to={{pathname: '/contact'}}>Mas Información y Tarifas</Link>						
						</div>
					</div>
				</Card>

				<div className={clsx(classes.rightSection, ' hidden md:flex flex-1 items-center justify-center p-64')}>
					<div className={clsx(classes.rightSectionContent, 'max-w-3xl p-16 shadow-2xl rounded-lg')}>
						<motion.div
							initial={{ opacity: 0, y: 40 }}
							animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
						>
							<Typography variant="h3" color="inherit" className="font-semibold leading-tight">
								Bienvenido. <br />
							</Typography>
						</motion.div>

						<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.3 } }}>
							<Typography variant="subtitle1" color="inherit" className="mt-32">
								El acceso a la Hemeroteca Digital de El Porvenir es restingido solo a los suscriptores
								de este sistema. Es necesario contar con una suscripción al sistema para visualizar el
								contenido de nuestra Hemeroteca.
							</Typography>
						</motion.div>
					</div>
				</div>
			</motion.div>
		</div>
	);
}

export default Login;
