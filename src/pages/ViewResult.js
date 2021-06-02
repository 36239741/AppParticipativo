import React from 'react';
import { StyleSheet, View } from 'react-native';
import Publication from '../components/Publication'


export default function ViewResult({route, navigation}) {

    const { publication } = route.params;

    return (
        <View style={styles.container}>
            <Publication publication={ publication } navigation={navigation} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 8
    }
})
