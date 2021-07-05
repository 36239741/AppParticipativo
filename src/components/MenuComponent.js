import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text, Image, TextInput, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; 
import { Menu } from 'react-native-paper';
import { Entypo } from '@expo/vector-icons'; 
import { Feather } from '@expo/vector-icons'; 
import { participativoApi } from '../Api/Api'
import { getToken } from '../Service/auth'
import jwtDecode from 'jwt-decode'

export default function MenuComponent ({ comment, user, deleteComment }) {

    const [isOpen, setIsOpen] = useState(false);
    const [editComment, setComment] = useState(comment);
    const [isEdit, setIsEdit] = useState(false);
    const [inputTextEdited, setInputTextEdited] = useState(comment.comment.corpo);
    const [userLogged, setUserLogged] = useState(null);

    useEffect(() => {
        userLoggedDecode();
    },[])

    function edit() {
        return (                
        <View style={styles.inputContainer}>
            <TextInput style={styles.field} value={inputTextEdited} onChangeText={setInputTextEdited}/>
            <Feather name="arrow-right" size={24} color="black" style={styles.inputIcon} onPress={() => handleEdit()}/>
        </View>)
    }

    async function handleEdit() {
        let editedComment = editComment;
        editedComment.comment.corpo = inputTextEdited;
        setComment(editedComment);
        setIsEdit(false);
        await sendEditComment();
    }

    async function userLoggedDecode() {

        let token = await getToken();

        const decode = jwtDecode(token);

        setUserLogged(decode.sub);

    }

    async function sendEditComment() {

        let token = await getToken();

        await participativoApi.put('comentarios/' + editComment.comment.uuid,  { corpo: editComment.comment.corpo } ,  { headers: { Authorization: token }} )

    }

    return (

    <View style={styles.wrapper} >
        <View style={styles.commentContainer}>
            { typeof editComment.photo !== 'undefined' ? (<Image source={{uri: `data:image/jpeg;base64,${editComment.photo}` }} style={styles.photo}  />) : <FontAwesome5 name="user-alt" size={34} color='black' /> }
            <View style={styles.textContainer}>
                {isEdit ? edit() 
                    : <Text style={{marginLeft: 10, fontSize: 11}}>{editComment.comment.corpo}</Text>}
                <Text style={{marginLeft: 10, fontSize: 10, fontWeight: 'bold'}}>Em {editComment.comment.createdAt.split(' ')[0]} ás {comment.comment.createdAt.split(' ')[1].split(':')[0]}:{comment.comment.createdAt.split(' ')[1].split(':')[1]}</Text>
            </View>
        </View>
        {userLogged === comment.comment.usuario.email && (<Menu
            visible={isOpen}
            onDismiss={() => setIsOpen(false)}
            anchor={
                <Entypo name="dots-three-vertical" style={{marginLeft: -10}} size={20} color="black" onPress={() => { setIsOpen(true) }}/>
                }>
            <Menu.Item onPress={() =>  {
                setIsEdit(true)
                setIsOpen(false)
            }} title="Editar" />
            <Menu.Item onPress={() => {deleteComment(editComment.comment.uuid)}} title="Excluir" />
        </Menu>)}
    </View>

    )
}
const styles = StyleSheet.create({
    commentContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingRight: 40,
        marginLeft: 40,
        marginTop: 10,
        marginBottom: 10
    },
    wrapper :{
        marginTop: 10,
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch'
    },
    textContainer: {
        width: 260,
        padding: 10
    },
    photo: {
        height: 40,
        width: 40,
        borderRadius: 40 / 2,
    },
    inputText: {
        width: 260,
        borderBottomWidth: 1,
        borderColor: 'black'
    },
    inputContainer: {
        position: 'relative'
    },
    field: {
        borderBottomColor: '#1077b8',
        borderBottomWidth: 1,
        width: Dimensions.get ('window').width - 160,
        marginLeft: 10
    },
    inputIcon: {
        position: 'absolute',
        right: -25,
        top: -10
    },
})