import React, { useEffect, useRef } from 'react';
import { 
    View, TouchableOpacity, 
    Text, Animated, Dimensions, 
} from 'react-native';

import Feather from 'react-native-vector-icons/Feather';

function Message({ message }) {

    let messageTimer = null;

    const width = (Dimensions.get('screen').width-21);
    const barTimer = useRef(new Animated.Value(width)).current;

    useEffect(() => {
        function createTimer() {
            barTimer.setValue(width);
            messageTimer = setTimeout(
                () => message.functions.close(message.prevMessage),
                message.timer
            );
            Animated.timing(barTimer,{
                toValue:0,
                duration:message.timer,
                useNativeDriver: false,
            }).start();
        }
        message.timer && createTimer();
    }, [message.name]);

    return (
        <View style={{marginBottom: 10,}}>
            <View style={{flexDirection: 'row', marginBottom: 7, }} >

                <TouchableOpacity
                    onPress={() => {
                        clearTimeout(messageTimer);
                        message.functions.close(message.prevMessage);
                    }}
                >

                    <Feather
                        name={message.iconName}
                        color={message.color}
                        size={20}
                    />

                </TouchableOpacity>

                <Text style={{ marginLeft: 5, color: message.color, }} >
                    {message.text}
                </Text>

            </View>

            {message.timer&&
            
                <Animated.View 
                    style={{
                        width:barTimer,
                        height:2, 
                        borderRadius:1,
                        backgroundColor:message.color, 
                        marginHorizontal:1
                    }}
                />
            }
        </View>
    );

}

export default Message;