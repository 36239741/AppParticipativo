import React, { useState, useEffect } from 'react';
import { StyleSheet, View} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios'

export default function Map({ route }) {

    const { endereco } = route.params

    const [ publicationAddress, setPublicationAddress ] = useState(null);

    useEffect(() => {
        getAddress()
    }, [])

    function getAddress() {
        axios.get(`http://nominatim.openstreetmap.org/search?q=${endereco.numero}+${endereco.logradouro},+foz+do+iguacu&format=json&polygon=1&addressdetails=1`)
            .then(address => {

                if(address.data.length === 0) return;

                setPublicationAddress({latitude: Number(address.data[0].lat), longitude: Number(address.data[0].lon)});

            })
    }

    function map() {
        if(publicationAddress !== null) {
            return (

                 
                <MapView
                    initialRegion={{latitude: publicationAddress.latitude
                    ,longitude: publicationAddress.longitude,
                    latitudeDelta: 0,
                    longitudeDelta: 0}}
                    zoomEnabled={true}
                    minZoomLevel={10}
                       style={styles.map}>
                    <Marker coordinate={{latitude: publicationAddress.latitude,longitude: publicationAddress.longitude}}/>
                </MapView>

            ) }
    }


    return (
        <>
            {map()}
        </>
    )
}

const styles = StyleSheet.create({
    map: {
        alignSelf: 'stretch',
        flex: 1
    }
})
