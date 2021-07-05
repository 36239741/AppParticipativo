import React, { useState } from 'react';
import { StyleSheet, View, Text , Button, TextInput  } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormContainer from '../components/FormContainer'
import { participativoApi } from '../Api/Api'
import { Snackbar } from 'react-native-paper';

export default function ForgotPassword({navigation}) {

    var schema = yup.object().shape({
        email: yup.string().email('E-mail inválido').required('Campo obrigatório'),
      });

    const { handleSubmit, control, formState: { errors },setValue } = useForm({
        resolver: yupResolver(schema)
    });

    const [snack, setSnackBar] = useState(false);


    const onSubmit = async (data) => {

        await participativoApi.post('auth/esquecisenha', data);
        setValue('email', '')
        setSnackBar(true);

    };


    return(
        <>
            <FormContainer>
                <View style={styles.container}>
                   <Text style={styles.title}>Esqueceu a senha?</Text>
                   <Text style={styles.instructions}>informe seu email para receber</Text>
                   <Text style={styles.instructions}>um link para redefinir sua senha</Text>
                    <View style={styles.fieldContainer}>
                        <Controller name='email' defaultValue='' control={control} render={({field: {onChange, value}}) => (
                            <TextInput placeholder='Email' keyboardType='email-address' style={styles.field} value={value} onChangeText={(value) => onChange(value)}/>
                        )} />
                        {errors.email && <Text style={styles.errorMessage}>{errors.email.message}</Text>}
                    </View>               
                    <Button title='ENVIAR' onPress={handleSubmit(onSubmit)} color='#0371B6' /> 
                    <Text style={styles.createAccountText} onPress={() => navigation.navigate('Registrar')}>Quero criar uma conta</Text>
                </View>      
            </FormContainer>
            <Snackbar
              visible={snack}
              onDismiss={() => setSnackBar(false)}
              action={{
                color: 'black',
                label: 'Fechar',
                onPress: () => setSnackBar(false) }}
              style={{backgroundColor: "#C3C3C3"}}>
              <View><Text>Email de recuperação de senha enviado com sucesso!</Text></View>
            </Snackbar>     
        </>
    )
}

const styles = StyleSheet.create({
    container : {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 50,
        top: -100
    },
    title: {
        fontSize: 20,
        color: '#1077b8',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    instructions: {
        fontSize: 13,
        color: '#1077b8',
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
    field: {
        borderBottomColor: '#1077b8',
        borderBottomWidth: 1,
        alignSelf: 'stretch',
        marginTop: 80
    },
    createAccountText: {
        color: '#1077b8',
        fontSize: 23,
        textDecorationLine: 'underline',
        top: 20
    },
    fieldContainer: {
        alignSelf: 'stretch',
        flexDirection: 'column',
        marginBottom: 80,
    },
    errorMessage :{
        fontSize: 13,
        color: 'red',
        marginTop: 5
    },
})