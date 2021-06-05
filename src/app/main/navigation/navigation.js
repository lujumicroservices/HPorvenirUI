

import FusePageSimple from '@fuse/core/FusePageSimple';
import Hidden from '@material-ui/core/Hidden';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import { useRef } from 'react';
import Button from '@material-ui/core/Button';
import NavigationYear from './NavigationYear';

const useStyles = makeStyles((theme) => ({
	root: {
	  '& > *': {
		margin: theme.spacing(1),
	  },
	},
  }));

function SimpleFullWidthSample() {
		const classes = useStyles();
		const pageLayout = useRef(null);
	
		return (
			<FusePageSimple
				classes={{
					root: classes.layoutRoot
				}}
				
				contentToolbar={
					<div className="p-24">
						<h4>1950</h4>
					</div>
				}
				content={
					<div className={classes.root}>
						<Button variant="outlined" color="primary">Enero</Button>
						<Button variant="outlined" color="primary">Febrero</Button>
						<Button variant="outlined" color="primary">Marzo</Button>
						<Button variant="outlined" color="primary">Abril</Button>
						<Button variant="outlined" color="primary">Mayo</Button>
						<Button variant="outlined" color="primary">Junio</Button>
						<Button variant="outlined" color="primary">Julio</Button>
						<Button variant="outlined" color="primary">Agosto</Button>
						<Button variant="outlined" color="primary">Septiembre</Button>
						<Button variant="outlined" color="primary">Octubre</Button>
						<Button variant="outlined" color="primary">Noviembre</Button>
						<Button variant="outlined" color="primary">Diciembre</Button>
					</div>
				}
				
				leftSidebarContent={
					<div className="p-24">
						<h4>Seleccione Año</h4>
						<br />
						sidebar
					</div>
				}
				innerScroll
				ref={pageLayout}
			/>
		);
	}

export default SimpleFullWidthSample;
