import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text, TextInput, Button, ScrollView, TouchableOpacity, Modal,Image, ActivityIndicator } from 'react-native';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Picker } from '@react-native-picker/picker';
import { useForm, Controller } from 'react-hook-form';
import { MaterialIcons } from '@expo/vector-icons'; 
import FormContainer from '../components/FormContainer'
import * as ImagePicker from 'expo-image-picker';
import { participativoApi } from '../Api/Api'
import { getToken } from '../Service/auth'


export default function CreatePublication ({ navigation }) {

    const [modalVisible, setModalVisible] = useState(false);
    const [publicationPhoto, setPublicationPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        getCategory();
    }, [])


    var schema = yup.object().shape({
        categoria: yup.string().required('Campo obrigatório'),
        descricao: yup.string().required('Campo obrigatório').min(20, 'O tamanho minimo é 20 caracteres'),
        foto: yup.string().required('Campo obrigatório'),
      });

    const { handleSubmit, control, formState: { errors }, setValue, getValues } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = (data) => {
        data.categoria = getCategoryObject();
        navigation.navigate('Informar um endereço', { publicacao: data })
    };

    async function openCameraAsync() {

        setLoading(true);

        let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
        if (permissionResult.granted === false) {
          alert("É requerido a permissão aos acessos as fotos.");
          setLoading(false);
          return;
        }
    
        let pickerResult = await ImagePicker.launchCameraAsync(
            {allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
                mediaTypes: "Images",
                base64: true,
            }
        );
        
        if (pickerResult.cancelled === true) {
            setLoading(false);
            return;
        }
        
        setValue('foto', pickerResult.base64)
        setPublicationPhoto({uri: pickerResult.base64})
        setLoading(false);

    }

    async function openImagePickerAsync() {

        setLoading(true);

        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
        if (permissionResult.granted === false) {
          setLoading(false);
          alert("É requerido a permissão aos acessos as fotos.");
          return;
        }
    
        let pickerResult = await ImagePicker.launchImageLibraryAsync(
            {allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            mediaTypes: "Images",
            base64: true
        });

        if (pickerResult.cancelled === true) {
            setLoading(false);
            return;
        }
        
        setValue('foto', pickerResult.base64)
        setPublicationPhoto({uri: pickerResult.base64})
        setLoading(false);

    }

    function getCategoryObject() {
        const categoria = getValues('categoria');
        const categoriaEncontrada = categories.filter(category => category.id === categoria);
        return categoriaEncontrada[0];
    }

    async function getCategory() {

        const token = await getToken();

        const data = (await participativoApi.get('categorias', { headers: {Authorization: token}})).data

        setCategories(data)

    }

    function modal() {
        return (
            <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={{ marginBottom: 20 }}>
                    <Button title="Camera" onPress={() => openCameraAsync()}/>
                    <Button title="Galeria" onPress={() => openImagePickerAsync()}

                    />
                </View>
                {
                    loading ? (
                        <View style={styles.loading}>
                            <ActivityIndicator />
                        </View>
                    ) : null
                }
                <Button
                  title="Cancelar"
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}/>

              </View>
            </View>
          </Modal>
        )
    }

    return (
        <FormContainer>
            <ScrollView style={styles.container}>

            <View style={styles.fieldContainer}>
                <Controller defaultValue='' name='categoria' control={control} render={({field: {onChange, value}}) => (
                    <Picker
                      selectedValue={value}
                      onValueChange={(itemValue, itemIndex) =>
                        onChange(itemValue)
                      }>
                        { categories.map(category => (
                            <Picker.Item key={category.id} label={category.nome} value={category.id} />
                        )) }
                    </Picker> )}/>
                {errors.categoria && <Text style={styles.errorMessage}>{errors.categoria.message}</Text>}
            </View>

            <View style={styles.containerFields}>
                <View style={styles.fieldContainer}>
                    <Controller defaultValue='' name='descricao' control={control} render={({ field:{ onChange, value } }) => (
                        <TextInput 
                        value={value}
                        onChangeText={value => onChange(value)}
                        placeholder='Escreva uma descrição para sua publicação'
                        multiline={true}
                        numberOfLines={4} 
                        style={{ height:200, textAlignVertical: 'top', borderColor: '#0371B6', borderWidth: 1, borderRadius: 10, padding: 8}} /> )}/>
                    {errors.descricao && <Text style={styles.errorMessage}>{errors.descricao.message}</Text>}
                </View>
            </View>

            <View style={styles.fieldContainer}>
                    <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.photoContainer}>
                        <Text style={styles.photoText}>Tire uma foto ou escolha da galeria</Text>
                        <View style={styles.photoBorder}>
                            {publicationPhoto !== null ? 
                                <Image source={{uri: `data:image/jpeg;base64,${publicationPhoto.uri}` }} style={styles.photoBackground}></Image> :
                                 
                            <View style={styles.photoBackground}>
                                <MaterialIcons style={styles.iconPhoto} name="photo-camera" size={40} color="#1077b8" />
                            </View>
                            }
                        </View>
                    </TouchableOpacity> 
                    {errors.foto && <Text style={styles.errorMessage}>{errors.foto.message}</Text>}
                </View>

                <Button title='AVANÇAR' color='#0371B6' onPress={handleSubmit(onSubmit)}/>
                {modal()}
            </ScrollView>
        </FormContainer>
    )

}

const styles = StyleSheet.create({
    container: {
        padding: 8
    },
    fieldContainer: {
        alignSelf: 'stretch',
        flexDirection: 'column',
        marginBottom: 40,
    },
    errorMessage :{
        fontSize: 13,
        color: 'red',
        marginTop: 5,
        textAlign: 'center'
    },
    field: {
        borderBottomColor: '#0371B6',
        borderBottomWidth: 1,
        alignSelf: 'stretch',
    },
    photoContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    photoBorder: {
        height: 100,
        width: 150,
        borderWidth: 1,
        borderColor: '#0371B6',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 10,
        padding: 4
    }, 
    photoBackground: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: '#D5E7F3',
        alignSelf: 'stretch',
        flex: 1
    },
    photoText: {
        fontSize: 16,
        color: '#0371B6',
        fontWeight: 'bold'
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