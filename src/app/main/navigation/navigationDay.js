import FusePageSimple from '@fuse/core/FusePageSimple';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { useState } from 'react';
import { useRef,forwardRef,useImperativeHandle } from 'react';
import Paper from '@material-ui/core/Paper';
import navigationService from 'app/services/navigationService';

const useStyles = makeStyles((theme) => ({
	root: {
		'& > *': {
			margin: theme.spacing(1),
		},
	},
	days: {
		display: 'flex',
		flexDirection: 'row',
		flexFlow: 'wrap',
		justifyContent: 'center',
		padding: "20px"

	},
	day: {
		width: '15%',
		height: '15%',
		textAlign: 'center' 
	}

}));

function DialogDayViewer(props, ref){

    const classes = useStyles();

    const [openDialog, setOpenDialog] = useState(false)


    useImperativeHandle(ref, () => ({
        handleOpenDialog () {
            setOpenDialog(true);
        }
      }), [])

    

	function handleCloseDialog(){
		setOpenDialog(false);
	}

    const pageLayout = useRef(null);

    return (

        <Dialog 
        fullScreen 
    open={openDialog} onClose={handleCloseDialog} aria-labelledby="form-dialog-title">
        <AppBar position="static" elevation={0}>
            <Toolbar className="flex w-full">
                <IconButton edge="start" color="inherit" onClick={handleCloseDialog} aria-label="close">
                    <CloseIcon />
                </IconButton>
                <Typography variant="subtitle1" color="inherit">
                    New Message
                </Typography>
                <Button autoFocus color="inherit" onClick={handleCloseDialog}>
                    cerrar
                </Button>
            </Toolbar>
        </AppBar>

        <div>
        
        <FusePageSimple
classes={{
root: classes.layoutRoot
}}


content={

<div className="p-24">					
    <div className={classes.root}>
    
    </div>
    <br />

    <h4>Content</h4>
    <br />
    <Paper className="w-full rounded-20 shadow flex flex-col justify-between">

        hola
    
    </Paper>					

</div>
}


leftSidebarContent={
<div className="p-24">
    <List>
        <ListItem>
            hola
        </ListItem>						
    </List>
</div>
}

ref={pageLayout}
/>

        </div>
</Dialog>
    );

}

export default forwardRef(DialogDayViewer)