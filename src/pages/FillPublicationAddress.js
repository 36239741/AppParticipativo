import React, {useState, useEffect} from 'react';
import { StyleSheet, View, TextInput , Button, ScrollView, TouchableOpacity, Text } from 'react-native';
import FormContainer from '../components/FormContainer'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import * as Location from 'expo-location';
import axios from 'axios'
import env from '../Config/variables'
import { participativoApi } from '../Api/Api'
import { getToken } from '../Service/auth'
import { Picker } from '@react-native-picker/picker';

export default function FillPublicationAddress({route, navigation}) {

    const { publicacao } = route.params

    const [bairros, setBairros] =  useState([]);

    useEffect(() => {
        getBairro()
    }, [])

    let endereco = {
        cep: '',
        bairro: '',
        logradouro: '',
        numero: 0,
        complemento: ''
    }


    var schema = yup.object().shape({
        cep: yup.string().required('Campo obrigatório'),
        bairro: yup.string().required('Campo obrigatório'),
        logradouro: yup.string().required('Campo obrigatório'),
        numero: yup.number('Campo do tipo numérico').required('Campo obrigatório'),
        complemento: yup.string(),
      });

    const { handleSubmit, control, formState: { errors }, setValue, getValues } = useForm({
        resolver: yupResolver(schema)
    });

    async function getLocationByGPS() {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({});

        getAddress(location)
    }

    function getAddress(location) {
        console.log(location.coords)
        axios.get(`https://us1.locationiq.com/v1/reverse.php?key=${env.locationIQKey}&lat=${location.coords.latitude}&lon=${location.coords.longitude}&&format=json`)
            .then(address => {

                if(address.data.length === 0) return;

                const {hamlet, road, postcode} = address.data.address

                setValue('cep', postcode);
                setValue('bairro', hamlet);
                setValue('logradouro', road);

            })
    }

    async function getAddressByCep() {

        const cep = getValues('cep');

        console.log(cep)

        if(!cep) return;

        const searchedCep = await axios.get('https://viacep.com.br/ws/'+cep+'/json/');

        if(searchedCep.data.error) return;
        
        setValue('bairro', searchedCep.data.bairro);
        setValue('logradouro', searchedCep.data.logradouro);
        setValue('complemento', searchedCep.data.complemento);


    }

    async function getBairro() {

        const token = await getToken();

        const data = (await participativoApi.get('bairros/1', { headers: {Authorization: token}})).data

        setBairros(data)

    }

    function formatCep(cep) {
        return cep.replace(/[^0-9]/g,'');
    }

    const onSubmit = (data) => {
        data.bairro = getBairroId();
        publicacao.endereco = data
        console.log(data)
        navigation.navigate('Concluir publicação', { publication: publicacao  })
    };

    function getBairroId() {
        const bairroSelecionado = getValues('bairro');
        const bairroEncontrado = bairros.filter(bairro => bairro.nome === bairroSelecionado);
        return bairroEncontrado[0].id
    }

    return (
        <FormContainer>
            <ScrollView style={{ padding: 16 }}>
                <View style={{ marginTop: 40, marginBottom: 40 }}>
                    <TouchableOpacity style={styles.button} onPress={getLocationByGPS}>
                        <MaterialCommunityIcons name="map-marker-outline" size={32} color="white" />
                        <Text style={{ fontSize: 16, color: 'white', fontWeight: 'bold', marginLeft: 8 }}>PEGAR LOCALIZAÇÃO DO GPS</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.fieldContainer}>
                        <Controller defaultValue={endereco.cep} name='cep' control={control} render={({ field:{ onChange, value } }) => (
                            <View>
                                <Ionicons onPress={() => getAddressByCep()} name="reload" size={24} color="#0371B6" style={{ position: 'absolute', right: 9, top: -15 }}/>
                                <TextInput 
                                    value={formatCep(value)}
                                    onChangeText={value => onChange(value)}
                                    placeholder='Você sabe qual é o CEP?'
                                    keyboardType="numeric"
                                    maxLength={8}
                                    style={styles.field}/>
                                </View> )}/>
                        {errors.cep && <Text style={styles.errorMessage}>{errors.cep.message}</Text>}
                </View>

                <View style={styles.fieldContainer}>
                        <Controller defaultValue={endereco.bairro} name='bairro' control={control} render={({ field:{ onChange, value } }) => (
                            <Picker
                                selectedValue={value}
                                onValueChange={(itemValue, itemIndex) =>
                                onChange(itemValue)
                                }>
                        { bairros.map(bairro => (
                            <Picker.Item key={bairro.id} label={bairro.nome} value={bairro.nome} />
                        )) }
                    </Picker> )}/>
                        {errors.bairro && <Text style={styles.errorMessage}>{errors.bairro.message}</Text>}
                </View>

                <View style={styles.fieldContainer}>
                        <Controller defaultValue={endereco.logradouror} name='logradouro' control={control} render={({ field:{ onChange, value } }) => (
                            <TextInput 
                            value={value}
                            onChangeText={value => onChange(value)}
                            placeholder='Qual é a rua?'
                            style={styles.field}/> )}/>
                        {errors.logradouro && <Text style={styles.errorMessage}>{errors.logradouro.message}</Text>}
                </View>

                <View style={styles.fieldContainer}>
                        <Controller defaultValue='' name='numero' control={control} render={({ field:{ onChange, value } }) => (
                            <TextInput 
                            value={value}
                            onChangeText={value => onChange(value)}
                            placeholder='Qual é o número?'
                            style={styles.field}
                            keyboardType='numeric'
                            /> )}/>
                        {errors.numero && <Text style={styles.errorMessage}>{errors.numero.message}</Text>}
                </View>

                <View style={styles.fieldContainer}>
                        <Controller defaultValue='' name='complemento' control={control} render={({ field:{ onChange, value } }) => (
                            <TextInput 
                            value={value}
                            onChangeText={value => onChange(value)}
                            placeholder='Tem algum ponto de referência?'
                            style={styles.field}/> )}/>
                        {errors.complemento && <Text style={styles.errorMessage}>{errors.complemento.message}</Text>}
                </View>
                <View style={{ marginTop: 30, marginBottom: 40 }}>

                    <Button title='AVANÇAR' color='#0371B6' onPress={handleSubmit(onSubmit)}/>

                </View>

            </ScrollView>
        </FormContainer>
    )
}

const styles = StyleSheet.create({
    fieldContainer: {
        alignSelf: 'stretch',
        flexDirection: 'column',
        marginBottom: 40,
    },
    errorMessage :{
        fontSize: 13,
        color: 'red',
        marginTop: 5,
        textAlign: 'center'
    },
    field: {
        borderBottomColor: '#0371B6',
        borderBottomWidth: 1,
        alignSelf: 'stretch',
    },
    button: { 
        display: 'flex', 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0371B6',
        borderRadius: 7,
        padding: 10,
        marginBottom: 20
    }
})