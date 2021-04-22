import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import WhiteLogo from '../../assets/participativo-logo.png';
import Loading from '../components/Loading'


export default function SplashScreen() {

    return(
        <View style={styles.container}>
            <Image source={WhiteLogo} style={styles.logo}/>
            <Loading />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0371B6',
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        width: 250,
        height: 294,
        backgroundColor: '#0371B6',
        marginBottom: 50
    }
})