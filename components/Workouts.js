import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, FlatList, Alert } from 'react-native';
import { Appbar, Button, Card, PaperProvider, Text, ActivityIndicator } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import FirebaseConfig from '../firebaseConfig'
import React, { useState, useEffect } from 'react';

export default function Workouts() {
    const navigation = useNavigation();
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Haetaan templaatit tietokannasta
        fetchTemplates();
    }, []);
    // Uudelleen renderöi Workouts-näkymän aina, kun näkymä saa fokuksen
    useFocusEffect(
        React.useCallback(() => {
            fetchTemplates(); // Päivitä templaatit aina kun näkymä saa fokuksen
        }, [])
    );

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const db = getFirestore();
            const templatesCollection = collection(db, 'templates');
            const templatesSnapshot = await getDocs(templatesCollection);
            const fetchedTemplates = [];
            templatesSnapshot.forEach((doc) => {
                const docData = doc.data();
                const templateData = {
                    id: doc.id,
                    exercises: docData.template.map((exercise) => ({
                        name: exercise.name,
                    }))
                };
                fetchedTemplates.push(templateData);
            });
            setLoading(false)
            setTemplates(fetchedTemplates);
        }
        catch (error) {
            console.error('Error fetching workouts: ', error);
        }
    }
    const deleteTemplate = async (templateId) => {
        try {
            const db = getFirestore();
            const templateDoc = doc(db, 'templates', templateId);
            await deleteDoc(templateDoc);
            // Poiston jälkeen haetaan templatet uudelleen
            fetchTemplates();
        } catch (error) {
            console.error('Error deleting template: ', error);
        }
    };
    const handleStartSession = (template) => {
        template.exercises.forEach(exercise => {
            console.log(exercise.name);
        });

        navigation.navigate('Search', { template: template.exercises });
    };
    const handleDeleteTemplate = (templateId) => {
        Alert.alert(
            "Confirm Deletion",
            "Are you sure you want to delete this template?",
            [
                {
                    text: "Cancel",
                },
                {
                    text: "Delete",
                    onPress: () => deleteTemplate(templateId)
                }
            ]
        );
    };
    return (
        <SafeAreaProvider>
            <PaperProvider>
                <View style={styles.container}>
                    <Appbar.Header dark={true} mode='center-aligned' style={{ backgroundColor: '#2e2e2e' }}>
                        <Appbar.Content title='Workout' />
                    </Appbar.Header>
                    <Button icon='plus' mode='elevated' style={{ marginTop: 20 }} buttonColor='#D14100' textColor='white' onPress={() => navigation.navigate('Search')}>
                        NEW WORKOUT
                    </Button>
                    <ActivityIndicator animating={loading} color='#D14100' style={{ marginTop: 10 }} />

                    <FlatList
                        data={templates}
                        renderItem={({ item }) => (
                            <View style={styles.itemContainer}>
                                <Card style={{ width: 250 }}>
                                    <Card.Title title='Template' titleVariant='headlineSmall' titleStyle={{ alignSelf: 'center', marginLeft: 43 }}
                                        right={(props) => (
                                            <Button
                                                {...props}
                                                icon="delete"
                                                textColor="red"
                                                onPress={() => handleDeleteTemplate(item.id)}
                                            />
                                        )} />
                                    <Card.Content>
                                        {item.exercises.map((exercise, index) => (
                                            <View key={index} style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                <Text variant="titleMedium">{exercise.name}</Text>
                                            </View>
                                        ))}</Card.Content>
                                    <Card.Actions style={{ alignSelf: 'center', marginTop: 20 }}>
                                        <Button textColor='#D14100' onPress={() => handleStartSession(item)}>Start</Button>
                                    </Card.Actions>
                                </Card>
                            </View>

                        )}
                        keyExtractor={(item) => item.id}

                    />
                    <Button icon='plus' mode='elevated' style={{ marginTop: 20, position: 'absolute', bottom: 2, alignSelf: 'center' }} buttonColor='#D14100' textColor='white' onPress={() => navigation.navigate('TemplateSearch')}>
                        NEW TEMPLATE
                    </Button>

                    <StatusBar style="auto" />
                </View>

            </PaperProvider>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#242424',

    },
    itemContainer: {
        padding: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#242424',
    },

});
