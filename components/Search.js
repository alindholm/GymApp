import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Appbar, Searchbar, Modal, Portal, PaperProvider, List, IconButton } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native';
import Session from './Session';


export default function Search({ route }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [exercises, setExercises] = useState([]);
    const [selectedExercises, setSelectedExercises] = useState([]);
    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        //tarkastetaan onko route.paramsilla template arvo
        if (route.params && route.params.template) {
            const exercises = route.params.template;
            //käy läpi exercisesin
            exercises.forEach(exercise => {
                addedExercise(exercise.name);
            });

        }
        // päivittyy aina, kun route.params arvo muuttuu
    }, [route.params])


    const navigation = useNavigation();

    const url = `https://wger.de/api/v2/exercise/search/?language=en&term=${searchTerm}`
    const fetchExercises = () => {
        setLoading(true)
        fetch(url, {
            headers: {
                Authorization: 'Token 9b72b1f064ae6ed26810db12eee02a5ec3d42a97'
            }
        })
            .then(response => {
                if (!response)
                    throw new Error('Error in fetch: ' + response.statusText);
                return response.json();
            })
            .then(data => {
                setExercises(data.suggestions)
                setLoading(false)
                setVisible(true)
            })
            .catch(err => {
                console.error(err)
                alert('Loading failed')
            })
    }
    const searchIconPress = () => {
        fetchExercises();
    }
    const addedExercise = (exercises) => {
        console.log(exercises)
        setSelectedExercises(prevExercises => [...prevExercises, exercises])

    }
    //varmistaa haluaako käyttäjä poistua
    const handleConfirmation = () => {
        Alert.alert(
            "Are you sure?",
            "All your progress will be lost",
            [
                {
                    text: "Cancel",
                },
                { text: "Yes", onPress: () => goBack() },
            ],
            { cancelable: false }
        );
    };
    const goBack = () => {
        navigation.navigate('Main')
    }
    return (
        <SafeAreaProvider>
            <View style={styles.container}>

                <Appbar.Header dark={true} mode='center-aligned' style={{ backgroundColor: '#2e2e2e' }}>
                    <Appbar.BackAction onPress={handleConfirmation} />
                    <Appbar.Content title='Workout Session' />
                </Appbar.Header>
                <Searchbar
                    placeholder='Search exercises'
                    onChangeText={setSearchTerm}
                    value={searchTerm}
                    onIconPress={searchIconPress}
                    loading={loading} />

                <PaperProvider>
                    <Portal>
                        <Modal visible={visible}
                            onDismiss={() => setVisible(false)}
                            contentContainerStyle={styles.modal}>
                            <IconButton
                                icon='close'
                                style={styles.closeButton}
                                onPress={() => setVisible(false)} />
                            <FlatList
                                data={exercises}
                                renderItem={({ item }) =>
                                    <List.Item
                                        title={item.value}
                                        description={item.data.category}
                                        left={() => (< TouchableOpacity onPress={() => addedExercise(item.value)}>
                                            <List.Icon icon="plus" />
                                        </TouchableOpacity>)}
                                    />
                                }
                            />
                        </Modal>
                    </Portal>
                    <Session
                        exercises={selectedExercises}
                        setExercises={setSelectedExercises} />
                </PaperProvider>
                <StatusBar style="auto" />
            </View>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#242424',

    },
    modal: {
        backgroundColor: 'white',
        padding: 20,
        maxHeight: 650
    },
    closeButton: {
        position: 'absolute',
        top: 2,
        right: 2
    }
});