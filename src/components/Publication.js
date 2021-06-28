import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text, TouchableOpacity , Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons'; 
import MoreLessText from '../components/MoreLessText'
import { FontAwesome5 } from '@expo/vector-icons'; 
import { Feather } from '@expo/vector-icons'; 
import { participativoImagePublication, participativoAvatarFile, participativoApi } from '../Api/Api'
import { getToken } from '../Service/auth'
import jwtDecode from 'jwt-decode'

global.Buffer = global.Buffer || require('buffer').Buffer

export default function Publication({publication, navigation}) {

    const [publicationImage, setPublicationImage] = useState(null);
    const [userImage, setUserImage] = useState(null);
    const [apoios, setApoios] = useState(publication.apoios);
    const [userLogged, setUserLogged] = useState(null);

    useEffect(() => {
        userLoggedDecode().then();
        orderStatus();
        loadingPublicationPhoto();
        loadingUserPhoto(),
        () => {setPublicationStatus(null)}
    }, [])

    const colorPublicationType = {
        Elogio: 'green',
        Reclamação: 'red',
        Sugestão: 'orange'
    }

    const colorPublicationStatus = {
        CONCLUÍDO: '#4C7A34',
        EXECUÇÃO: '#EFCA16',
        ENCAMINHADO: '#EFCA16',
        ANALISE: '#ECA303',
        PROTOCOLADO: '#F36000',
        RECEBIDO: '#CA251F',
    }

    const [publicationStatus, setPublicationStatus] = useState(null);

    function orderStatus() {
        publication.statuses.length > 1 && publication.statuses.sort(function(a, b) {

          var timeA = a.createdAt.split(' ')[1]
          var timeB = b.createdAt.split(' ')[1]
          var dateA = a.createdAt.split(' ')[0];
          var dateB = b.createdAt.split(' ')[0];
          var dateASplited = dateA.split('/')
          var dateBSplited = dateB.split('/')
          var dateTranformedA = new Date(dateASplited[1] + '/' + dateASplited[0] + '/' + dateASplited[2] +' '+timeA);
          var dateTranformedB = new Date(dateBSplited[1] + '/' + dateBSplited[0] + '/' + dateBSplited[2] +' '+timeB);
          return dateTranformedA > dateTranformedB;
          
        });

    }

    async function userLoggedDecode() {

        let token = await getToken();

        const decode = jwtDecode(token);

        setUserLogged(decode.sub);

    }

    function publicationType() {
        return(

            <View style={{...styles.publicationType, backgroundColor: colorPublicationType[publication.categoria.nome]}}>
                <Text style={styles.publicationTypeText}>{publication.categoria.nome}</Text>
            </View>

        )
    }

    async function loadingPublicationPhoto() {

        let token = await getToken();

        return publication.image && participativoImagePublication.get('' + publication.image, {headers: {Authorization: token} , responseType: 'arraybuffer'}).then(result => {
            setPublicationImage(Buffer.from(result.data, 'binary').toString('base64'));
        })
    }

    async function loadingUserPhoto() {

        let token = await getToken();

        return publication.usuario.avatar && participativoAvatarFile.get('' + publication.usuario.avatar, {headers: {Authorization: token} , responseType: 'arraybuffer'}).then(result => {
            setUserImage(Buffer.from(result.data, 'binary').toString('base64'));
        })
    }

    async function likeOrNotLike() {

        if(apoios.length === 0) { 

            setApoios((apoio) => [...apoio, { usuario: { email: decode.sub } }]);

            await sendLikeOrNotLike('apoiar');

            return; 
        }
        
        let publicacaoApoiada = apoios.filter(apoio => apoio.usuario.email === userLogged);

        if(publicacaoApoiada.length === 0) { 

            setApoios((apoio) => [...apoio, { usuario: { email: userLogged } }]);

            await sendLikeOrNotLike('apoiar'); 

            return; 

        }

        publicacaoApoiada = apoios.filter(apoio => apoio.usuario.email !== userLogged);

        setApoios(publicacaoApoiada);

        await sendLikeOrNotLike('desapoiar')

    }

    async function sendLikeOrNotLike(apoiarOuDesapoiar) {

        const user = (await findUserLogged()).data;

        let token = await getToken();

        if( apoiarOuDesapoiar ===  'apoiar' ) {

            await participativoApi.post('apoios/' + user.uuid + '/' + publication.uuid , {} ,{ headers: { Authorization: token } } )
            return 
        }

        await participativoApi.delete('apoios/' + user.uuid + '/' + publication.uuid , { headers: { Authorization: token } } )
        return 

    }

    async function findUserLogged() {

        let token = await getToken();

        const decode = jwtDecode(token);

        return await participativoApi.get('usuarios/email', { headers: { Authorization: token }, params: { value: decode.sub }}, )

    }

    function isLiked() {

        let publicacaoApoiada = apoios.filter(apoio => apoio.usuario.email === userLogged);

        const text = publicacaoApoiada.length > 0 ? 'Apoiado' :  'Apoiar';

        return (<Text style={styles.iconButtonText}>{text}</Text>);


    }

    return (
        
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.photoAndpublicationInformationContainer}>
                    <View style={styles.photoFrame}>

                        { userImage !== null ? (<Image source={{uri: `data:image/jpeg;base64,${userImage}` }} style={styles.photo}  />) : <FontAwesome5 name="user-alt" size={35} color='black' /> }
                    
                    </View>
                    <View style={styles.publicationInformationContainer}>
                        <Text style={styles.publicationUserName}>{publication.usuario.nome + ' ' + publication.usuario.sobrenome}</Text>
                        <View style={styles.publicationDate}>
                            <MaterialIcons name="date-range" size={14} color="black" />
                            <Text style={styles.publicationDateText}>Publicado em {publication.createdAt}</Text>
                        </View>
                    </View>
                </View>
                <Entypo name="dots-three-vertical" size={20} color="black" />
            </View>
            <View style={styles.publicationImageContainer}>
                <View style={styles.publicationTypeContainer}>
                    {publicationType()}
                </View>
                <Image source={{uri: `data:image/jpeg;base64,${publicationImage}` }} style={styles.publicationImage}></Image>

                <TouchableOpacity style={styles.publicationAddressContainer} onPress={() => navigation.navigate('Localização', {endereco: publication.endereco})}>
                    <View style={styles.publicationAddress}>
                        <Text style={styles.publicationAddressText}>{ publication.endereco.complemento ? `${publication.endereco.logradouro} ${publication.endereco.numero} - ${publication.endereco.complemento}` : `${publication.endereco.logradouro} ${publication.endereco.numero}`}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.commentTextContainer}>
                <MoreLessText numberOfLines={5}>
                    {publication.descricao}
                </MoreLessText>
            </View>
            <View style={styles.publicationCommentsAndLikeContainer}>
                <Text style={styles.commentAndLike}>{apoios.length} pessoas apoiam está publicação</Text>
                <Text style={styles.commentAndLike}>{publication.comentarios.length} comentários</Text>
            </View>
            <View style={styles.actionsButtonContainer}> 
                <TouchableOpacity style={styles.iconButtonContainer} onPress={async () => await likeOrNotLike() }>
                    <FontAwesome5 name="smile" size={24} color="red" />
                    { isLiked() }
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButtonContainer} onPress={() => navigation.navigate('Comentários', { comments: publication.comentarios, publicationUuid: publication.uuid })}>
                    <MaterialIcons name="message" size={24} color="#0371B6" />
                    <Text style={styles.iconButtonText}>Comentar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Histórico de Status', {status: publication.statuses })} style={{...styles.publicationStatusContainer, backgroundColor: colorPublicationStatus[publication.statuses[0].tipo]}}>
                    <Feather name="calendar" size={24} color="white" />
                    <Text style={{color: 'white', fontSize: 10, marginLeft: 7}}>{publication.statuses[0].createdAt.split(' ')[0]}</Text>
                    <Text style={{color: 'white', fontWeight: 'bold', textTransform: 'uppercase', fontSize: 10,  marginLeft: 7 }}>{publication.statuses[0].tipo}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        marginTop: 20,
        marginBottom: 20
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'stretch'
    },
    photoFrame: {
        height: 60,
        width: 60,
        borderRadius: 60 / 2,
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
    publicationDate: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    publicationUserName: {
        fontSize: 14,
        fontWeight: 'bold'
    },
    publicationDateText: {
        fontSize: 10,
        marginLeft: 5
    },
    publicationInformationContainer: {
        marginLeft: 5
    },
    photoAndpublicationInformationContainer: {
        flexDirection: 'row',
        alignItems: 'center'
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
    commentTextContainer: {
        justifyContent: 'flex-start'
    },
    publicationCommentsAndLikeContainer: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        justifyContent: 'space-between',
        marginTop: 20
    },
    commentAndLike: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#0371B6'
    },
    actionsButtonContainer: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        justifyContent: 'space-around',
        marginTop: 20
    },
    iconButtonContainer:{
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    iconButtonText: {
        fontWeight: 'bold',
        marginLeft: 3
    },
    publicationStatusContainer: {
        borderRadius: 500,
        padding: 5,
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 7
    },
})