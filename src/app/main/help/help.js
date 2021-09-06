import Typography from '@material-ui/core/Typography';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	root: {
		'& > *': {
			margin: theme.spacing(1)
		}
	},
	header: {
		color: 'white'
	}
}));

function Help() {
	const classes = useStyles();

	return (
		<FusePageSimple
			classes={{
				root: classes.layoutRoot
			}}
			header={
				<div className="flex flex-col flex-1">
					<div className="flex items-center p-24 px-12">
						<div className="flex-1 lg:px-12">
							<h1 className={classes.header}>Ayuda</h1>
						</div>
					</div>
				</div>
			}
			content={
				<div className="p-24">
					<h4>Menu</h4>
					<br />
					<div>
						<img
							src="assets/images/help/menu.png"
							alt="beach"
							style={{
								maxWidth: '900px',
								width: '100%'
							}}
							className="rounded-6"
						/>

						<Typography noWrap>
							Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt
							ut labore et dolore magna aliqua.
						</Typography>
					</div>

					<img
						src="assets/images/help/nav_1.png"
						alt="beach"
						style={{
							maxWidth: '900px',
							width: '100%'
						}}
						className="rounded-6"
					/>

					<img
						src="assets/images/help/nav_2.png"
						alt="beach"
						style={{
							maxWidth: '900px',
							width: '100%'
						}}
						className="rounded-6"
					/>

					<img
						src="assets/images/help/nav_3.png"
						alt="beach"
						style={{
							maxWidth: '900px',
							width: '100%'
						}}
						className="rounded-6"
					/>

					<img
						src="assets/images/help/busqueda_simple.png"
						alt="beach"
						style={{
							maxWidth: '900px',
							width: '100%'
						}}
						className="rounded-6"
					/>

					<img
						src="assets/images/help/busqueda avanzada.png"
						alt="beach"
						style={{
							maxWidth: '900px',
							width: '100%'
						}}
						className="rounded-6"
					/>
				</div>
			}
		/>
	);
}

export default Help;
