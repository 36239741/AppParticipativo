import React from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 

import Publication from '../components/Publication'


export default function Index() {
    return (
        <ScrollView style={styles.container}>
            <View>
                <View style={styles.searchFieldContainer}>
                    <TextInput style={styles.searchField} />
                    <FontAwesome style={styles.searchFieldIcon} name="search" size={24} color="black" />
                </View>
            </View>
            <View style={styles.publicationContainer}>
                <Publication />
                
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
        marginTop: 20
    }
})