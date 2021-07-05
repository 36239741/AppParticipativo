import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, Image, TouchableOpacity, FlatList } from 'react-native';
import { participativoApi, participativoImagePublication, participativoAvatarFile } from '../Api/Api'
import { getToken } from '../Service/auth'
import jwtDecode from 'jwt-decode'
import { FontAwesome5 } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 
import { useIsFocused } from '@react-navigation/native';



export default function Notification({ navigation }) {
    
    const isFocused = useIsFocused();

    const [userLogged, setUserLogged] = useState(null);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        userLoggedDecode();
    }, [isFocused])

    async function userLoggedDecode() {

        let token = await getToken();

        const decode = jwtDecode(token);
        
        let param = {
            'value': decode.sub
          }

        const user = await participativoApi.get('usuarios/email', { params: param, headers: { Authorization: token }} );

        setUserLogged(user.data)

        findNotifications(user.data.uuid, token);
    }

    async function findNotifications(uuid, token) {

        const notificacao = await participativoApi.get('notificacoes/list/' + uuid , { headers: { Authorization: token }});

        if(notificacao.data.length === 0) return;
        setNotifications([])
        notificacao.data.forEach(async (value) => {
            await loadingPublicationPhoto(value, token);
            await loadingUserPhoto(value, token);
            setNotifications(notifcations => [...notifcations, value]);
        })

    }   

    async function loadingPublicationPhoto(notificacao, token) {

        const publicacao = await participativoApi.get('publicacoes/' + notificacao.publicacao, {headers: {Authorization: token}});

        return publicacao.data.image && participativoImagePublication.get('' + publicacao.data.image, {headers: {Authorization: token} , responseType: 'arraybuffer'}).then(result => {
            publicacao.data.image64 = Buffer.from(result.data, 'binary').toString('base64');
            notificacao.publicacao = publicacao.data;
        })
    }

    async function loadingUserPhoto(notificacao, token) {

        return notificacao.gerador.avatar && participativoAvatarFile.get('' + notificacao.gerador.avatar , {headers: {Authorization: token} , responseType: 'arraybuffer'}).then(result => {
            notificacao.gerador.avatar = Buffer.from(result.data, 'binary').toString('base64');
        })
    }

    function getComentario(notificacao) {
        const comentario = {
            'COMENTARIO' : (notificacao) => { return ( <Text>{notificacao.gerador.nome} <Text style={{fontWeight: 'bold'}}>COMENTOU</Text> sua publicação</Text> ) },
            'APOIO' : (notificacao) => { return ( <Text>{notificacao.gerador.nome} <Text style={{fontWeight: 'bold'}}>APOIOU</Text> sua publicação</Text> ) }
        }

        const funcao = comentario[notificacao.tipo];

        if(funcao === null) return;

        const component = funcao(notificacao);

        if(component == null) return;
        
        return component;
        
    }

    return (
        <ScrollView >
            <View style={styles.container}>
            {notifications.length > 0 && notifications.map(notification => (
                    <TouchableOpacity key={notification.uuid} onPress={() => navigation.navigate('Publicação', { publication: notification.publicacao })}>
                        <View style={styles.cardContent}>
                            <View style={styles.cardInformation}>
                                <View style={styles.userAndPublicationInformation}>
                                    <View style={styles.photoFrame}>
                                    
                                    { 

                                        notification.gerador.avatar !== null ? (<Image source={{uri: `data:image/jpeg;base64,${notification.gerador.avatar}` }} style={styles.photo}  />) : <FontAwesome5 name="user-alt" size={35} color='black' /> 

                                    }


                                    </View>
                                    <View style={styles.nameUserAndDatePublication}>
                                        {getComentario(notification)}
                                        <View style={styles.dateContainer}>
                                            <MaterialIcons name="date-range" size={14} color="black" />
                                            <Text style={styles.date}>Publicado em {notification.createdAt}</Text>
                                        </View>

                                    </View>
                                </View>
                                
                            </View>
                            <Image style={styles.image} source={{uri: `data:image/jpeg;base64,${notification.publicacao.image64}`}}>

                            </Image>
                        </View>
                    </TouchableOpacity>
            
                ))}
            </View>
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        padding: 8
    },
    notificationContainer: {
        padding: 12,
        borderRadius: 8,
        alignSelf: 'stretch'
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
        marginBottom: 20,
        alignItems: 'center'
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
        marginTop: 10
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
        alignItems: 'center',
        marginTop: 5
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