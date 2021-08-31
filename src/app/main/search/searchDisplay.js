import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Toolbar from '@material-ui/core/Toolbar';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { Document, Page } from 'react-pdf';
import clsx from 'clsx';
import searchService from 'app/services/searchService';
import navigationService from 'app/services/navigationService';
import FuseLoading from '@fuse/core/FuseLoading';

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
		justifyContent: 'space-around'
	},

	buttonbar: {
		justifyContent: 'center',
		display: 'flex',
		margin: '10px'
	},
	document: {
		display: 'flex',
		justifyContent: 'center',
		overflow: 'scroll'
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
	}
}));

function DialogSearchViewer(props, ref) {
	const classes = useStyles();

	const [openDialog, setOpenDialog] = useState(false);
	const [selectedDate, setDate] = useState(null);
	const [dayInfo, setDayInfo] = useState(null);
	const [selectedPage, setSelectedPage] = useState(0);
	const [scale, setScale] = useState(1);

	const [results, setResults] = useState([]);
	const [index, setIndex] = useState(0);
	const [payload, setPayload] = useState(null);
	const [fileData, setFileData] = useState(null);
	const [loadingPDF, setLoadingPDF] = useState(false);

	useEffect(() => {
		loadFileInfo();
	}, [index, payload]);

	useImperativeHandle(
		ref,
		() => ({
			handleOpenDialog(currentIndex, _results, _payload) {
				setIndex(currentIndex);
				setResults(_results);
				setFileData(null);
				_payload.fileName = _results[currentIndex].name;
				setPayload(_payload);
				setOpenDialog(true);
			}
		}),
		[]
	);

	function loadFileInfo() {
		if (results.length < index) return;

		setLoadingPDF(true);
		searchService
			.docDetailSearch(payload)
			.then(data => {
				setFileData(data.data);
			})
			.finally(() => {
				setLoadingPDF(false);
			});
	}

	const handleCloseDialog = () => {
		setOpenDialog(false);
	};

	const onSelectPage = (_index) => {
		payload.fileName = results[_index].name;
		setIndex(_index);
	}

	const handleZoomIn = ev => {
		setScale(scale + 0.5);
	};

	const handleZoomOut = ev => {
		setScale(scale - 0.5);
	};

	function handleWheel(e) {
		e.preventDefault();
		return false;
	}

	const handleZoomReset = () => {
		setScale(1);
	};

	const handleDownloadButton = () => {
		searchService.downloadDocDetailSearch(payload).then(data => {
			console.log('');
		});
	};

	const renderBackButton = () => {
		return (
			<Button
				disabled={index <= 0}
				className={clsx(classes.buttonbarstyle, 'whitespace-nowrap mx-4')}
				variant="contained"
				onClick={() => onSelectPage(index - 1)}
				startIcon={<Icon className="hidden sm:flex">navigate_before</Icon>}
			>
				Anterior
			</Button>
		);
	};

	const renderNextButton = () => {
		return (
			<Button
				className={clsx(classes.buttonbarstyle, 'whitespace-nowrap mx-4')}
				variant="contained"
				onClick={() => onSelectPage(index + 1)}
				startIcon={<Icon className="hidden sm:flex">navigate_next</Icon>}
			>
				Siguiente
			</Button>
		);
	};

	const onPDFSuccess = success => {
		console.log('success complete');
	};

	const onLoadProgressPDF = progress => {
		console.log(`pdf progress ${progress}`);
	};

	const pageLayout = useRef(null);

	return (
		<Dialog fullScreen open={openDialog} onClose={handleCloseDialog} aria-labelledby="form-dialog-title">
			<AppBar position="static" elevation={0}>
				<Toolbar className="flex w-full">
					<IconButton
						size="medium"
						edge="start"
						color="inherit"
						onClick={handleCloseDialog}
						aria-label="close"
					>
						<CloseIcon />
					</IconButton>

					{openDialog && (
						<div className={classes.headerFormat}>
							<Typography className={classes.headerText} variant="h6">
								{navigationService.getStringDate(results[index].date)}
							</Typography>
						</div>
					)}
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
								<Paper className="w-full rounded-20 shadow flex flex-col justify-between">
									<div id="pdfcont" onWheel={handleWheel}>
										<div className={classes.completebuttonbar}>
											{renderBackButton()}
											<div className={classes.buttonbar}>
												<Button
													disabled={scale >= 3 || !fileData}
													className={clsx(
														classes.button,
														classes.settingsButton,
														'whitespace-nowrap mx-4'
													)}
													onClick={handleZoomIn}
													variant="contained"
												>
													<Icon className={classes.buttonIcon}>zoom_in</Icon>
												</Button>
												<Button
													disabled={scale <= 1 || !fileData}
													className={clsx(classes.button, 'whitespace-nowrap mx-4')}
													onClick={handleZoomOut}
													variant="contained"
												>
													<Icon className={classes.buttonIcon}>zoom_out</Icon>
												</Button>
												<Button
													disabled={!fileData}
													className={clsx(
														classes.button,
														classes.settingsButton,
														'whitespace-nowrap mx-4'
													)}
													onClick={handleZoomReset}
													variant="contained"
												>
													<Icon className={classes.buttonIcon}>zoom_out_map</Icon>
												</Button>
												<Button
													className={clsx(
														classes.button,
														classes.settingsButton,
														'whitespace-nowrap mx-4'
													)}
													onClick={handleDownloadButton}
													variant="contained"
												>
													<Icon className={classes.buttonIcon}>get_app</Icon>
												</Button>
											</div>
											{renderNextButton()}
										</div>

										{loadingPDF && (
											<div className="h-60">
												<FuseLoading message="Cargando..." />
											</div>
										)}

										{!loadingPDF && (
											<Document
												className={classes.document}
												file={fileData}
												onLoadSuccess={onPDFSuccess}
												onLoadProgress={onLoadProgressPDF}
											>
												<Page scale={scale} pageNumber={1} />
											</Document>
										)}
									</div>
								</Paper>
							</div>
						</div>
					}
					ref={pageLayout}
				/>
			</div>
		</Dialog>
	);
}

export default forwardRef(DialogSearchViewer);
