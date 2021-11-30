import React, { useEffect } from 'react';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { validateAccessToken } from '../../utilities';

const Splash = () => {
    const navigation = useNavigation();
    useEffect(() => {        
        console.log("Splash screen")
        try {   
            (async () => {
                const requiresLogin = await validateAccessToken()
                if (requiresLogin) {
                    navigation.navigate('Welcome')
                } else {
                    console.log('Navigate to Login')
                    navigation.navigate('Login')
                }
             })();
        } catch (error) {
            console.log(error)
        }
    });

    return(
        <LottieView source={require('../../animation.json')} autoPlay/>
    )
}

export default Splash