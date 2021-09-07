import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Toolbar from '@material-ui/core/Toolbar';
import DialogContent from '@material-ui/core/DialogContent';
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
	},
	dialogHeader: {
		display: 'flex',
		alignItems: 'center',
		backgroundColor: theme.palette.primary.dark
	}
}));

function DialogSearchViewer(props, ref) {
	const componentRef = useRef();
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

	const [isScrolling, setIsScrolling] = useState(false);
	const [clientX, setClientX] = useState(0);
	const [scrollX, setScrollX] = useState(0);
	const [clientY, setClientY] = useState(0);
	const [scrollY, setScrollY] = useState(0);

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

	const onSelectPage = _index => {
		payload.fileName = results[_index].name;
		handleZoomReset();
		setIndex(_index);
	};

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
		console.log('ahaha');
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

	const pageLayout = useRef(null);

	return (
		<Dialog fullScreen open={openDialog} onClose={handleCloseDialog} aria-labelledby="form-dialog-title">
			<div className={classes.dialogHeader} id="scroll-dialog-title">
				<div>
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
				{openDialog && (
					<div className={classes.headerFormat}>
						<Typography className={classes.headerText} variant="h6">
							{navigationService.getStringDate(results[index].date)}
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

			<DialogContent>
				<div style={{ display: 'flex', flexDirection: 'row', height: '99%' }}>
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
						<div id="pdfcont" style={{ display: 'flex' }}>
							{loadingPDF && (
								<div className="h-60">
									<FuseLoading message="Cargando..." />
								</div>
							)}

							{!loadingPDF && (
								<div>
									<Document
										file={fileData}
										onLoadSuccess={onPDFSuccess}
										onLoadProgress={onLoadProgressPDF}
									>
										<Page scale={scale} pageNumber={1} />
									</Document>
								</div>
							)}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default forwardRef(DialogSearchViewer);
