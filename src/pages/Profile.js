import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Button, ScrollView } from 'react-native';
import { onSignOut } from '../Service/auth'
import LoadingPhoto from '../components/LoadingPhoto'
import { getToken } from '../Service/auth'
import jwtDecode from 'jwt-decode'
import { participativoApi, participativoAvatarFile } from '../Api/Api'
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CpfMask from '../Util/CpfMask';
import PhoneMask from '../Util/PhoneMask';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 
import { Foundation } from '@expo/vector-icons'; 
import { Snackbar } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import DatePicker from '../components/DateTimePicker'

const minumumAge = 13;
export default function Profile({navigation, route}) {

    const isFocused = useIsFocused();

    const [userPhoto, setUserPhoto] = useState(null);
    const [userLogged, setUserLogged] = useState(null);
    const [isFormEdit, setIsFormEdit] = useState(false);
    const [isEditPassword, setIsEditPassword] = useState(false);
    const [snack, setSnackBar] = useState(false);
    const [snackText, setSnackBarText] = useState('');


    useEffect(() => {
        userLoggedDecode();
    }, [])

    var schema = Yup.object().shape({
        dataNascimento: Yup.date().required('Campo obrigatório').test('ageValidate', 'Proibido o cadastro de menores de 13 anos', value => ageValidator(value)),
        email: Yup.string().email('E-mail inválido').required('Campo obrigatório'),
        nome: Yup.string().required('Campo obrigatório'),
        sobrenome: Yup.string().required('Campo obrigatório'),
        telefone: Yup.string().required('Campo obrigatório'),
      });

    const { handleSubmit, control, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema)
    });

    var schema2 = Yup.object().shape({
        senha: Yup.string().required('Campo obrigatório'),
        repetirSenha: Yup.string().required('Campo obrigatório').oneOf([Yup.ref('senha'), null], 'Senha diferente da digitada anteriormente'),
    });

    const { handleSubmit: handleSubmit2, control: control2, formState: { errors: errors2 }, setValue : setValue2 } = useForm({
        resolver: yupResolver(schema2)
    });

    async function userLoggedDecode() {

        let token = await getToken();

        const decode = jwtDecode(token);
        
        let param = {
            'value': decode.sub
          }

        const user = await participativoApi.get('usuarios/email', { params: param, headers: { Authorization: token }} );

        setUserLogged(user.data);
        var dateBSplited = user.data.dataNascimento.split('/')
        var dateTranformedA = new Date(dateBSplited[1] + '/' + dateBSplited[0] + '/' + dateBSplited[2]);

        setValue('dataNascimento', dateTranformedA);
        setValue('email', user.data.email);
        setValue('nome', user.data.nome);
        setValue('sobrenome', user.data.sobrenome);
        setValue('telefone', PhoneMask(user.data.telefone));

        await loadingUserPhoto(user.data, token);
    }

    async function loadingUserPhoto(user, token) {

        return user.avatar && participativoAvatarFile.get('' + user.avatar , {headers: {Authorization: token} , responseType: 'arraybuffer'}).then(result => {
            user.avatar = Buffer.from(result.data, 'binary').toString('base64');
            setUserPhoto(user.avatar);
        })
    }

    async function uploadPhoto(photoUpload) {

        setUserPhoto(photoUpload);

        let formData = new FormData();

        var photo = {
            uri: photoUpload.uri,
            type: 'image/jpg',
            name: 'photo.jpg',
        };
        
        formData.append('file', photo);

        let token = await getToken();

        const headers = {
            'Accept': 'application/json',
            'Authorization': token,
            'Content-Type': 'multipart/form-data',
        }

        await participativoApi.post('upload/avatar', formData, { headers: headers })

    }

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

    async function edit (data) {

        setIsEditPassword(false);
        setValue2('senha', '');
        setValue2('repetirSenha', '');

        let token = await getToken();
        setSnackBarText('Senha alterada com sucesso!.');
        setSnackBar(true);

        participativoApi.post('auth/trocarsenha', { senha: data.senha }, { headers: { Authorization: token } })

    };

    function dataAtualFormatada(data){

        var dia  = data.getDate().toString()
        var diaF = (dia.length == 1) ? '0'+dia : dia
        var mes  = (data.getMonth()+1).toString() //+1 pois no getMonth Janeiro começa com zero.
        var mesF = (mes.length == 1) ? '0'+mes : mes
        var anoF = data.getFullYear()
    
    return mesF+"/"+diaF+"/"+anoF;
    }

    async function salvar (data) {
        
       let token = await getToken();
       const d = new Date(data.dataNascimento)
       
       data.dataNascimento = dataAtualFormatada(d)
       await participativoApi.put('usuarios/' + userLogged.uuid, data, { headers: { Authorization: token } })

       setValue2('dataNascimento', data.dataNascimento);
       setValue2('email', data.email);
       setValue2('nome', data.nome);
       setValue2('sobrenome', data.sobrenome);
       setValue2('telefone', data.telefone)
       await userLoggedDecode();
       setSnackBarText('Usuário alterado com sucesso!.');
       setSnackBar(true);
       setIsFormEdit(false);

    };

    async function deleteProfile() {

        let token = await getToken();

        await participativoApi.put('usuarios/deleteLogico/' + userLogged.uuid, {} , { headers: { Authorization: token } })

        await logout()

    }

    async function logout() {
        await onSignOut();
        navigation.navigate('Login');
    }
 

    return (

        <ScrollView>

         {userLogged && (<View style={styles.container}>

            <LoadingPhoto setPhoto={uploadPhoto} photo={userPhoto} base64={true}/>
            <Text style={{ fontSize: 24, marginBottom: 40 }}>{userLogged.nome} {userLogged.sobrenome}</Text>

            {!isFormEdit && !isEditPassword && (<View style={{ display: 'flex', flexDirection: 'column', alignSelf: 'stretch', alignItems: 'flex-start', marginLeft: 20 }}>

            <View style={{ display:'flex', flexDirection:'row' }}>

                    <MaterialIcons name="email" size={24} color="black" />
                    <Text style={{ fontSize: 18, marginLeft: 10 }}>{userLogged.email}</Text>
                </View>
                <View style={{ display:'flex', flexDirection:'row' }}>
                    <AntDesign name="calendar" size={24} color="black" />
                    <Text style={{ fontSize: 18, marginLeft: 10 }}>{userLogged.dataNascimento}</Text>
                </View>
                <View style={{ display:'flex', flexDirection:'row' }}>
                    <AntDesign name="contacts" size={24} color="black" />
                    <Text style={{ fontSize: 18, marginLeft: 10 }}>{CpfMask(userLogged.cpf)}</Text>
                </View>
                <View style={{ display:'flex', flexDirection:'row' }}>
                    <Foundation name="telephone" size={24} color="black" />
                    <Text style={{ fontSize: 18, marginLeft: 10 }}>{PhoneMask(userLogged.telefone)}</Text>
                </View>
            </View>)}

            {isEditPassword && (<View style={{ padding: 12, alignSelf: 'stretch' }}>
                <View style={styles.fieldContainer}>
                    <Controller defaultValue='' name='senha' control={control2} render={({field: {onChange, value}}) => (
                        <TextInput placeholder='Senha' style={styles.field} onChangeText={value => onChange(value)} value={value} secureTextEntry={true}/> )}/>  
                    {errors2.senha && <Text style={styles.errorMessage}>{errors2.senha.message}</Text>}           
                </View>
                <View style={{...styles.fieldContainer, marginBottom: 250}}>
                    <Controller defaultValue='' name='repetirSenha' control={control2} render={({field: {onChange, value}}) => (
                        <TextInput placeholder='Repetir Senha' style={styles.field} onChangeText={value => onChange(value)} value={value} secureTextEntry={true}/> )}/>  
                    {errors2.repetirSenha && <Text style={styles.errorMessage}>{errors2.repetirSenha.message}</Text>}
                </View>

                <Button title='SALVAR' onPress={ handleSubmit2( edit ) } />
                <Button title='CANCELAR' onPress={() => { 
                    setIsEditPassword(false)
                    setValue2('senha', '')
                    setValue2('repetirSenha', '')}} />
            </View>)}

            {isFormEdit && (
                <View style={styles.photo}>

                    <View style={styles.containerFields}>
                                <View style={styles.fieldContainer}>
                                        <Text style={styles.datepickerLabel}>Data de Nascimento</Text>
                                        <Controller defaultValue={new Date()} name='dataNascimento' control={control} render={({field: {onChange, value}}) => (
                                            <DatePicker date={ value } onChange={ onChange }/> )}/>
                                    {errors.dataNascimento && <Text style={styles.errorMessage}>{errors.dataNascimento.message}</Text>}
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
                            </View>
                            <Button title='SALVAR' onPress={ handleSubmit( salvar )} />
                            <Button title='CANCELAR' onPress={() => {setIsFormEdit(false)}} />

                </View>)}
                <View style={{ marginTop: 200 }}>
                    {!isFormEdit && !isEditPassword && (<Button title='EDITAR' onPress={() => {setIsFormEdit(true)}} />)}

                    {!isFormEdit && !isEditPassword && (<Button title='TROCAR SENHA' onPress={() => {
                        setIsEditPassword(true);
                        }} />)}

                    {!isFormEdit && !isEditPassword && (<Button title='DELETAR PERFIL' onPress={deleteProfile}/>)}
                    
                    {!isFormEdit && !isEditPassword && (<Button title='SAIR' onPress={logout} />)}
                </View>


            </View>)}

            <Snackbar
              visible={snack}
              onDismiss={() => setSnackBar(false)}
              action={{
                color: 'black',
                label: 'Fechar',
                onPress: () => setSnackBar(false) }}
              style={{backgroundColor: "#C3C3C3"}}>
              <View><Text>{snackText}</Text></View>
            </Snackbar>

        </ScrollView>

    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 60,
        display: 'flex', 
        justifyContent:  'center', 
        alignItems: 'center', 
        flex: 1 
    },
    photo: {
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'stretch'
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

})