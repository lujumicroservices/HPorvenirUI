import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';

const useStyles = makeStyles(theme => ({
	listItem: {
		color: 'inherit!important',
		textDecoration: 'none!important',
		height: 40,
		width: '100%',
		borderRadius: 6,
		paddingLeft: 12,
		paddingRight: 12,
		marginBottom: 4,
		'&.active': {
			backgroundColor:
				theme.palette.type === 'light' ? 'rgba(0, 0, 0, .05)!important' : 'rgba(255, 255, 255, .1)!important',
			pointerEvents: 'none',
			'& .list-item-icon': {
				color: 'inherit'
			}
		},
		'& .list-item-icon': {
			fontSize: 16,
			width: 16,
			height: 16,
			marginRight: 16
		}
	}
}));

function NavigationYear(props) {
	const user = null;

	const years = [1, 2, 3, 4, 5, 6];
	const dispatch = useDispatch();

	const classes = useStyles(props);

	return (
		<div className="p-0 lg:p-24 lg:ltr:pr-4 lg:rtl:pl-4">
			<Paper
				component={motion.div}
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
				className="rounded-0 shadow-none lg:rounded-16 lg:shadow"
			>
				<List className="pt-0 px-12">
					{years.map((row, i) => {
						return (
							<ListItem
								button
								component={NavLinkAdapter}
								to="/apps/contacts/all"
								activeClassName="active"
								className={classes.listItem}
								key="{i}"
							>
								<Icon className="list-item-icon text-16" color="action">
									{i}
								</Icon>
								<ListItemText className="truncate" primary={i} disableTypography />
							</ListItem>
						);
					})}
				</List>
			</Paper>
		</div>
	);
}

export default NavigationYear;
