import React from 'react';

import { CookiesProvider } from 'react-cookie';
import CssBaseline from '@material-ui/core/CssBaseline';
import FillTogetherContainer from './containers/FillTogetherContainer';

const Root = () => (
  <CookiesProvider>
    <CssBaseline />
    <FillTogetherContainer />
  </CookiesProvider>
);

export default Root;
