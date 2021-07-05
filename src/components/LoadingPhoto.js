import React, { useState } from 'react';
import { StyleSheet, View, Image , Button, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 


export default function LoadingPhoto({ setPhoto, photo, base64 }) {

    const [image, setImage] = useState(photo)
    const [isBase64, setIsBase64] = useState(base64);


    async function openImagePickerAsync() {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
        if (permissionResult.granted === false) {
          alert("É requerido a permissão aos acessos as fotos.");
          return;
        }
    
        let pickerResult = await ImagePicker.launchImageLibraryAsync(
            {allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            mediaTypes: "Images",
        });

        if (pickerResult.cancelled === true) {
            return;
        }
        setPhoto(pickerResult);
        setImage({ uri: pickerResult.uri }) 
        setIsBase64(false);
    }

    function previewImage() {
        if(imageIsNull()) {
            return (
                <>
                    <FontAwesome style={styles.iconUser} name="user-circle" size={130} color="#d4e6f2" />
                    <MaterialIcons style={styles.iconPhoto} name="photo-camera" size={40} color="#1077b8" />
                </>
            )
        } else {
            return !isBase64 ? <Image style={styles.photo} source={{uri: image.uri}} /> : <Image style={styles.photo} source={{ uri: `data:image/jpeg;base64,${photo}`}} />

        }

    }

    function imageIsNull() {
        return image === null && photo === null ? true : false;
    }


    return (
        <>  

            <View>
                <View style={styles.container}>
                    { previewImage() }
                </View>
                <Button style={styles.button} title='ESCOLHER FOTO' color='#0371B6' onPress={openImagePickerAsync}/>
            </View>

        </>
    )
}

const styles = StyleSheet.create({ 
    container: {
        position: 'relative',
        borderRadius: 150/2,
        height: 150,
        width: 150,
        borderWidth: 1,
        borderColor: '#1077b8',
        alignItems: 'center',
        justifyContent: 'center'
    },
    iconUser: {
        borderRadius: 130/2,
    },
    iconPhoto: {
        position: 'absolute'
    },
    photo : {
        resizeMode: 'cover', 
        width: 135,
        height: 135,
        borderRadius: 135/2,
        resizeMode: "cover", 
        justifyContent: "center"
    }
})