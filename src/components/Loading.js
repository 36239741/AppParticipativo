import React, { useState, useEffect } from 'react';
import { StyleSheet, View , Animated} from 'react-native';

export default function Loading() {

    const [animationDotOne] = useState(new Animated.Value(0))
    const [animationDotTwo] = useState(new Animated.Value(0))
    const [animationDotThree] = useState(new Animated.Value(0))


    useEffect(() => {
        mountLoadingAnimation();
    }, [])

    function mountLoadingAnimation() {
        animate(animationDotOne, 1000, 1200);
        animate(animationDotTwo, 1200, 1400);
        animate(animationDotThree, 1400, 1600);
    }

    function animate (animation, durationOne, durationTwo) {
        Animated.timing(animation, {
            toValue:1,
            duration: durationOne,
            useNativeDriver: false
          }).start( () => {
            Animated.timing(animation,{
              toValue:0,
              duration: durationTwo,
              useNativeDriver: false,
            }).start(() => animate(animation, durationOne, durationTwo))
          })
    }

    function backgroundColor (animation) { 
        return animation.interpolate ({ 
            inputRange: [0, 1], 
            outputRange: ["white", "#0371B6"] 
        }) 
    }

    
    return(
        <View style={styles.container}>
            <Animated.View style={[styles.dot, {backgroundColor: backgroundColor(animationDotOne)}]}/>
            <Animated.View style={[styles.dot, {backgroundColor: backgroundColor(animationDotTwo)}]}/>
            <Animated.View style={[styles.dot, {backgroundColor: backgroundColor(animationDotThree)}]}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    dot: {
        height: 3,
        width: 3,
        borderRadius: 50,
        backgroundColor: 'white',
        padding: 3,
        marginLeft: 3,
    }
})