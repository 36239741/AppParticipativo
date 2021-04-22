import React, { useState } from 'react';
import Routes from './src/routes'
import SplashScreen  from './src/pages/SplashScreen'


export default function App() {

  const [splashScreen, setSplashScreen] = useState(true);


  function loading() {
    setTimeout(function() {
      setSplashScreen(false)
    }, 3000)

    if(splashScreen) {
      return <SplashScreen/>
    } else {
      return <Routes/>
    }
  }

  return (

    loading()
    
  );
}

