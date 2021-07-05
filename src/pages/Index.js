import React, {useEffect, useState} from 'react';
import { StyleSheet, View, Text, ActivityIndicator , TextInput, FlatList, Modal, TouchableHighlight } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 
import { participativoApi } from '../Api/Api'
import { getToken, onSignOut } from '../Service/auth'
import { useIsFocused } from '@react-navigation/native';

import Publication from '../components/Publication'


export default function Index({navigation}) {

    const isFocused = useIsFocused();

    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [ page, setPage ] = useState(0);
    const [searchText, setSearchText] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);
    const [deletePublicationId, setDeletePublicationId] = useState(null);

    useEffect(() => {
        loadTimeLine(),
        () => { setPublications([]) }
    },[])

    async function onRefresh() {
        setPage(0);
        await loadTimeLine();
    }

    async function loadTimeLine()  {

        if (loading) return null;

        setLoading(true);
        setIsRefreshing(true);

        let params = {
            'page': page,
            'linesPerPage': 10,
            'orderBy': 'createdAt',
            'direction': 'DESC'
          }

        if( page === 0 ) setPublications([])

        const token = await getToken();

        const data = (await participativoApi.get('publicacoes/timeline', {params : params, headers: {Authorization: token}})).data
        if( data.content.length === 0) {
            setIsRefreshing(false);
            setLoading(false); 
            return;
        }
        
        setPublications(value => [ ...value, ...data.content] )

        setPage((value) => value + 1);

        setLoading(false);
        setIsRefreshing(false);

        
    }

    function deletePublication(uuid) {

        setDeletePublicationId(uuid);
        setModalVisible(true);
    
    }

    async function sendDeletePublication() {


        const removePublication = publications.filter((value, index) => { if(value.uuid === deletePublicationId) return index });

        publications.splice(removePublication[0], 1);

        const token = await getToken();

        await participativoApi.put('publicacoes/deleteLogico/'+ deletePublicationId, {}, { headers: {Authorization: token} })

        setDeletePublicationId(null);

        setModalVisible(false);


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

            <Publication publication={item} navigation={navigation} deletePublication={deletePublication} /> 

        )

    }
    
    return (
        <View style={styles.container}>
            <View>
                <View style={styles.searchFieldContainer}>
                    <TextInput style={styles.searchField} onChangeText={text => setSearchText(text)} value={searchText}/>
                    <FontAwesome style={styles.searchFieldIcon} name="search" size={24} color="black" 
                        onPress={() => {
                          searchText.length > 0 && navigation.navigate('Resultado da Busca', { searchText: searchText })
                          setSearchText('')
                        }}
                    />
                </View>
            </View>

            <FlatList contentContainerStyle={styles.publicationContainer}
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                data={publications}
                keyExtractor={item => item.uuid}
                onEndReached={loadTimeLine}
                onEndReachedThreshold={100}
                ListFooterComponent={renderFooter}
                renderItem={renderItem}>
            </FlatList>

        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>

          <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: '#2196F3', marginBottom: 20 }}
              onPress={() => {
                sendDeletePublication();
              }}>
              <Text style={styles.textStyle}>Deletar</Text>
            </TouchableHighlight>

            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: '#C2C2C2' }}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}>
              <Text style={styles.textStyle}>Cancelar</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>

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
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
      modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      openButton: {
        backgroundColor: '#F194FF',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
      },
      textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      },
      modalText: {
        marginBottom: 15,
        textAlign: 'center',
      },
})