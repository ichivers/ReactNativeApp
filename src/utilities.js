import { Platform } from 'react-native'
import EncryptedStorage from 'react-native-encrypted-storage';

export const getDeepLink = (path = "") => {
  const scheme = 'spokeauth'
  //const prefix = Platform.OS == 'android' ? `${scheme}://com.retail_manager.metro/` : `${scheme}://`
  const prefix = Platform.OS == 'android' ? `com.retail_manager.metro/` : `${scheme}://`
  return prefix + path
}

export const validateAccessToken = async() => {
  const storageExpires = await EncryptedStorage.getItem("expires");
  const refreshToken = await EncryptedStorage.getItem("refreshToken")
  if (expires !== null) {
    var expires = new Date(0)
    var now = new Date()
    expires.setUTCSeconds(storageExpires - 60) // Allow a minute
    if(now > expires)
    {
      console.log('Access token has expired')
      let formData = new FormData();
      formData.append('grant_type', 'refresh_token');
      formData.append('refresh_token', 'John123');
      formData.append('client_id', 'SpokePlugin')
      const response = await fetch("https://chivs.ngrok.io/oauth/token",
      {
        body: formData,
        method: "post"
      });
    } else {
      console.log('Access token is valid')
      return true;
    }
  } else {
    console('We have no access token')
    return false
  }
}