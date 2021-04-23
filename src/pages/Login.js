import React from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';


export default function Login({navigation}) {

    return (
        <>
            <View style={styles.containerTitle}>
                <Text style={styles.cityName}>FOZ DO IGUAÇU</Text>
                <Text style={styles.salutation}>Bem vindo</Text>
                <Text style={styles.salutation}>cidadão</Text>
            </View>
            <View style={styles.containerFields}>
                <TextInput placeholder='Login' style={styles.field}/>
                <TextInput placeholder='Senha'secureTextEntry={true} style={styles.field} />
                <Button title='ENTRAR' color='#0371B6' />
            </View>
            <View style={styles.containerOptions}>
                <Text style={styles.forgotPassword}>Esqueceu sua senha?</Text>
                <Text style={styles.createAccountText}>Quero criar uma conta</Text>
            </View>
        </>
    )
}


const styles =  StyleSheet.create({
    containerTitle: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        top: 100
    },
    cityName: {
        fontSize: 23,
        color: '#1077b8',
        textTransform: 'uppercase',
        fontWeight: 'bold'
    },
    salutation: {
        fontSize: 55,
        color: '#1077b8',
        top: 0
    },
    containerFields: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        padding: 50,
        top: -50
    },
    field: {
        borderBottomColor: '#1077b8',
        borderBottomWidth: 1,
        alignSelf: 'stretch',
        marginBottom: 40
    },
    containerOptions: {
        flexDirection: 'column',
        alignItems: 'center',
        top: -150
    },
    forgotPassword: {
        color: '#1077b8',
        fontSize: 13,
        textDecorationLine: 'underline'
    },
    createAccountText: {
        color: '#1077b8',
        fontSize: 23,
        textDecorationLine: 'underline',
        top: 20
    }
})