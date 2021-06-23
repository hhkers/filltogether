import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
// import { CirclePicker } from 'react-color';
import { ChromePicker } from 'react-color';
import '../css/CanvasContainer.css';
import { isEmpty } from 'lodash';

import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import SaveIcon from '@material-ui/icons/Save';
import SyncIcon from '@material-ui/icons/Sync';
import GridOnIcon from '@material-ui/icons/GridOn';

import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import ArtifactsContainer from './ArtifactsContainer';
// import FormLabel from '@material-ui/core/FormLabel';
// import FormControl from '@material-ui/core/FormControl';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import FormHelperText from '@material-ui/core/FormHelperText';
import { saveCell } from '../apis/artifacts';
import { dataURItoBlob } from '../apis/file';

const API_URL = 'http://3.37.161.56:8000';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

/* eslint-disable */
export default function CanvasContainer(props) {
  const { currentArtifactId, boughtCellId, previewInitialized, setPreviewInitialized } = props;
  const [rows, setRows] = useState(1);
  const [columns, setColumns] = useState(1);
  const [height, setHeight] = useState(10);
  const [width, setWidth] = useState(10);
  const [background, setBackground] = useState('#fff');
  const [cellColor, setCellColor] = useState('#000');
  const [mouseDown, setMouseDown] = useState(false);
  const [selectedGrid, setSelectedGrid] = useState('grid-0-0');

  const [previewUrl, setPreviewUrl] = useState('#');
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [optionGridEdge, setOptionGridEdge] = useState(false);
  const [showBuyGrid, setShowBuyGrid] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [defaultPixelSize, setDefaultPixelSize] = useState(50);
  const [pixelSize, setPixelSize] = useState(50);

  const save = () => {
    console.log('Save: upload drawing to server');
  };

  const synchronize = () => {
    console.log('Synchronization');
  };

  const openBuyGrid = () => {
    setShowBuyGrid(true);
  };

  const closeBuyGrid = () => {
    setShowBuyGrid(false);
  };

  const loadImage = () => {};

  const cleanGrid = () => {
    const loc = selectedGrid.split('-');
    const selectedRow = loc[1];
    const selectedCol = loc[2];

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const pixelId = selectedRow + '_' + selectedCol + '_' + i + '_' + j;
        document.getElementById(pixelId).style.backgroundColor = '#fff';
      }
    }

    initPreview();
  };

  const snackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };

  const initPreview = () => {
    const canvasWidth = columns * width;
    const canvasHeight = rows * height;

    const canvas = document.getElementById('preview');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  };

  const zoomIn = () => {
    setPixelSize(Math.min(pixelSize + 1, 60));
  };

  const zoomOut = () => {
    setPixelSize(Math.max(pixelSize - 1, 5));
  };

  const zoomOutMap = () => {
    setPixelSize(defaultPixelSize);
  };

  const handleDisplayOptions = event => {
    setOptionGridEdge(event.target.checked);
  };

  // Cell color
  const handleCellColor = color => {
    setCellColor(color.hex);
  };

  const handleColorPickerClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleColorPickerClose = () => {
    setDisplayColorPicker(false);
  };

  const handleCellColorOnClick = event => {
    const { parentNode } = event.target;
    const { id } = parentNode.parentNode.parentNode;

    if (!previewInitialized) {
      initPreview();
      setPreviewInitialized(true);
    }

    event.target.style.backgroundColor = cellColor;

    setMouseDown(true);

    // for preview
    const loc = event.target.id.split('_');
    const x = parseInt(loc[1], 10) * width + parseInt(loc[3], 10);
    const y = parseInt(loc[0], 10) * height + parseInt(loc[2], 10);

    const canvas = document.getElementById('preview');
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = cellColor;
    ctx.fillRect(x, y, 1, 1);
  };

  const handleMouseState = () => {
    setMouseDown(false);
  };

  // Table background color
  const handleBackgroundColor = color => {
    setBackground(color.hex);
  };

  // Remove color
  const handleColorRemove = event => {
    event.target.style.backgroundColor = '';
    
    const loc = event.target.id.split('_');
    const x = parseInt(loc[1], 10) * width + parseInt(loc[3], 10);
    const y = parseInt(loc[0], 10) * height + parseInt(loc[2], 10);

    const canvas = document.getElementById('preview');
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#fff';
    ctx.fillRect(x, y, 1, 1);

  };

  const createPixel = (gridRow, gridCol) => {
    const table = [];

    let pixel_edge_on = {
      borderSpacing: '0',
      border: '1px dotted grey',
      width: pixelSize + 'px',
      height: pixelSize + 'px',
      cursor: 'pointer',
      margin: '0',
      padding: '0',
      fontSize: '0'
    };

    let pixel_edge_off = {
      borderSpacing: '0',
      border: '0px dotted grey',
      width: pixelSize + 'px',
      height: pixelSize + 'px',
      cursor: 'pointer',
      margin: '0',
      padding: '0',
      fontSize: '0'
    };

    for (let i = 0; i < height; i++) {
      const children = [];
      for (let j = 0; j < width; j++) {
        // children.push(<td>{`[${gridRow}, ${gridCol}] - ${i+1}, ${j+1}`}</td>)
        // children.push(<td>{`${i+1}, ${j+1}`}</td>)
        children.push(
          <td
            style={optionGridEdge ? pixel_edge_off : pixel_edge_on}
            id={`${gridRow}_${gridCol}_${i}_${j}`}
            key={`[${gridRow}_${gridCol}]__${i}_${j}`}
          />
        );
      }
      table.push(<tr key={`[${gridRow}_${gridCol}]__${i}`}>{children}</tr>);
    }

    return table;
  };

  const handleSubmit = () => {
    console.log(boughtCellId);
    if (boughtCellId === undefined)
      return

    const canvas = document.getElementById('preview');

    const loc = selectedGrid.split('-');
    const selectedRow = loc[1];
    const selectedCol = loc[2];

    const totalCanvas = document.getElementById('preview');
    let partialCanvas = document.createElement('canvas');
    partialCanvas.width = width; // width of saved image
    partialCanvas.height = height; // height of saved image

    let cropStartX = selectedCol * height; // position to start cropping image
    let cropStartY = selectedRow * height;

    partialCanvas
      .getContext('2d')
      .drawImage(
        totalCanvas,
        cropStartX,
        cropStartY,
        partialCanvas.width,
        partialCanvas.height,
        0,
        0,
        partialCanvas.width,
        partialCanvas.height
      );

    console.log(dataURItoBlob(partialCanvas.toDataURL()));
    // console.log(dataURItoBlob(canvas.toDataURL()));
    console.log('selectedGrid: ' + selectedGrid);
    if (isEmpty(selectedGrid)) {
      alert('grid를 선택해주세요');
      return;
    }
    const args = {
      baseDomain: API_URL,
      artifactId: currentArtifactId,
      cellId: boughtCellId,
      imageUrl: dataURItoBlob(partialCanvas.toDataURL())
    };

    saveCell(args)
      .then(res => {
        alert('저장 되었습니다.');
        console.log(res);
      })
      .catch(error => {
        alert('저장할 수 없습니다.');
        console.log(error);
      });
  };

  const createGrid = () => {
    const tr = [];

    for (let i = 0; i < rows; i++) {
      const td = [];

      for (let j = 0; j < columns; j++) {
        const pixel = createPixel(i, j);
        td.push(
          <td className={optionGridEdge ? 'grid_edge_on' : 'grid_edge_off'}>
            <table
              className="gridPixel"
              id={`grid-${i}-${j}`}
              key={`t${i}_${j}`}
              style={{ backgroundColor: background }}
              onMouseDown={handleCellColorOnClick}
              onMouseMove={mouseDown ? handleCellColorOnClick : null}
              onMouseUp={handleMouseState}
              onMouseLeave={handleMouseState}
              onTouchStart={handleCellColorOnClick}
              onTouchMove={mouseDown ? handleCellColorOnClick : null}
              onTouchEnd={handleMouseState}
              onDoubleClick={handleColorRemove}
            >
              <thead />
              <tbody>{pixel}</tbody>
            </table>
          </td>
        );
      }

      tr.push(<tr>{td}</tr>);
    }

    return tr;
  };

  const selectGrid = event => {
    setSelectedGrid(event.target.value);
  };

  const downloadPreview = () => {
    const canvas = document.getElementById('preview');
    setPreviewUrl(canvas.toDataURL);
  };

  const getGridIndex = () => {
    const gridRow = Math.floor(boughtCellId / 5);
    const gridCol = boughtCellId % 5;

    if (boughtCellId === undefined) {
        return "No bought grid";
    } else {
        return `You are drawing on ( ${gridRow}, ${gridCol} )`;
    }
  };

  return (
    <div className="CApp">
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="flex-start"
        spacing={1}
      >
        <Grid item xs={12}>
            <p>{getGridIndex()}</p>
        </Grid>
        <Grid item xs={3}>
        {/*
          <ButtonGroup
            color="primary"
            aria-label="outlined primary button group"
          >
            <Button onClick={save} startIcon={<SaveIcon />}>
              Save
            </Button>
            <Button onClick={synchronize} startIcon={<SyncIcon />}>
              Sync
            </Button>
          </ButtonGroup>
          <hr className="Separator" />
        */}
          <ToggleButtonGroup
            value="pencil"
            exclusive
            onChange={null}
            aria-label="text alignment"
          >
            <ToggleButton value="zoomin" aria-label="zoomin" onClick={zoomIn}>
              <ZoomInIcon />
            </ToggleButton>
            <ToggleButton
              value="zoomout"
              aria-label="zoomout"
              onClick={zoomOut}
            >
              <ZoomOutIcon />
            </ToggleButton>
            <ToggleButton
              value="zoomoutmap"
              aria-label="zoomoutmap"
              onClick={zoomOutMap}
            >
              <ZoomOutMapIcon />
            </ToggleButton>
          </ToggleButtonGroup>
          <hr className="Separator" />

          <ToggleButtonGroup
            value="pencil"
            exclusive
            onChange={null}
            aria-label="text alignment"
          >
            <ToggleButton value="clear" aria-label="clear" onClick={cleanGrid}>
              <DeleteOutlineIcon />
            </ToggleButton>
            <ToggleButton value="undo" aria-label="undo" disabled>
              <UndoIcon />
            </ToggleButton>
            <ToggleButton value="redo" aria-label="redo" disabled>
              <RedoIcon />
            </ToggleButton>
          </ToggleButtonGroup>
          <hr className="Separator" />
          <center>
            <ChromePicker color={cellColor} onChange={handleCellColor} />
          </center>
          <hr className="Separator" />
          <FormControl component="fieldset">
            <FormLabel component="legend">Display options</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={optionGridEdge}
                    onChange={handleDisplayOptions}
                    name="optionGridEdge"
                  />
                }
                label="Remove edge"
              />
            </FormGroup>
          </FormControl>
        </Grid>
        <Grid container justify="center" alignItems="center" xs={6}>
          <table className="grid">
            <thead />
            <tbody>{createGrid()}</tbody>
          </table>
        </Grid>
        <Grid item xs={3}>
          <h3>Preview</h3>
          <br />
          <br />
          <canvas id="preview" style={{ imageRendering: 'pixelated' }} width={columns * width} height={rows * height} />
          <br />
          <br />
          <br />
          <br />
          <Button
            variant="contained"
            color="primary"
            href={previewUrl}
            download="preview.png"
            onClick={downloadPreview}
          >
            Download Preview
          </Button>
          <br />
          <br />
          <Button
            variant="contained"
            color="secondary"
            href={previewUrl}
            onClick={handleSubmit}
          >
            Submit
          </Button>
          <br />
          <br />
        </Grid>
      </Grid>

      {/* Buy Grid */}
      <Dialog
        onClose={closeBuyGrid}
        aria-labelledby="customized-dialog-title"
        open={showBuyGrid}
      >
        <DialogTitle id="customized-dialog-title" onClose={closeBuyGrid}>
          Buy Grid
        </DialogTitle>
        <DialogContent dividers>
          <ArtifactsContainer />
        </DialogContent>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={1000}
        onClose={snackbarClose}
      >
        <Alert onClose={snackbarClose} severity="error">
          This is not your grid.
        </Alert>
      </Snackbar>
    </div>
  );
}

const dialogStyles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
});

const DialogTitle = withStyles(dialogStyles)(props => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);
