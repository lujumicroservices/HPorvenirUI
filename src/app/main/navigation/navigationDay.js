import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Hidden from '@material-ui/core/Hidden';
import Toolbar from '@material-ui/core/Toolbar';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { Document, Page } from 'react-pdf';
import clsx from 'clsx';
import { green, grey, yellow, blue, orange } from '@material-ui/core/colors';
import navigationService from 'app/services/navigationService';
import zIndex from '@material-ui/core/styles/zIndex';
import { size } from 'lodash';
import * as scrollMagic from '../../../scrollMagic';

const useStyles = makeStyles(theme => ({
	root: {
		'& > *': {
			margin: theme.spacing(1)
		},
		justifyContent: 'center',
		display: 'flex',
		'& $button': {
			borderRadius: 38,
			transition: theme.transitions.create(
				['background-color', 'border-radius', 'width', 'min-width', 'padding'],
				{
					easing: theme.transitions.easing.easeInOut,
					duration: theme.transitions.duration.shorter
				}
			),
			width: 24,
			'&:hover': {
				width: 52,
				paddingLeft: 8,
				paddingRight: 8,
				color: 'black',
				'& $span': {
					'& $span': {
						color: 'black'
					}
				}
			},
			'& $span': {
				'& $span': {
					color: 'white',
					'&:hover': {
						color: 'black'
					}
				}
			}
		},

		'& .icon': {
			'&:hover': {
				color: 'black'
			}
		}
	},
	buttonbarstyle: {
		transition: theme.transitions.create(['background-color', 'border-radius', 'width', 'min-width', 'padding'], {
			easing: theme.transitions.easing.easeInOut,
			duration: theme.transitions.duration.shorter
		}),

		'&:hover': {
			color: 'black',
			'& $span': {
				color: 'black',
				'& $span': {
					color: 'black'
				}
			}
		},
		'& $span': {
			color: 'white',
			'& $span': {
				color: 'white',
				'&:hover': {
					color: 'black'
				}
			}
		}
	},
	days: {
		display: 'flex',
		flexDirection: 'row',
		flexFlow: 'wrap',
		justifyContent: 'center',
		padding: '20px'
	},
	day: {
		width: '15%',
		height: '15%',
		textAlign: 'center'
	},
	thumb: {
		'& $img': {
			marginLeft: '30px'
		},
		'& $h3': {}
	},
	completebuttonbar: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-around',
		flexGrow: '1'
	},
	buttonbar: {
		justifyContent: 'center',
		display: 'flex',
		margin: '10px'
	},
	document: {
		display: 'flex',
		justifyContent: 'center',
		height: '600px'
	},

	button: {
		minWidth: 40,
		width: 40,
		height: 40,
		margin: '10px'
	},

	headerFormat: {
		display: 'flex',
		justifyContent: 'space-evenly'
	},
	headerText: {
		color: 'white',
		display: 'flex',
		margin: '10px',
		alignItems: 'center',
		'& $h6': {
			paddingLeft: '5px'
		}
	},
	dialogHeader: {
		display: 'flex',
		alignItems: 'center',
		backgroundColor: theme.palette.primary.dark
	},
	groupHeader: {
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'column',
		width: '100%',
		backgroundColor: theme.palette.primary.dark
	}
}));

