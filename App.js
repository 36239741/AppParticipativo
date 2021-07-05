import React, { useState, useEffect } from 'react';
import Routes from './src/routes'
import SplashScreen  from './src/pages/SplashScreen'
import { isSignedIn, onSignOut } from './src/Service/auth'
import { Provider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';


export default function App() {

  const [splashScreen, setSplashScreen] = useState(true);
  const [signLoaded, setSignLoaded] = useState(false);

  useEffect(() => {
    isSignLoaddes();
  },[])

  async function isSignLoaddes() {

    const isSign = await isSignedIn();

    setSignLoaded(isSign);

  }

  function loading() {
    setTimeout(function() {
      setSplashScreen(false)
    }, 3000)

    if(splashScreen) {
      return <SplashScreen/>
    } else {
      return <Routes isLogged={signLoaded}/>
    }
  }

  return (
    <Provider>
    <NavigationContainer >
    {loading()}
    </NavigationContainer>
    </Provider>
  );
}

