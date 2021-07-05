import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 
import { participativoImagePublication, participativoAvatarFile, participativoApi } from '../Api/Api'
import { getToken } from '../Service/auth'
import { FontAwesome5 } from '@expo/vector-icons'; 

const colorPublicationType = {
    Elogio: 'green',
    Reclamação: 'red',
    Sugestão: 'orange'
}

export default function SearchResult({route, navigation}) {

    useEffect(() => {
        searchPublication();
    }, [])

    const { searchText } = route.params
    const [publications, setPublications] = useState([]);

    async function searchPublication() {

        let token = await getToken();
 
        let params = {
            descricao: searchText,
            categorias: '1,2,3'
        }
        setPublications([]);

        participativoApi.get('publicacoes/search', { params: params, headers: {Authorization: token} } ).then(result => {

            if(result.data.content.length === 0) return;

            result.data.content.map((publication) => {
                participativoApi.get('publicacoes/' + publication.uuid, { headers: {Authorization: token} } ).then(async result => {

                    result.data.publicationImage = await loadingPublicationPhoto(result.data.image)
                    result.data.userAvatar = await loadingUserPhoto(result.data.usuario.avatar)

                    setPublications(value => [...value, result.data]);
                })
            })

        })

    }

    async function loadingUserPhoto(avatar) {

        let token = await getToken();

        return avatar && participativoAvatarFile.get('' + avatar, {headers: {Authorization: token} , responseType: 'arraybuffer'}).then(result => {
            return Buffer.from(result.data, 'binary').toString('base64');
        })


    }

    async function loadingPublicationPhoto(publicationImage) {

        let token = await getToken();

        return publicationImage && participativoImagePublication.get('' + publicationImage, {headers: {Authorization: token} , responseType: 'arraybuffer'}).then(result => {
            return Buffer.from(result.data, 'binary').toString('base64');
        })

    }

    return (


        <ScrollView style={styles.container}>
                {publications.map(publication => (
                    <TouchableOpacity key={publication.uuid} onPress={() => navigation.navigate('Publicação', { publication: publication })}>
                        <View style={{...styles.publicationTypeContainer, backgroundColor: colorPublicationType[publication.categoria.nome]}}>
                            <View style={{...styles.publicationType, backgroundColor: colorPublicationType[publication.categoria.nome]}}>
                                    <Text style={{...styles.publicationTypeText}}>{publication.categoria.nome}</Text>
                            </View>
                        </View>
                        <View style={styles.cardContent}>
                            <View style={styles.cardInformation}>
                                <View style={styles.userAndPublicationInformation}>
                                    <View style={styles.photoFrame}>
                                    
                                    { 

                                        publication.userAvatar !== null ? (<Image source={{uri: `data:image/jpeg;base64,${publication.userAvatar}` }} style={styles.photo}  />) : <FontAwesome5 name="user-alt" size={35} color='black' /> 

                                    }


                                    </View>
                                    <View style={styles.nameUserAndDatePublication}>
                                        <Text style={styles.userName}>{publication.usuario.nome + ' ' + publication.usuario.sobrenome}</Text>
                                        <View style={styles.dateContainer}>
                                            <MaterialIcons name="date-range" size={14} color="black" />
                                            <Text style={styles.date}>Publicado em {publication.createdAt}</Text>
                                        </View>

                                    </View>
                                </View>
                                <Text numberOfLines={4} style={{fontSize: 12}}>{publication.descricao}</Text>
                            </View>
                            <Image style={styles.image} source={{uri: `data:image/jpeg;base64,${publication.publicationImage}`}}>

                            </Image>
                        </View>
                    </TouchableOpacity>
            
                ))}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    cardContent: {
        padding: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D3D3D3',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    cardInformation: {
        display: 'flex',
        flexDirection: 'column',
        width: 240
    },
    publicationTypeContainer: {
        alignSelf: 'stretch',
        alignItems: 'center',
        position: 'relative',
        zIndex: 5,
        marginTop: 40
    },
    publicationType: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        borderRadius: 500,
        top: -25,
        backgroundColor: '#D3D3D3'
    },
    publicationTypeText: {
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: 'white',
        fontSize: 10
    },
    userAndPublicationInformation: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 4
    },
    image: {
        alignSelf: 'stretch',
        backgroundColor: 'black',
        height: 135,
        width: 100,
        borderRadius: 5
    },
    nameUserAndDatePublication: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginLeft: 10
    },
    userName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0371B6'
    },
    date: {
        fontSize: 10,
        color: '#D3D3D3',
        marginLeft: 5
    },
    dateContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    photoFrame: {
        height: 50,
        width: 50,
        borderRadius: 50 / 2,
        borderWidth: 1,
        borderColor: '#0371B6',
        padding: 3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    photo: {
        height: 50,
        width: 50,
        borderRadius: 50 / 2,
    },
})