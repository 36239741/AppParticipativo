import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import FormContainer from '../components/FormContainer'
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { participativoLogin } from '../Api/Api'
import { onSignIn } from '../Service/auth'

export default function Login({navigation}) {

    const [serverError, setServerError] = useState('');


    var schema = yup.object().shape({
        email: yup.string().required('Campo obrigatório'),
        senha: yup.string().required('Campo obrigatório'),
    });

    const { handleSubmit, control, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const login = (data) => {
        setServerError('')
        participativoLogin.post('/login', data ).then(result => {
            onSignIn(result.headers.authorization)
            navigation.navigate('Index')
        }).catch(error => {
            setServerError(error.response.data.message)
        })
        
    }

    return (
        <>
            <FormContainer>
                <View style={styles.container}>
                    <View style={styles.containerTitle}>
                        <Text style={styles.cityName}>FOZ DO IGUAÇU</Text>
                        <Text style={styles.salutation}>Bem vindo</Text>
                        <Text style={styles.salutation}>cidadão</Text>
                    </View>
                    <View style={styles.containerFields}>
                        <View style={styles.fieldContainer}>
                            <Controller defaultValue='' name='email' control={control} render={({field: {onChange, value}}) => (
                                <TextInput placeholder='Login' style={styles.field} onChangeText={value => onChange(value)} value={value} keyboardType='email-address'/> )}/>
                            {errors.email && <Text style={styles.errorMessage}>{errors.email.message}</Text>}
                        </View>            
                        <View style={styles.fieldContainer}>
                            <Controller defaultValue='' name='senha' control={control} render={({field: {onChange, value}}) => (
                                <TextInput placeholder='Senha' style={styles.field} onChangeText={value => onChange(value)} value={value} secureTextEntry={true}/> )}/>  
                            {errors.senha && <Text style={styles.errorMessage}>{errors.senha.message}</Text>}

                        </View>                
                            <Button title='ENTRAR' color='#0371B6' onPress={handleSubmit(login)}/>
                            <Text style={styles.serverErrorMessage} >{serverError.length > 0 ? serverError : ''}</Text>
                    </View>
                    <View style={styles.containerOptions}>
                        <Text style={styles.forgotPassword} onPress={() => navigation.navigate('Esqueci a senha')}>Esqueceu sua senha?</Text>
                        <Text style={styles.createAccountText} onPress={() => navigation.navigate('Registrar')}>Quero criar uma conta</Text>
                    </View>
                </View>
            </FormContainer>
           
        </>
    )
}


const styles =  StyleSheet.create({
    container: {
        flex: 1
    },
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
    },
        errorMessage :{
        fontSize: 13,
        color: 'red',
        marginTop: 5
    },
    field: {
        borderBottomColor: '#1077b8',
        borderBottomWidth: 1,
        alignSelf: 'stretch',
    },
    fieldContainer: {
        alignSelf: 'stretch',
        flexDirection: 'column',
        marginBottom: 40,
    },
    serverErrorMessage: {
        fontSize: 14,
        color: 'red',
        marginTop: 20,
    }
})