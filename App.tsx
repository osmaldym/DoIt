import React from 'react';
import { LoginScreen } from './screens/login';
import { PaperProvider } from 'react-native-paper';

import { Theme } from './theme/colors';

function App(): React.JSX.Element {
  return (
    <PaperProvider theme={Theme}>
     <LoginScreen />
    </PaperProvider>
  )
}

export default App;
