import React from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons'; 
import MoreLessText from '../components/MoreLessText'

export default function Publication({publication}) {

    function publicationType() {
        return(

            <View style={styles.publicationType}>
                <Text style={styles.publicationTypeText}>Reclamação</Text>
            </View>

        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.photoAndpublicationInformationContainer}>
                    <View style={styles.photoFrame}>
                        <View style={styles.photo}  />
                    </View>
                    <View style={styles.publicationInformationContainer}>
                        <Text style={styles.publicationUserName}>Henrique  Nitatori</Text>
                        <View style={styles.publicationDate}>
                            <MaterialIcons name="date-range" size={14} color="black" />
                            <Text style={styles.publicationDateText}>Publicado em 16 de março de 2020 ás 14h04</Text>
                        </View>
                    </View>
                </View>
                <Entypo name="dots-three-vertical" size={20} color="black" />
            </View>
            <View style={styles.publicationImageContainer}>
                <View style={styles.publicationTypeContainer}>
                    {publicationType()}
                </View>
                <View style={styles.publicationImage}></View>

                <View style={styles.publicationAddressContainer}>
                    <View style={styles.publicationAddress}>
                        <Text style={styles.publicationAddressText}>Avenida Araucária 1234 - Vila A Próximo ao IFPR</Text>
                    </View>
                </View>
            </View>
            <View style={styles.commentTextContainer}>
                <MoreLessText numberOfLines={5}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </MoreLessText>
            </View>
            <View style={styles.publicationCommentsAndLikeContainer}>
                <Text style={styles.commentAndLike}>1234 pessoas apoiam está publicação</Text>
                <Text style={styles.commentAndLike}>1234 comentários</Text>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'column'
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
        backgroundColor: 'red'
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
        backgroundColor: 'red',
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
        backgroundColor: 'green',
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
    }
})