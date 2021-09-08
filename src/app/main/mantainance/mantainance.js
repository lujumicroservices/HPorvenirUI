import React, { useRef, useState, useEffect } from 'react';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import navigationService from 'app/services/navigationService';
import { grey } from '@material-ui/core/colors';
import Hidden from '@material-ui/core/Hidden';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import clsx from 'clsx';

function mantainance() {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
			<br />
			<br />
			<h1>Sitio en Mantenimiento</h1>
			<br />
			<img
				src="assets/images/mantenimiento.png"
				alt="beach"
				style={{
					maxWidth: '640px',
					width: '100%'
				}}
				className="rounded-6"
			/>
		</div>
	);
}

export default mantainance;
