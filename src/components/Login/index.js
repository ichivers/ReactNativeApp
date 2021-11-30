import React, { useEffect } from 'react';
import { Linking } from 'react-native'
import { InAppBrowser } from 'react-native-inappbrowser-reborn'
import { getDeepLink } from '../../utilities'
import LottieView from 'lottie-react-native';

const Login = () => {
    console.log('Login screen')
    const deepLink = getDeepLink("callback")
    console.log(deepLink);
    const url = `https://chivs.ngrok.io/mobileauth/${deepLink}`
    console.log(url);

    useEffect(() => {     
    
        try {
            //console.log('here we go')
            (async () => {   
                if (InAppBrowser.isAvailable()) {
                    //console.log('InAppBrowser is available')
                    InAppBrowser.openAuth(url, deepLink, {
                        // iOS Properties
                        ephemeralWebSession: false,
                        // Android Properties
                        showTitle: false,
                        enableUrlBarHiding: true,
                        enableDefaultShare: false
                    }).then((response) => {
                        console.log(response)
                        if (
                            response.type === 'success' &&
                            response.url
                        ) {
                            Linking.openURL(response.url)
                        }
                    })
                } else {
                    console.log('InAppBrowser unavailable')
                    Linking.openURL(url)
                }
            })();
        } catch (error) {
            console.log(error)
            Linking.openURL(url)
        }
    });
    
    return(
        <LottieView source={require('../../animation.json')} autoPlay/>
    );
}

export default Login