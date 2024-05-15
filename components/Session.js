import { useState } from "react";
import { PaperProvider, TextInput, Text, Button, Portal, Modal, IconButton } from "react-native-paper";
import { FlatList, View, StyleSheet, StatusBar } from "react-native";
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import FirebaseConfig from '../firebaseConfig'
import { useNavigation } from '@react-navigation/native';


const db = getFirestore();

export default function Session({ exercises }) {
    const navigation = useNavigation();

    const [workout, setWorkout] = useState([]);
    const [weightInputs, setWeightInputs] = useState(0);
    const [repsInputs, setRepsInputs] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [buttonPressed, setButtonPressed] = useState({});

    const saveWorkoutToFirestore = async () => {
        try {
            //lisätään uusi dokumentti tietokantaan
            const docRef = await addDoc(collection(db, 'workouts'), { workout, date: serverTimestamp() });
            console.log('Document written with ID: ', docRef.id);
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    const handleCheckPress = (exerciseName) => {

        if (weightInputs[exerciseName] !== undefined && repsInputs[exerciseName] !== undefined) {
            //asetetaan painetun napin arvo trueksi
            setButtonPressed(prevState => ({
                ...prevState,
                [exerciseName]: true
            }));
            const newExercise = { name: exerciseName, weight: weightInputs[exerciseName], reps: repsInputs[exerciseName] };
            setWorkout(prevWorkout => [...prevWorkout, newExercise]);
            console.log(newExercise);
        }
    };
    const handleWeightChange = (value, exerciseName) => {
        //asetetaan tietyn exercisen paino
        setWeightInputs(prevState => ({
            ...prevState,
            [exerciseName]: value
        }));
    };
    const handleRepsChange = (value, exerciseName) => {
        //asetetaan tietyn exercisen toistot
        setRepsInputs(prevState => ({
            ...prevState,
            [exerciseName]: value
        }));
    };
    const handleSaveWorkout = () => {
        saveWorkoutToFirestore();
        navigation.navigate('Main')
    };
    const handleRemoveExercise = (exerciseName) => {
        setWorkout(prevWorkout => prevWorkout.filter(exercise => exercise.name !== exerciseName));
    };
    return (
        <>
            <PaperProvider>
                <View style={{ maxHeight: 600 }}>
                    <FlatList
                        data={exercises}
                        renderItem={({ item }) =>
                            <>
                                <View style={styles.renderItem}>
                                    <Text variant="titleLarge" style={{ color: 'white' }}>{item}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={styles.renderFlex}>
                                            <Text
                                                variant='labelLarge'
                                                style={styles.label}>Weight</Text>
                                            <TextInput style={styles.textInput}
                                                keyboardType="numeric"
                                                value={weightInputs[item] || ""}
                                                onChangeText={text => handleWeightChange(text, item)} />
                                        </View>
                                        <View style={styles.renderFlex}>
                                            <Text
                                                variant='labelLarge'
                                                style={styles.label}>Reps</Text>
                                            <TextInput style={styles.textInput}
                                                keyboardType="numeric"
                                                value={repsInputs[item] || ""}
                                                onChangeText={text => handleRepsChange(text, item)} />
                                        </View>
                                        <Button
                                            icon='check'
                                            mode='contained'
                                            style={{ justifyContent: 'flex-end', alignItems: 'flex-end', marginTop: 50, marginLeft: 150 }}
                                            contentStyle={{ height: 50, width: 50 }}
                                            buttonColor={buttonPressed[item] ? 'green' : 'gray'}
                                            onPress={() => handleCheckPress(item)}
                                        >
                                        </Button>

                                    </View>
                                </View>

                            </>

                        }
                    />
                </View>
                <Button mode='elevated' style={{ marginBottom: 20, position: 'absolute', bottom: 20, width: '100%' }} buttonColor='#D14100' textColor='white' onPress={() => setModalVisible(true)}>Save workout</Button>
                <Portal>
                    <Modal
                        visible={modalVisible}
                        onDismiss={() => setModalVisible(false)}
                        contentContainerStyle={styles.modalContainer}
                    >
                        <Text style={styles.modalTitle}>Workout Summary</Text>
                        <FlatList
                            data={workout}
                            renderItem={({ item }) => (
                                <View style={styles.modalItem}>
                                    <Text style={{ fontSize: 18 }}>{item.name}</Text>
                                    <Text>Weight: {item.weight}</Text>
                                    <Text>Reps: {item.reps}</Text>
                                    <IconButton
                                        icon="delete"
                                        onPress={() => handleRemoveExercise(item.name)}
                                    />
                                </View>
                            )}
                        />
                        <View style={{ flexDirection: 'row' }}>
                            <Button mode="contained" buttonColor="red" style={{ width: '50%' }} onPress={() => setModalVisible(false)}>
                                Cancel
                            </Button>
                            <Button mode="contained" buttonColor="green" style={{ width: '50%' }} onPress={handleSaveWorkout}>
                                Save
                            </Button>
                        </View>
                    </Modal>
                </Portal>
            </PaperProvider>
            <StatusBar style="auto" />
        </>

    )
}
const styles = StyleSheet.create({
    renderItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginLeft: 30,
        marginTop: 10,
        marginBottom: 30


    },
    textInput: {
        marginTop: 10,
        width: 60,
        marginRight: 10,
        textAlign: 'center'

    },
    label: {
        color: '#D14100',
        marginRight: 10
    },
    renderFlex: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 20
    },
    modalContainer: {
        backgroundColor: "white",
        padding: 20,
        marginHorizontal: 40,
        borderRadius: 10,
        height: '75%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    modalItem: {
        marginBottom: 20,
    },
});