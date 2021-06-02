import React, {useEffect, useState} from 'react';
import { StyleSheet, View, Text, ActivityIndicator , TextInput, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 
import { participativoApi } from '../Api/Api'
import { getToken } from '../Service/auth'
import { useIsFocused } from '@react-navigation/native';

import Publication from '../components/Publication'


export default function Index({navigation}) {

    const isFocused = useIsFocused();

    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [ page, setPage ] = useState(0);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        loadTimeLine();
    }, [isFocused])

    async function loadTimeLine()  {

        if (loading) return null;

        setLoading(true);

        let params = {
            'page': page,
            'linesPerPage': 10,
          }
        
       if ( publications.length > 0) setPublications([]); setPage(0)
        
        const token = await getToken();

        const data = (await participativoApi.get('publicacoes/timeline', {params : params, headers: {Authorization: token}})).data

        if( data.content.length === 0) {setLoading(false); return;}

        setPublications(value => [ ...value, ...data.content] )

        setPage((value) => value + 1);

        setLoading(false);
        
    }

    function renderFooter () {
        if (!loading) return null;
    
        return (
          <View style={styles.loading}>
            <ActivityIndicator />
          </View>
        );


    }

    function renderItem({ item }) {
        return (

            <Publication publication={item} navigation={navigation} /> 

        )

    }
    
    return (
        <View style={styles.container}>
            <View>
                <View style={styles.searchFieldContainer}>
                    <TextInput style={styles.searchField} onChangeText={text => setSearchText(text)} value={searchText}/>
                    <FontAwesome style={styles.searchFieldIcon} name="search" size={24} color="black" 
                        onPress={() => searchText.length > 0 && navigation.navigate('Resultado da Busca', { searchText: searchText })}
                    />
                </View>
            </View>

            <FlatList contentContainerStyle={styles.publicationContainer}
                data={publications}
                keyExtractor={item => item.uuid}
                onEndReached={loadTimeLine}
                onEndReachedThreshold={0.1}
                ListFooterComponent={renderFooter}
                renderItem={renderItem}>
            </FlatList>

        </View>
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
    },
    loading: {
        alignSelf: 'center',
        marginVertical: 20,
    },
})