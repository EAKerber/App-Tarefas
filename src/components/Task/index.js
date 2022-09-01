import React, { useState, useEffect } from 'react';
import {
    View, Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ActivityIndicator,
} from 'react-native';

import Feather from 'react-native-vector-icons/Feather';

function Task({ data, editKey, handleEdit, handleDelete }) {

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        data.key!==editKey&&
        setLoading(false);        
    }, [editKey]);

    return (
        <View style={[styles.container]} >
            <TouchableOpacity
                style={[styles.trashBtn]}
                onPress={() => handleDelete(null)}
                delayLongPress={400}
                onLongPress={() => { handleDelete(data.key) && setLoading(true); }}
            >
                <Feather name='trash' size={20} color='#fff' />
            </TouchableOpacity>

            <View style={[{ flex: 1, }]} >
                <TouchableWithoutFeedback
                    onPress={() => { setLoading(true); handleEdit(data); }}
                >
                    <Text style={[styles.tasktext]} >{data.nome}</Text>
                </TouchableWithoutFeedback>
            </View>

            {(loading) &&

                <ActivityIndicator
                    size={17}
                    color='#fff'
                    style={{ paddingRight: 5, }}
                    animating={loading}
                />

            }

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#121212',
        alignItems: 'center',
        marginBottom: 10,
        padding: 10,
        borderRadius: 4,
    },
    trashBtn: {
        marginRight: 10,
    },
    tasktext: {
        color: '#fff',
        paddingRight: 10,
    },
});

export default Task;