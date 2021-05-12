import React, {useEffect, useState} from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 
import { participativoApi } from '../Api/Api'
import { getToken } from '../Service/auth'
import { useIsFocused } from '@react-navigation/native';

import Publication from '../components/Publication'


export default function Index({navigation}) {

    const isFocused = useIsFocused();

    const [publications, setPublications] = useState(null);

    useEffect(() => {
        loadTimeLine({page: 0, linesPerPage: 10})
    }, [isFocused])

    async function loadTimeLine(filter) {

        let params = {
            'page': filter.page,
            'linesPerPage': filter.linesPerPage,
          }

        const token = await getToken();

        participativoApi.get('publicacoes/timeline', {params : params, headers: {Authorization: token}}).then(result => {
            setPublications(result.data.content)
        }).catch(error => console.log(error))
    }

    return (
        <ScrollView style={styles.container}>
            <View>
                <View style={styles.searchFieldContainer}>
                    <TextInput style={styles.searchField} />
                    <FontAwesome style={styles.searchFieldIcon} name="search" size={24} color="black" />
                </View>
            </View>
            <View style={styles.publicationContainer}>

                {publications != null && publications.map(publication => <Publication publication={publication} navigation={navigation} key={publication.uuid} />)}
                
            </View>
        </ScrollView>
    )
}

const styles =  StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        flexDirection: 'column',
    },
    searchFieldContainer: {
        alignSelf: 'stretch',
        marginTop: 25,
    },
    searchField: {
        alignSelf: 'stretch',
        backgroundColor: '#D3D3D3',
        borderRadius: 5,
        color: '#0371B6',
        padding: 12,
        height: 50,
        fontSize: 16,
        fontWeight: 'bold'
    },
    searchFieldIcon: {
        position: 'absolute',
        right: 10,
        top: 14
    },
    publicationContainer: {
        marginTop: 20,
        marginBottom: 20
    }
})