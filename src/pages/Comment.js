import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, Image, Dimensions, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons'; 
import { getToken } from '../Service/auth'
import { participativoAvatarFile, participativoApi } from '../Api/Api'
import jwtDecode from 'jwt-decode'
import { FontAwesome5 } from '@expo/vector-icons'; 
import Menu from '../components/MenuComponent'


export default function Comment ({route, navigation}) {

    const { comments, userImage, publicationUuid, user } = route.params;
    const [commentAndImages, setCommentAndImages] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [userPhoto, setUserPhoto] = useState(null);

    useEffect(() => {
        orderStatus();
    },[])

    async function orderStatus() {
        comments.length > 1 && comments.sort(function(a, b) {

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

        await findUserLogged();

    }

    function toISOFormat(dateTimeString) {
        // Primeiro, dividimos a data completa em duas partes:
        const [date, time] = dateTimeString.split(' ');
      
        // Dividimos a data em dia, mês e ano:
        const [DD, MM, YYYY] = date.split('/');
      
        // Dividimos o tempo em hora e minutos:
        const [HH, mm] = time.split(':');
      
        // Retornamos a data formatada em um padrão compatível com ISO:
        return `${YYYY}-${MM}-${DD}T${HH}:${mm}`;
      }

    async function findUserLogged() {

        let token = await getToken();

        const decode = jwtDecode(token);

        const response = await participativoApi.get('usuarios/email', { headers: { Authorization: token }, params: { value: decode.sub }}, )

        searchUserPhoto( response.data).then(async result => {
            setUserPhoto(result);
            await loadingUserPhoto();
        })

    }

    async function comment() {

        if(commentText.length === 0) return;

        let token = await getToken();

        const decode = jwtDecode(token);

        const user = await participativoApi.get('usuarios/email', { headers: { Authorization: token }, params: { value: decode.sub }}, )

        const response = await participativoApi.post('comentarios', {corpo: commentText, publicacao: publicationUuid, usuario: user.data.uuid},   { headers: { Authorization: token }} )

        const date = new Date();

        setCommentAndImages((values) => [...values, {comment: {corpo: commentText, createdAt: date.toLocaleDateString() + ' ' + date.toLocaleTimeString()}, photo: userPhoto}])

        setCommentText('');
    }

    async function loadingUserPhoto() {

        if(comments.length === 0) return;

        comments.forEach(async comment => {
            const result = await searchUserPhoto(comment.usuario)
            setCommentAndImages((values) => [...values, { comment: comment, photo: result }])
        })

        let images = commentAndImages;
        images.reverse();
        setCommentAndImages(images);

    }

    async function searchUserPhoto(user) {

        if(!user.avatar) return;

        let token = await getToken();

        const response = await participativoAvatarFile.get('' +  user.avatar, {headers: {Authorization: token} , responseType: 'arraybuffer'})

        return Buffer.from(response.data, 'binary').toString('base64'); 
    }

    async function deleteComment(uuid) {

        let removedComment = commentAndImages

        const removedComments = removedComment.filter(comment => comment.comment.uuid !== uuid  )

        setCommentAndImages(removedComments)

        let token = await getToken();

        await participativoApi.delete('comentarios/' + uuid, {headers: {Authorization: token}} );

    }

    const Item = ({ item, index }) => (
        <Menu commentIndex={index} comment={item} user={user} deleteComment={deleteComment} key={index} />

      );

    return(
        <>
            <View style={styles.container}>
                { typeof userPhoto !== 'undefined' ? (<Image source={{uri: `data:image/jpeg;base64,${userPhoto}` }} style={styles.photo}  />) : <FontAwesome5 name="user-alt" size={32} color='black' /> }
                <View style={styles.inputContainer}>
                    <TextInput style={styles.field} value={commentText} onChangeText={setCommentText}/>
                    <Feather name="arrow-right" size={24} color="black" style={styles.inputIcon} onPress={() => comment()}/>
                </View>
            </View>
            <View>

                <FlatList
                    data={commentAndImages}
                    extraData={commentAndImages}
                    keyExtractor={item => item.comment.uuid}
                    renderItem={Item}>

                </FlatList>
            </View>

        </>
    )
}

const styles =  StyleSheet.create({
    container: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        marginTop: 40
    },
    wrapper :{
        marginTop: 10,
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch'
    },
    photo: {
        height: 40,
        width: 40,
        borderRadius: 40 / 2,
    },
    field: {
        borderBottomColor: '#1077b8',
        borderBottomWidth: 1,
        width: Dimensions.get ('window').width - 70,
        marginLeft: 10
    },
    inputContainer: {
        position: 'relative'
    },
    textContainer: {
        padding: 10
    },
    inputIcon: {
        position: 'absolute',
        right: 0,
        top: -10
    },
    commentContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingRight: 40,
        marginLeft: 40,
        marginTop: 10,
        marginBottom: 10
    }
})