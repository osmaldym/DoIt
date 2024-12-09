import React from 'react';
import { PaperProvider } from 'react-native-paper';

import { AppNav } from './navigation/rootStackNavigator';
import { Theme } from './theme/colors';

function App(): React.JSX.Element {
  return (
    <PaperProvider theme={Theme}>
      <AppNav theme={Theme}></AppNav>
    </PaperProvider>
  )
}

export default App;
