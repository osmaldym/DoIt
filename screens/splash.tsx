import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, ImageStyle, ViewStyle } from 'react-native';
import React from 'react';

const LOGO = require('../assets/logo.png');

const logoStyle: ImageStyle = {
    height: 100,
    resizeMode: 'contain',
};


const safeAreaStyle: ViewStyle = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
};

export function SplashScreen(): React.JSX.Element {
    return (
        <SafeAreaView style={safeAreaStyle}>
            <Image source={LOGO} style={logoStyle}/>
        </SafeAreaView>
    ) ;
}
