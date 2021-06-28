import React, {useState, useEffect} from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, ScrollView } from 'react-native';
import MoreLessText from '../components/MoreLessText'
import { Ionicons } from '@expo/vector-icons'; 
import { participativoApi } from '../Api/Api'
import { getToken } from '../Service/auth'
import jwtDecode from 'jwt-decode'
import Base64 from 'Base64';

export default function CompletePublication({route, navigation}) {

    const { publication } = route.params

    const colorPublicationType = {
        Elogio: 'green',
        Reclamação: 'red',
        Sugestão: 'orange'
    }


    async function createPublication() {

        let token = await getToken();
        
        const decode = jwtDecode(token);

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
        
        let formData = new FormData();

        const base64Data = publication.foto;
        
        const url = 'data:image/png;'+base64Data+'';
        fetch(url)
          .then(res => res.blob())
          .then( async  blob => {
            const file = new File([blob], "File name",{ type: "image/png" })
            formData.append('file', file)
            formData.append('publicacao', createdPublicacao.data.uuid)
    
            await participativoApi.post('upload/image', formData, { headers: { Authorization: token }})
    
            navigation.navigate('Home');
          })






    }

    
    function b64toBlob(dataURI) {
    
        var byteString = Base64.atob(dataURI);

        return new Blob([byteString], { type: 'image/png' });
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
                <Image source={{uri: `data:image/jpeg;base64,${publication?.foto}` }} style={styles.publicationImage}></Image>

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

                <TouchableOpacity style={styles.button} onPress={() => createPublication()}>
                    <Ionicons name="reload" size={24} color="white" />
                    <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 5 }}>PUBLICAR</Text>
                </TouchableOpacity>

            </View>
            </View>
        </ScrollView>


    )
}

const styles = StyleSheet.create({
    container: {
        padding: 8,
        display: 'flex',
        alignItems: 'center'

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
})