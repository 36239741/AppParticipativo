import React, {useEffect} from 'react'
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 


export default function CreateUserSucess({navigation}) {


    return (
        <View style={styles.container}>
            <AntDesign name="check" size={90} color="green" />
            <Text style={styles.title}>Parabêns!</Text>
            <Text style={styles.title}>Cadastro Efetuado</Text>
            <View style={styles.subTitleContainer}>
                <Text style={styles.subTitle}>Ative sua conta acessando seu email</Text>
                <Text style={styles.subTitle}>e clicando no link "ativar conta"</Text>
            </View>
            <Button title='FAZER LOGIN' color='#0371B6' onPress={() => navigation.navigate('Login')} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    title: {
        fontSize: 20,
        color: '#0371B6',
        textTransform: 'uppercase',
        fontWeight: 'bold'
    },
    subTitleContainer: {
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        marginBottom: 40,
        marginTop: 20
    },
    subTitle: {
        fontSize: 14,
        color: '#0371B6',
        textTransform: 'uppercase',
        fontWeight: 'bold'
    }
})