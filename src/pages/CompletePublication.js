import React, {useState, useEffect} from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, ScrollView, ActivityIndicator } from 'react-native';
import MoreLessText from '../components/MoreLessText'
import { Ionicons } from '@expo/vector-icons'; 
import { participativoApi } from '../Api/Api'
import { getToken } from '../Service/auth'
import jwtDecode from 'jwt-decode'

export default function CompletePublication({route, navigation}) {

    const { publication } = route.params

    const [loading, setLoading] = useState(false)
    const [buttonDisabled, setButtonDisabled ] = useState(false)

    const colorPublicationType = {
        Elogio: 'green',
        Reclamação: 'red',
        Sugestão: 'orange'
    }


    async function createPublication() {
        setLoading(true)
        setButtonDisabled(true);
        let token = await getToken();
        
        const decode = jwtDecode(token);

        if(publication?.isEdit) {
            await editPublication(token);
            setLoading(false)
            setButtonDisabled(false);

            return
        }

        const usuario =  await participativoApi.get('usuarios/email', { headers: { Authorization: token }, params: { value: decode.sub }}, )

        let publicacao = { 
            bairroId: String(publication.endereco.bairro), 
            categoriaId: String(publication.categoria.id),
            cep: publication.endereco.cep,
            complemento: publication?.endereco?.complemento,
            descricao: publication.descricao,
            logradouro: publication.endereco.logradouro,
            numero: publication.endereco.numero,
            usuarioUuid: usuario.data.uuid };

        
           const createdPublicacao = await participativoApi.post('publicacoes', publicacao ,  { headers: { Authorization: token }});
        if(publication.foto) {
            
           await sendImage(createdPublicacao, token);
        } 
        
        setLoading(false)
        setButtonDisabled(false);

        navigation.navigate('Criar publicação', {added : true});

    }

    async function editPublication(token) {

        let publicacao = { 

            bairroId: String(publication.endereco.bairro), 
            cep: publication.endereco.cep,
            complemento: publication?.endereco?.complemento,
            descricao: publication.descricao,
            logradouro: publication.endereco.logradouro,
            numero: publication.endereco.numero };
        await participativoApi.put('publicacoes/' + publication.publication.uuid, publicacao ,  { headers: { Authorization: token }});

        if( !publication.base64 ) {

            await sendImage({ data: publication.publication.uuid }, token)

        }

        navigation.navigate('Home', {added : true});

    }

    async function sendImage(createdPublicacao, token) {

        let formData = new FormData();

        var photo = {
            uri: publication.foto,
            type: 'image/jpg',
            name: 'photo.jpg',
        }

        formData.append('file', photo)
        
        formData.append('publicacao', createdPublicacao.data)

        const headers = {
            'Accept': 'application/json',
            'Authorization': token,
            'Content-Type': 'multipart/form-data',
        }

        await participativoApi.post('upload/image', formData, { headers: headers})

    }

    function publicationType() {
        return(

            <View style={{...styles.publicationType, backgroundColor: colorPublicationType[publication.categoria.nome]}}>
                <Text style={styles.publicationTypeText}>{publication.categoria.nome}</Text>
            </View>

        )
    }


    return (
        <ScrollView >
        <View style={styles.container}>
            <View style={styles.publicationImageContainer}>
                <View style={styles.publicationTypeContainer}>
                    {publicationType()}
                </View>
                <Image source={ publication.base64 === false ? {uri: publication?.foto } : { uri: `data:image/jpeg;base64,${publication?.foto}` }} style={styles.publicationImage}></Image> 

                <TouchableOpacity style={styles.publicationAddressContainer} >
                    <View style={styles.publicationAddress}>
                        <Text style={styles.publicationAddressText}>{ publication.endereco?.complemento ? `${publication?.endereco?.logradouro} ${publication?.endereco?.numero} - ${publication?.endereco?.complemento}` : `${publication?.endereco?.logradouro} ${publication?.endereco?.numero}`}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            
            <MoreLessText numberOfLines={5}>
                    {publication.descricao}
            </MoreLessText>

            <View style={{ marginTop: 30, marginBottom: 40 }}>

                <TouchableOpacity style={styles.button} onPress={() => createPublication()} disabled={buttonDisabled}>
                    <Ionicons name="reload" size={24} color="white" />
                    <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 5 }}>{publication.isEdit ? 'EDITAR' : 'PUBLICAR'}</Text>
                </TouchableOpacity>

            </View>
            </View>
            {loading && (
                <View style={[styles.container, styles.horizontal]}>
                    <ActivityIndicator size="large" />
                </View>
            )}

        </ScrollView>


    )
}

const styles = StyleSheet.create({
    container: {
        padding: 8,
        position: 'absolute',

    },
    button: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        padding: 10,
        backgroundColor: 'green',
        marginTop: 120,
        width: 200,
        justifyContent: 'center'
    },
    publicationImageContainer: {
        alignSelf: 'stretch',
        marginBottom: 40
    },
    publicationImage: {
        height: 350,
        marginTop: 20,
        borderRadius: 3
    },
    publicationTypeContainer: {
        alignSelf: 'stretch',
        alignItems: 'center',
        position: 'relative',
        zIndex: 5,
    },
    publicationType: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        borderRadius: 500
    },
    publicationTypeText: {
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: 'white'
    },
    publicationAddressContainer : {
        alignSelf: 'stretch',
        alignItems: 'center',
        position: 'relative',
        zIndex: 5,
    },
    publicationAddress: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0371B6',
        padding: 15,
        borderRadius: 500,
        top: -30,
        width: 300
    },
    publicationAddressText: {
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: 'white',
        fontSize: 12
    },
    container: {
        flex: 1,
        alignItems: 'center', 
        justifyContent: 'center',
      },
})