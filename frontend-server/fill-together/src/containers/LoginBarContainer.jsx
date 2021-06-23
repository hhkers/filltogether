import React, { useEffect } from 'react';
import axios from 'axios';
import QRCode from 'qrcode.react';
import { useCookies } from 'react-cookie';
import { isNil, get } from 'lodash';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import { yellow, brown } from '@material-ui/core/colors';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { DialogContentText } from '@material-ui/core';
import {
  getAddressByKlip,
  APP_NAME,
  DEFAULT_QR_CODE
} from '../smart-contract/api/UseKlip.js';
import { getAddressByKaikas } from '../smart-contract/api/UseKaikas.js';

import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';
import SupervisedUserCircleSharpIcon from '@material-ui/icons/SupervisedUserCircleSharp';

const useStyles = makeStyles(theme => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none'
    }
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap'
  },
  toolbarTitle: {
    flexGrow: 1,
    verticalAlign: 'middle',
    display: 'inline-flex'
  }
}));

export default function LoginBarContainer() {
  const [verifyLogin, setVerifyLogin] = React.useState(false);
  const [walletAddress, setWalletAddress] = React.useState('Connect Wallet');
  const [cookies, setCookie] = useCookies([
    'fillTogether_login_type',
    'fillTogether_wallet_addr'
  ]);

  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [openConnectWallet, setOpenConnectWallet] = React.useState(false);
  const [openConnectKaikas, setOpenConnectKaikas] = React.useState(false);
  const [openConnectKlip, setOpenConnectKlip] = React.useState(false);

  const [qrvalue, setQrvalue] = React.useState(DEFAULT_QR_CODE);


  useEffect(() => {
    if (!isNil(cookies)) {
      setWalletAddress(get(cookies, 'fillTogether_wallet_addr', 'Connect Wallet'));
    }
  }, []);



  {
    /* Connect Wallet */
  }
  const handleClickOpenConnectWallet = () => {
    if (verifyLogin) {
      copyWalletAddress(walletAddress);
    } else {
      setOpenConnectWallet(true);
    }
  };

  const handleCloseConnectWallet = () => {
    setOpenConnectWallet(false);
  };

  {
    /* Kaikas */
  }
  const handleClickOpenConnectKaikas = () => {
    alert("Kaikas 지갑은 추후 지원될 예정입니다.")
    return
    /*setOpenConnectWallet(false);
    setOpenConnectKaikas(true);

    getAddressByKaikas(
      addr => {
        console.log(addr);
        setOpenConnectKaikas(false);
        setWalletAddress(addr);
        setCookie('fillTogether_login_type', 'kaikas', { path: '/' });
        setCookie('fillTogether_wallet_addr', addr, { path: '/' });
      },
      () => {
        setOpenConnectKaikas(false);
      }
    );*/
  };

  const handleCloseConnectKaikas = () => {
    setOpenConnectKaikas(false);
  };

  {
    /* Klip */
  }
  const handleClickOpenConnectKlip = () => {
    getAddressByKlip(
      qr => {
        setQrvalue(qr);
      },
      addr => {
        setVerifyLogin(true);
        setWalletAddress(addr);
        setCookie('fillTogether_login_type', 'klip', { path: '/' });
        setCookie('fillTogether_wallet_addr', addr, { path: '/' });
        setOpenConnectKlip(false);
      }
    );

    setOpenConnectWallet(false);
    setOpenConnectKlip(true);
  };

  const handleCloseConnectKlip = () => {
    setOpenConnectKlip(false);
  };

  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      className={classes.appBar}
    >
      <Toolbar className={classes.toolbar}>
        <Typography
          variant="h6"
          color="inherit"
          noWrap
          className={classes.toolbarTitle}
        >
          <SupervisedUserCircleSharpIcon fontSize="large" style={{marginRight: '8px'}} /> {APP_NAME}<sup style={{fontSize: '8px', marginLeft: '2px'}}><i> beta</i></sup>
        </Typography>
        <Typography style={{align: "center", flexGrow: 1, verticalAlign: 'middle', display: 'inline-flex'}}>
            <NotificationImportantIcon /> 1st work in progress!
        </Typography>
        <Button
          href="#"
          color="primary"
          variant="outlined"
          onClick={handleClickOpenConnectWallet}
        >
          {walletAddress}
        </Button>
      </Toolbar>

      {/* [Start] Dialog for ConnectWallet */}
      <Dialog
        fullScreen={fullScreen}
        open={openConnectWallet}
        onClose={handleCloseConnectWallet}
      >
        <center>
        <DialogContent style={{ marginBottom: '36px', padding: '30px' }}>
          <DialogTitle id="responsive-dialog-title" style={{ padding: '0px' }}>
            <span style={{ fontSize: '25px', fontWeight: '700' }}>
              Connect Wallet
            </span>
          </DialogTitle>
          <DialogContentText
            id="alert-dialog-description"
            style={{ marginTop: '20px', marginBottom: '40px' }}
          >
            <span style={{ fontSize: '20px' }}>Select a wallet to connect</span>
            <br />
            <span style={{ fontSize: '14px' }}>(Currently only supports <b>Klip</b>)</span>
          </DialogContentText>
          <KaikasButton
            variant="contained"
            color="primary"
            className={classes.margin}
            onClick={handleClickOpenConnectKaikas}
            disabled
          >
            <img
              src="https://gblobscdn.gitbook.com/spaces%2F-MJfFH5-GGoPIDP49ao8%2Favatar-1602748674034.png"
              height="30px"
            />
            Connect to Kaikas wallet
          </KaikasButton>
          <KlipButton
            variant="contained"
            color="primary"
            className={classes.margin}
            onClick={handleClickOpenConnectKlip}
          >
            <img src="https://klipwallet.com/img/teasing-logo.svg" />
            Connect to Klip (Wallet)
          </KlipButton>
        </DialogContent>
        </center>
      </Dialog>
      {/* [End] Dialog for ConnectWallet */}

      {/* [Start] Dialog for Kaikas */}
      <Dialog
        fullScreen={fullScreen}
        open={openConnectKaikas}
        onClose={handleCloseConnectKaikas}
        fullWidth="sm"
        maxWidth="sm"
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          Connect to Kaikas
        </DialogTitle>
        <DialogContent>
          <CircularProgress />
        </DialogContent>
      </Dialog>
      {/* [End] Dialog for Kaikas */}

      {/* [Start] Dialog for Klip */}
      <Dialog
        fullScreen={fullScreen}
        open={openConnectKlip}
        onClose={handleCloseConnectKlip}
        aria-labelledby="responsive-dialog-title"
      >
        <center>
        <DialogTitle id="responsive-dialog-title">
          Connect to Kakao Kilp via QR Code
        </DialogTitle>
        <DialogContent style={{backgroundColor: yellow[500]}}>
          <QRCode value={qrvalue} />
        </DialogContent>
        </center>
      </Dialog>
      {/* [End] Dialog for Klip */}
    </AppBar>
  );
}

const KaikasButton = withStyles(theme => ({
  root: {
    height: '60px',
    padding: '0 30px',
    marginBottom: '15px',
    color: theme.palette.getContrastText(brown[500]),
    backgroundColor: brown[500],
    '&:hover': {
      backgroundColor: brown[700]
    }
  }
}))(Button);

const KlipButton = withStyles(theme => ({
  root: {
    height: '60px',
    padding: '0 30px',
    color: theme.palette.getContrastText(yellow[500]),
    backgroundColor: yellow[500],
    '&:hover': {
      backgroundColor: yellow[700]
    }
  }
}))(Button);

const copyWalletAddress = walletAddress => {
  const el = document.createElement('textarea');
  el.value = walletAddress;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  const selected =
    document.getSelection().rangeCount > 0
      ? document.getSelection().getRangeAt(0)
      : false;
  el.select();
  const success = document.execCommand('copy');
  document.body.removeChild(el);
  if (selected) {
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(selected);
  }
  return success;
};
