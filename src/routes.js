import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Entypo } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons'; 
import { FontAwesome5 } from '@expo/vector-icons'; 

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import CreateUserSucess from './pages/CreateUserSucess';
import TermsOfUse from './pages/TermsOfUse';
import Index from './pages/Index'
import Comment from './pages/Comment'
import HistoryStatus from './components/HistoryStatus'
import SearchResult from './pages/SearchResult'
import ViewResult from './pages/ViewResult'
import Map from './pages/Map'
import CreatePublication from './pages/CreatePublication'
import FillPublicationAddress from './pages/FillPublicationAddress'
import CompletePublication from './pages/CompletePublication'
import UpdatePublication from './pages/UpdatePublication'
import Profile from './pages/Profile'
import Notification from './pages/Notification'
import { isSignedIn } from './Service/auth'


const MainStack = createStackNavigator();
const RootStack = createStackNavigator();
const PublicationStack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();


export default function Routes({ navigation , isLogged }) {

    const [logged, setLogged] = useState(isLogged);

    function logout() {
        setLogged(false)
        return index();
    }

    function homeRoutes() {
        return(
            <RootStack.Navigator initialRouteName='Home'>
                 <RootStack.Screen 
                        name="Home"
                        component={Index}
                        options={{ headerShown: false }}
                    />
                    <RootStack.Screen 
                        name="Comentários"
                        component={Comment}
                    />
                    <RootStack.Screen 
                        name="Histórico de Status"
                        component={HistoryStatus}
                    />
                    <RootStack.Screen 
                        name="Resultado da Busca"
                        component={SearchResult}
                    />
                    <RootStack.Screen 
                        name="Publicação"
                        component={ViewResult}
                    />
                    <RootStack.Screen 
                        name="Localização"
                        component={Map}
                    />
            </RootStack.Navigator>
        )
    }

    function publicationRoutes() {
        return(
            <PublicationStack.Navigator initialRouteName='Criar publicação' >
                <PublicationStack.Screen 
                        name="Criar publicação"
                        component={CreatePublication}
                        options={{ headerShown: false }}
                />
                <PublicationStack.Screen 
                        name="Editar publicação"
                        component={UpdatePublication}
                        options={{ headerShown: false }}
                        listeners={({ navigation, route }) => ({
                            tabPress: e => {
                            e.preventDefault();
                            navigation.navigate('Criar publicação', { screen: 'Criar publicação', params : { publication: publication } });
                          },
                        })}
                />
                 <PublicationStack.Screen 
                        name="Informar um endereço"
                        component={FillPublicationAddress}
                    />
                <PublicationStack.Screen 
                     name="Concluir publicação"
                    component={CompletePublication}
                />
            </PublicationStack.Navigator>
        )
    }

    function home() {
            return(
                    <Tab.Navigator 
                        initialRouteName="Home"
                        activeColor="#f0edf6"
                        barStyle={{ backgroundColor: '#0371B6' }}>
                        <Tab.Screen name="Home" component={homeRoutes} 
                        options={{
                            tabBarIcon: ({color}) => (
                                <Entypo name="home" size={26} color={color} />),
                                tabBarVisible: false
                            }}/>
                        <Tab.Screen name="Criar publicação" component={publicationRoutes} 
                        options={{
                            tabBarIcon: ({color}) => (
                                <Entypo name="squared-plus" size={26} color={color} />)
                            }}
                            listeners={({ navigation, route }) => ({
                                tabPress: e => {
                                e.preventDefault();
                                navigation.navigate('Criar publicação', { screen: 'Criar publicação' });
                              },
                            })}
                            />
                        <Tab.Screen name="Notificações" component={Notification} 
                        options={{
                            tabBarIcon: ({color}) => (
                                <Ionicons name="notifications-circle" size={24} color={color} />)
                            }}/>
                        <Tab.Screen name="Perfil" component={Profile} 

                        options={{
                            tabBarIcon: ({color}) => (
                                <FontAwesome5 name="user-alt" size={24} color={color} />)
                            
                            }}/> 
                                                
                    </Tab.Navigator>
            )

        
    
    }


    function index({logged}) {
        return(
                <MainStack.Navigator initialRouteName={logged ? 'Index' : 'Login'}>
                    <MainStack.Screen 
                        name="Login"
                        component={Login}
                        options={{ headerShown: false }}
                    />
                    <MainStack.Screen 
                        name="Registrar"
                        component={Register}
                    />
                    <MainStack.Screen 
                        name="Esqueci a senha"
                        component={ForgotPassword}
                    />
                    <MainStack.Screen 
                        name="Sucesso"
                        component={CreateUserSucess}
                        options={{ headerShown: false }}
                    />
                    <MainStack.Screen 
                        name="Termos de uso"
                        component={TermsOfUse}
                    />
                    <MainStack.Screen 
                        name="Index"
                        component={home}
                        options={{headerShown: false}}
                    />
                </MainStack.Navigator>
        )
    }

    return (
        <>{ index({logged:logged}) }</>
    )

}