import React, { useEffect } from 'react';
import {
    Text,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';

const Callback = ({route}) => {
    const navigation = useNavigation();
    console.log('Callback screen');
    console.log(route);
    (async () => {
        await EncryptedStorage.setItem("access_token", route.params.access_token)
        await EncryptedStorage.setItem("client_id", route.params.client_id)
        await EncryptedStorage.setItem("domain", route.params.domain)
        await EncryptedStorage.setItem("expires", route.params.expires)
        await EncryptedStorage.setItem("hierarchy_id", route.params.hierarchy_id)
        await EncryptedStorage.setItem("refresh_token", route.params.refresh_token)
        await EncryptedStorage.setItem("user_guid", route.params.user_guid)
        await EncryptedStorage.setItem("user_id", route.params.user_id)
        await EncryptedStorage.setItem("acs_endpoint", route.params.acs_endpoint)
        await EncryptedStorage.setItem("acs_token", route.params.acs_token)
        await EncryptedStorage.setItem("acs_expires", route.params.acs_expires)
        await EncryptedStorage.setItem("acs_displayname", route.params.acs_displayname)
        await EncryptedStorage.setItem("acs_userid", route.params.acs_userid)
        navigation.navigate('Welcome')
    })();

    return(
        <LottieView source={require('../../animation.json')} autoPlay/>
    )
}

export default Callback