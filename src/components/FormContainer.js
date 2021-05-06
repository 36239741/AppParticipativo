import React from 'react';
import {Keyboard, TouchableWithoutFeedback} from 'react-native'

export default function FormContainer({ children }) {
    return(
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            {children}
        </TouchableWithoutFeedback>
    )
}