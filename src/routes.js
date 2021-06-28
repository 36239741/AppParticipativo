import 'react-native-gesture-handler';
import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';
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



const MainStack = createStackNavigator();
const RootStack = createStackNavigator();
const PublicationStack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();


export default function Routes({ isLogged }) {

    const [logged, setLogged] = useState(isLogged);

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
            <PublicationStack.Navigator initialRouteName='Criar publicação'>
                <PublicationStack.Screen 
                        name="Criar publicação"
                        component={CreatePublication}
                        options={{ headerShown: false }}
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
            <NavigationContainer>
                <Tab.Navigator 
                    initialRouteName="Home"
                    activeColor="#f0edf6"
                    barStyle={{ backgroundColor: '#0371B6' }}>
                    <Tab.Screen name="Home" component={homeRoutes} 
                    options={{
                        tabBarIcon: ({color}) => (
                            <Entypo name="home" size={26} color={color} />)
                        }}/>
                    <Tab.Screen name="Criar publicação" component={publicationRoutes} 
                    options={{
                        tabBarIcon: ({color}) => (
                            <Entypo name="squared-plus" size={26} color={color} />)
                        }}/>
                    <Tab.Screen name="Notificações" component={Index} 
                    options={{
                        tabBarIcon: ({color}) => (
                            <Ionicons name="notifications-circle" size={24} color={color} />)
                        }}/>
                    <Tab.Screen name="Perfil" component={Index} 
                    options={{
                        tabBarIcon: ({color}) => (
                            <FontAwesome5 name="user-alt" size={24} color={color} />)
                        }}/>                     
                </Tab.Navigator>
            </NavigationContainer>
        )

    }


    function index() {
        return(
            <NavigationContainer>
                <MainStack.Navigator>
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
        </NavigationContainer>)
    }

    return (
        <>{ logged ? home() : index() }</>
    )

}