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
			contentToolbar={
				<div className="px-24">
					<h4>Content Toolbar</h4>
				</div>
			}
			content={
				<div className="p-24">
					<h4>Content</h4>
					<br />
					ayuda chevere
				</div>
			}
		/>
	);
}

export default Help;