function DialogDayViewer(props, ref) {
	const componentRef = useRef();
	const classes = useStyles();

	const [openDialog, setOpenDialog] = useState(false);
	const [selectedDate, setDate] = useState(null);
	const [dayInfo, setDayInfo] = useState(null);
	const [selectedPage, setSelectedPage] = useState(0);
	const [scale, setScale] = useState(1);
	const [fileData, setFileData] = useState(null);
	const [loadingPDF, setLoadingPDF] = useState(false);
	const [isScrolling, setIsScrolling] = useState(false);
	const [clientX, setClientX] = useState(0);
	const [scrollX, setScrollX] = useState(0);
	const [clientY, setClientY] = useState(0);
	const [scrollY, setScrollY] = useState(0);

	useEffect(() => {
		loadFileInfo();
	}, [selectedPage, dayInfo]);

	useImperativeHandle(
		ref,
		() => ({
			handleOpenDialog(year, month, day) {
				setFileData(null);
				setDate(new Date(year, month - 1, day));
				loadDayInfo(year, month, day);
				setOpenDialog(true);
				// scrollMagic.test();
			}
		}),
		[]
	);

	function loadFileInfo() {
		if (!dayInfo) return;
		navigationService
			.loadPage(dayInfo.pages[selectedPage])
			.then(data => {
				setFileData(data.data);
			})
			.finally(() => {
				setLoadingPDF(false);
			});
	}

	function loadDayInfo(year, month, day) {
		navigationService.loadDay(year, month, day).then(days => {
			days.thumb = days.thumb.map(dayi => {
				return `${days.urlPrefix}/${days.container}/${dayi}${days.shareKey}`;
			});
			setDayInfo(days);
		});
	}

	const handleCloseDialog = () => {
		setOpenDialog(false);
	};

	const onSelectPage = page => {
		handleZoomReset();
		setSelectedPage(page);
	};

	const handleZoomIn = ev => {
		setScale(scale + 0.5);
	};

	const handleZoomOut = ev => {
		setScale(scale - 0.5);
	};

	const handleWheel = e => {
		e.preventDefault();
		return false;
		/*
        handleZoomIn();
		console.log(e.deltaY);
		e.persist();
		e.nativeEvent.stopImmediatePropagation();
		e.stopPropagation();
        */
	};

	const handleZoomReset = () => {
		setScale(1);
	};

	const handleDownloadButton = () => {
		navigationService.downloadPage(dayInfo.pages[selectedPage]).then(data => {
			console.log('');
		});
	};

	const onMouseout = e => {
		setIsScrolling(false);
	};

	const onMouseDown = e => {
		setIsScrolling(true);
		setClientX(e.clientX);
		setClientY(e.clientY);
	};

	const onMouseUp = () => {
		setIsScrolling(false);
	};

	const onMouseMove = e => {
		if (isScrolling) {
			if (
				scrollX + (e.clientX - clientX) * -1 > 0 &&
				scrollX + (e.clientX - clientX) * -1 < componentRef.current.scrollWidth
			) {
				componentRef.current.scrollLeft = scrollX + (e.clientX - clientX) * -1;
				setScrollX(scrollX + (e.clientX - clientX) * -1);
				setClientX(e.clientX);
			} else {
				setScrollX(componentRef.current.scrollLeft);
			}

			if (
				scrollY + (e.clientY - clientY) * -1 > 0 &&
				scrollY + (e.clientY - clientY) * -1 < componentRef.current.scrollHeight
			) {
				componentRef.current.scrollTop = scrollY + (e.clientY - clientY) * -1;
				setScrollY(scrollY + (e.clientY - clientY) * -1);
				setClientY(e.clientY);
				// console.log(`scrolly${componentRef.current.scrollTop}`);
			} else {
				setScrollY(componentRef.current.scrollTop);
			}
		}
	};

	function renderBackButton() {
		return (
			dayInfo && (
				<Button
					disabled={selectedPage <= 0}
					className={clsx(classes.buttonbarstyle, 'whitespace-nowrap mx-4')}
					variant="contained"
					onClick={() => onSelectPage(selectedPage - 1)}
				>
					<Icon className={classes.buttonIcon}>navigate_before</Icon>
				</Button>
			)
		);
	}

	function renderNextButton() {
		return (
			dayInfo && (
				<Button
					disabled={selectedPage >= dayInfo.thumb.length - 1}
					className={clsx(classes.buttonbarstyle, 'whitespace-nowrap mx-4')}
					variant="contained"
					onClick={() => onSelectPage(selectedPage + 1)}
				>
					<Icon className={classes.buttonIcon}>navigate_next</Icon>
				</Button>
			)
		);
	}

	const pageLayout = useRef(null);

	return (
		<Dialog
			fullScreen
			open={openDialog}
			onClose={handleCloseDialog}
			className={classes.dialogroot}
			aria-labelledby="form-dialog-title"
		>
			<div className={classes.dialogHeader} id="scroll-dialog-title">
				<div style={{ alignSelf: 'baseline' }}>
					<IconButton
						size="medium"
						edge="start"
						color="inherit"
						onClick={handleCloseDialog}
						aria-label="close"
					>
						<CloseIcon />
					</IconButton>
				</div>
				<div className={classes.groupHeader}>
					{dayInfo && (
						<div className={classes.headerFormat}>
							<Typography className={classes.headerText} variant="h6">
								{`${navigationService.getDayString(
									selectedDate.getDay()
								)}, ${selectedDate.getDate()} De ${navigationService.getMonthString(
									selectedDate.getMonth()
								)} De ${selectedDate.getFullYear()}`}
							</Typography>
						</div>
					)}
					<div className={classes.completebuttonbar}>
						{renderBackButton()}

						<div className={classes.buttonbar}>
							<Button
								disabled={scale >= 3}
								className={clsx(classes.button, classes.settingsButton, 'whitespace-nowrap mx-4')}
								onClick={handleZoomIn}
								variant="contained"
							>
								<Icon className={classes.buttonIcon}>zoom_in</Icon>
							</Button>
							<Button
								disabled={scale <= 1}
								className={clsx(classes.button, 'whitespace-nowrap mx-4')}
								onClick={handleZoomOut}
								variant="contained"
							>
								<Icon className={classes.buttonIcon}>zoom_out</Icon>
							</Button>
							<Button
								className={clsx(classes.button, classes.settingsButton, 'whitespace-nowrap mx-4')}
								onClick={handleZoomReset}
								variant="contained"
							>
								<Icon className={classes.buttonIcon}>zoom_out_map</Icon>
							</Button>
							<Button
								className={clsx(classes.button, classes.settingsButton, 'whitespace-nowrap mx-4')}
								onClick={handleDownloadButton}
								variant="contained"
							>
								<Icon className={classes.buttonIcon}>get_app</Icon>
							</Button>
						</div>
						{renderNextButton()}
					</div>
				</div>
			</div>

			<DialogContent>
				<div style={{ display: 'flex', flexDirection: 'row', height: '99%' }}>
					<div style={{ overflow: 'auto' }}>
						<Hidden smDown className="p-24">
							<List>
								{dayInfo &&
									dayInfo.thumb.map((page, i) => (
										<ListItem key={i}>
											<Button
												className={classes.thumb}
												autoFocus
												color="inherit"
												onClick={() => onSelectPage(i)}
											>
												<img src={page} alt="" />
												{i === selectedPage && (
													<span
														className={clsx(classes.button, classes.settingsButton, 'icon')}
														variant="contained"
														color="secondary"
													>
														<Typography color="Primary" variant="subtitle2">
															{i + 1}
														</Typography>
													</span>
												)}

												{i !== selectedPage && (
													<span
														className={clsx(classes.button, classes.settingsButton, 'icon')}
														variant="contained"
														color="primary"
													>
														<Typography color="textPrimary" variant="subtitle2">
															{i + 1}
														</Typography>
													</span>
												)}
											</Button>
										</ListItem>
									))}
							</List>
						</Hidden>
					</div>
					<div
						role="button"
						tabIndex="0"
						onMouseDown={onMouseDown}
						onMouseUp={onMouseUp}
						onMouseMove={onMouseMove}
						onMouseOut={onMouseout}
						onBlur={onMouseout}
						ref={componentRef}
						style={{ overflow: 'auto', width: '100%', cursor: 'grab' }}
					>
						{dayInfo && (
							<div id="pdfcont" style={{ display: 'flex' }}>
								<div>
									<Document file={fileData}>
										<Page scale={scale} pageNumber={1} />
									</Document>
								</div>
							</div>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default forwardRef(DialogDayViewer);
