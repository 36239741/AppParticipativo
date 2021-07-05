import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, ScrollView, KeyboardAvoidingView, Switch } from 'react-native';
import LoadingPhoto from '../components/LoadingPhoto'
import { Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import CpfMask from '../Util/CpfMask';
import PhoneMask from '../Util/PhoneMask';
import cpfValidator from '../Util/CpfValidator'
import FormContainer from '../components/FormContainer'
import { participativoApi } from '../Api/Api'
import DatePicker from '../components/DateTimePicker'

const minumumAge = 13;
export default function Register({navigation}) {

    const [userPhoto, setUserPhoto] = useState(null);

    var schema = yup.object().shape({
        cpf: yup.string().required('Campo obrigatório').test('cpfValidate','Cpf inválido', value => cpfValidator(value)),
        dataDeNascimento: yup.date().required('Campo obrigatório').test('ageValidate', 'Proibido o cadastro de menores de 13 anos', value => ageValidator(value)),
        email: yup.string().email('E-mail inválido').required('Campo obrigatório'),
        nome: yup.string().required('Campo obrigatório'),
        sobrenome: yup.string().required('Campo obrigatório'),
        senha: yup.string().required('Campo obrigatório'),
        repetirSenha: yup.string().required('Campo obrigatório')
            .oneOf([yup.ref('senha'), null], 'Senha diferente da digitada anteriormente'),
        telefone: yup.string().required('Campo obrigatório'),
        termos: yup.boolean().required('Não é possivel fazer o cadastro sem aceitar os temos').test('termValidate', 'Termo não aceito', value => value ),
      });

      const { handleSubmit, control, formState: { errors }, setError } = useForm({
        resolver: yupResolver(schema)
    });

    function ageValidator(dateString) {

        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age < minumumAge ? false : true;
    }

    const onSubmit = async (data) => {

        const d = new Date(data.dataDeNascimento)

        let usuario = {
            cpf: data.cpf.replace(/[^a-zA-Z 0-9]/g, ''),
            dataNascimento: dataAtualFormatada(d),
            email: data.email,
            nome: data.nome,
            sobrenome: data.sobrenome,
            senha: data.senha,
            telefone: data.telefone.replace(/[^a-zA-Z 0-9]/g, '').replace(' ', '')
        }
 
        participativoApi.post('usuarios', usuario).then(response => {
            navigation.navigate('Sucesso', {screen: 'Sucesso ao criar usuário'})
        },error => {

            const errors = error.response.data.errors;

            if(!errors) return;

            errors.forEach(error => {
                setError(error.fieldName, {message: error.message})
            })
        })

    };

    function dataAtualFormatada(data){

        var dia  = data.getDate().toString()
        var diaF = (dia.length == 1) ? '0'+dia : dia
        var mes  = (data.getMonth()+1).toString() //+1 pois no getMonth Janeiro começa com zero.
        var mesF = (mes.length == 1) ? '0'+mes : mes
        var anoF = data.getFullYear()
    
    return diaF+"/"+mesF+"/"+anoF;
    }

    return (
        <>  
            <FormContainer>
                <View style={styles.container}>
                    <Text style={styles.title}>Criar uma conta</Text>
                    <Text style={styles.subtitle}>Dados pessoais do usuário</Text>
        
                    <KeyboardAvoidingView
                        style={styles.scrollView}
                        behavior={Platform.select({
                            ios: Platform.OS === "ios" ? "padding" : "height",
                        })}
                        enabled 
                        keyboardVerticalOffset={100}>
                        <ScrollView style={styles.scrollView}>
                            <View style={styles.containerFields}>
                                <View style={styles.fieldContainer}>
                                    <Controller defaultValue='' name='cpf' control={control} render={({ field:{ onChange, value } }) => (
                                        <TextInput placeholder='CPF' style={styles.field} onChangeText={value => onChange(CpfMask(value))} value={value} maxLength={14} keyboardType='numeric'/> )}/>
                                    {errors.cpf && <Text style={styles.errorMessage}>{errors.cpf.message}</Text>}
                                </View>
                                <View style={styles.fieldContainer}>
                                        <Text style={styles.datepickerLabel}>Data de Nascimento</Text>
                                        <Controller defaultValue={new Date()} name='dataDeNascimento' control={control} render={({field: {onChange, value}}) => (
                                            <DatePicker date={ value } onChange={ onChange }/> )}/>
                                    {errors.dataDeNascimento && <Text style={styles.errorMessage}>{errors.dataDeNascimento.message}</Text>}
                                </View>
                                        
                                <View style={styles.fieldContainer}>
                                    <Controller defaultValue='' name='email' control={control} render={({field: {onChange, value}}) => (
                                        <TextInput placeholder='E-mail' style={styles.field} onChangeText={value => onChange(value)} value={value} keyboardType='email-address'/> )}/>
                                    {errors.email && <Text style={styles.errorMessage}>{errors.email.message}</Text>}
                                </View>
                                    
                                <View style={styles.fieldContainer}>
                                    <Controller defaultValue='' name='nome' control={control} render={({field: {onChange, value}}) => (
                                        <TextInput placeholder='Nome' style={styles.field} onChangeText={value => onChange(value)} value={value}/> )}/>
                                    {errors.nome && <Text style={styles.errorMessage}>{errors.nome.message}</Text>}
                                    
                                </View>
                                <View style={styles.fieldContainer}>
                                    <Controller defaultValue='' name='sobrenome' control={control} render={({field: {onChange, value}}) => (
                                        <TextInput placeholder='Sobrenome' style={styles.field} onChangeText={value => onChange(value)} value={value}/> )}/>  
                                    {errors.sobrenome && <Text style={styles.errorMessage}>{errors.sobrenome.message}</Text>}
                                </View>
                                <View style={styles.fieldContainer}>
                                    <Controller defaultValue='' name='telefone' control={control} render={({field: {onChange, value}}) => (
                                        <TextInput placeholder='Telefone' style={styles.field} onChangeText={value => onChange(PhoneMask(value))} value={value} keyboardType='numeric'/> )}/>  
                                    {errors.telefone && <Text style={styles.errorMessage}>{errors.telefone.message}</Text>}
                                    
                                </View>
                                <View style={styles.fieldContainer}>
                                    <Controller defaultValue='' name='senha' control={control} render={({field: {onChange, value}}) => (
                                        <TextInput placeholder='Senha' style={styles.field} onChangeText={value => onChange(value)} value={value} secureTextEntry={true}/> )}/>  
                                    {errors.senha && <Text style={styles.errorMessage}>{errors.senha.message}</Text>}
                                    
                                </View>
                                <View style={styles.fieldContainer}>
                                    <Controller defaultValue='' name='repetirSenha' control={control} render={({field: {onChange, value}}) => (
                                        <TextInput placeholder='Repetir Senha' style={styles.field} onChangeText={value => onChange(value)} value={value} secureTextEntry={true}/> )}/>  
                                    {errors.repetirSenha && <Text style={styles.errorMessage}>{errors.repetirSenha.message}</Text>}
                                </View>
                                    
                                <View style={styles.fieldContainer}>
                                    <View style={styles.checkboxContainer}>
                                        <Controller defaultValue={false} name='termos' control={control} render={({field: {onChange, value}}) => (
                                            <Switch value={value} trackColor={{ false: "#767577", true: "#81b0ff" }} onValueChange={(value) => onChange(value)} /> )}/>    
                                            <Text style={styles.label} onPress={() => navigation.navigate('Termos de uso')}>Concordo com os termos de uso</Text>
                                    </View>
                                    {errors.termos && <Text style={styles.errorMessage}>{errors.termos.message}</Text>}
                                </View>
                                        
                                <View style={styles.buttonContainer}>
                                    <Button title='ENVIAR' color='#0371B6' onPress={handleSubmit(onSubmit)}/>
                                </View>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </FormContainer>

        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        padding: 50,
    },
    scrollView: {
        alignSelf: 'stretch',
        padding: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1077b8',
    },
    subtitle: {
        fontWeight: 'bold',
        color: '#1077b8',
    },
    fieldContainer: {
        alignSelf: 'stretch',
        flexDirection: 'column',
        marginBottom: 40,
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
    containerFields: {
        marginTop: 40,
        marginBottom: 30,
        alignSelf: 'stretch',
        flexDirection: 'column',
        alignItems: 'center',
    },
    checkboxContainer: {
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
      },
      label: {
        marginLeft: 18,
        color: '#1077b8',
        fontSize: 13,
        textDecorationLine: 'underline',
      },
      buttonContainer: {
          marginTop: 40,
      },
      datePicker: {
        borderBottomColor: '#1077b8',
        alignSelf: 'stretch',
      },
      datepickerLabel: {
        fontSize: 13,
        color: '#A9A9A9'
      }
})