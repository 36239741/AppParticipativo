import  React  from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 

const color = {
    'CONCLUIDO': '#4C7A34',
    'ATENDIMENTO': '#AFB915',
    'ENCAMINHADO': '#FED612',
    'ANALISE': '#FFAF00',
    'PROTOCOLADO': '#F36000',
    'RECEBIDO': '#CA251F'
}

export default function HistoryStatus({route, navigation}) {

    const { status } = route.params

    function recoveryColor(type) {
        console.log(type)
        const recoveredColor = color[type];
        const colorEncontred = recoveredColor || recoveredColor.length > 0 ? recoveredColor : 'white';
        return colorEncontred;

    }

    return (

        <ScrollView style={styles.rootContainer}>
            { status.map(statusForMap => (
                <View style={{...styles.container,  backgroundColor:  recoveryColor(statusForMap.tipo)}} key={statusForMap.tipo}>
                    <AntDesign name="checkcircleo" size={24} color="white" />
                    <View style={styles.information}>
                        <Text style={styles.informationText}>
                            {statusForMap.tipo}
                        </Text>
                        <Text style={styles.informationText}>
                            {statusForMap.createdAt.split(' ')[0]} {statusForMap.createdAt.split(' ')[1]}
                        </Text>
                    </View>
                </View>
            ))}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    rootContainer: {
        padding: 10
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        borderRadius: 8,
        padding: 8,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 10
    },
    information: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: 13
    },
    informationText:{
        textTransform: 'uppercase',
        color: 'white',
    }
});