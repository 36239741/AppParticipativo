import 'react-native-gesture-handler';
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { FontAwesome } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons'; 
import { FontAwesome5 } from '@expo/vector-icons'; 

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import CreateUserSucess from './pages/CreateUserSucess';
import TermsOfUse from './pages/TermsOfUse';
import Index from './pages/Index'



const MainStack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();


export default function Routes() {

    function index() {
        return(
            <Tab.Navigator 
                initialRouteName="Home"
                activeColor="#f0edf6"
                barStyle={{ backgroundColor: '#0371B6' }}>
                <Tab.Screen name="Home" component={Index} 
                options={{
                    tabBarIcon: ({color}) => (
                        <Entypo name="home" size={26} color={color} />)
                    }}/>
                <Tab.Screen name="Criar publicação" component={Index} 
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
        )
    }

    return (
        <NavigationContainer>
            <MainStack.Navigator>
                <MainStack.Screen 
                    name="Login"
                    component={Login}
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
                    component={index}
                    options={{headerShown: false}}
                />
            </MainStack.Navigator>
      </NavigationContainer>
    )

}