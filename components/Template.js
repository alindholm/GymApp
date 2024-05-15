import { useState } from "react";
import { List, PaperProvider, TextInput, Text, Button, Portal, Modal, IconButton } from "react-native-paper";
import { FlatList, View, StyleSheet, StatusBar, Alert } from "react-native";
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import FirebaseConfig from '../firebaseConfig'
import { useNavigation } from '@react-navigation/native';


const db = getFirestore();

export default function Template({ exercises, setExercises }) {
    const navigation = useNavigation();

    const [template, setTemplate] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [buttonPressed, setButtonPressed] = useState({});


    const saveTemplateToFirestore = async () => {
        try {
            //luo uuden dokumentin
            const docRef = await addDoc(collection(db, 'templates'), { template });
            console.log('Document written with ID: ', docRef.id);
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    const handleCheckPress = (exerciseName) => {
        setButtonPressed(prevState => ({
            ...prevState,
            [exerciseName]: true
        }));
        const newExercise = { name: exerciseName };
        setTemplate(prevTemplate => [...prevTemplate, newExercise]);
        console.log(newExercise);

    };
    //siirtyy pääsivulle vasta, kun tallennus on onnistunut
    const handleSaveTemplate = async () => {
        try {
            await saveTemplateToFirestore();
            navigation.navigate('Main');
        } catch (error) {
            console.error('Error saving template: ', error);
        }
    };
    const handleRemoveExercise = (exerciseName) => {
        setTemplate(prevTemplate => prevTemplate.filter(exercise => exercise.name !== exerciseName));
        setButtonPressed(prevState => ({
            ...prevState,
            [exerciseName]: false
        }));
    };
    const handleFilterExercise = (exercise) => {
        const existingExercise = template.find(item => item.name === exercise);
        console.log(existingExercise)
        if (existingExercise == undefined) {
            setExercises(prevExercises => prevExercises.filter(exercises => exercises.data.name !== exercise))
        } else {
            if (existingExercise.name === exercise) {
                console.log(exercises)
                Alert.alert(
                    "Delete blocked",
                    "First go delete it from Save workout window",
                    [
                        {
                            text: "Ok",
                        }
                    ],
                    { cancelable: false }
                );

            }
        }
    }
    return (
        <>

            <FlatList
                data={exercises}
                renderItem={({ item }) =>
                    <>
                        <View style={styles.renderItem}>
                            <Text variant="titleLarge" style={{ color: 'white', marginLeft: 65 }}>{item.data.name}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <IconButton icon='delete' iconColor="#D14100" size={30} style={{ marginTop: 50, marginRight: 15 }} onPress={() => handleFilterExercise(item.data.name)} />
                                <View style={styles.renderFlex}>
                                    <Text
                                        variant='labelLarge'
                                        style={styles.label}>Weight</Text>
                                    <TextInput style={styles.textInput}
                                        editable={false}
                                        value='-' />
                                </View>
                                <View style={styles.renderFlex}>
                                    <Text
                                        variant='labelLarge'
                                        style={styles.label}>Reps</Text>
                                    <TextInput style={styles.textInput}
                                        editable={false}
                                        value='-' />
                                </View>
                                <Button
                                    icon='check'
                                    mode='contained'
                                    style={{ justifyContent: 'flex-end', alignItems: 'flex-end', marginTop: 50, marginLeft: 100 }}
                                    contentStyle={{ height: 50, width: 50 }}
                                    buttonColor={buttonPressed[item.data.name] ? 'green' : 'gray'}
                                    onPress={() => handleCheckPress(item.data.name)}
                                >
                                </Button>

                            </View>
                        </View>

                    </>

                }
            />

            <Button mode='elevated' style={{ marginBottom: 40 }} buttonColor='#D14100' textColor='white' onPress={() => setModalVisible(true)}>Save template</Button>
            <Portal>
                <Modal
                    visible={modalVisible}
                    onDismiss={() => setModalVisible(false)}
                    contentContainerStyle={styles.modalContainer}
                >
                    <Text style={styles.modalTitle}>Template Summary</Text>
                    <FlatList
                        data={template}
                        renderItem={({ item }) => (
                            <View style={styles.modalItem}>
                                <Text style={{ fontSize: 18 }}>{item.name}</Text>
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
                        <Button mode="contained" buttonColor="green" style={{ width: '50%' }} onPress={handleSaveTemplate}>
                            Save
                        </Button>
                    </View>
                </Modal>
            </Portal>
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
        marginTop: 30
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