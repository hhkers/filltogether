import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    width: 500,
    height: 500
  },
  cellContainer: {
    position: 'relative',
    '&:hover': {
        '& $cellCompleted': {
            opacity: 0.3,
        },
        '& $cellCompleted': {
            opacity: 0.3,
        },
        '& $statusBox': {
            opacity: 0.7,
        }, 
    },

  },
  cellCompleted: {
    imageRendering: 'pixelated',
    opacity: 1,
  },
  cellNotCompleted: {
    imageRendering: 'auto',
    cursor: 'pointer',
    opacity: 1,
  },
   statusBox: {
    transition: '.5s ease',
    opacity: 0,
    position: 'absolute',
    top: '0px',
    textAlign: 'center',
    width: '100%',
    height: '100px',
    backgroundColor: '#04AA6d',
    cursor: 'pointer',
  },
  statusText: {
    color: 'white',
    fontSize: '16px',
  },

}));

export default function ImageGridList(props) {
  const classes = useStyles();
  const { data, imgClick } = props;
  
  
  return (
    <div className={classes.root}>
      <GridList
        cellHeight={100}
        className={classes.gridList}
        cols={5}
        spacing={0}
      >
        {data.map(cell => (
          <GridListTile key={cell.id} className={classes.cellContainer}>
            {/* eslint-disable */}
            <img
              src={cell.src}
              alt={cell.src}
              className={cell.status === "completed" ? classes.cellCompleted : classes.cellNotCompleted }
              onClick={() => imgClick(cell)}
            />
            <div className={classes.statusBox} onClick={() => imgClick(cell)}>
                <div className={classes.statusText}>
                {cell.status === "completed" ? "Modify" : cell.status}
                </div>
            </div>
            {/* eslint-enable */}
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}
