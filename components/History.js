import { useState, useEffect } from "react";
import { FlatList, View } from "react-native";
import { Text, Appbar, ActivityIndicator } from "react-native-paper";
import { getFirestore, collection, getDocs, orderBy, query } from 'firebase/firestore';



export default function History() {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                setLoading(true);
                const db = getFirestore();
                //hakee harjoitukset ja järjestää ne päivän mukaan
                const q = query(collection(db, 'workouts'), orderBy('date', 'desc'));
                //hakee tiedot q:n perusteella
                const querySnapshot = await getDocs(q);
                const fetchedWorkouts = [];
                //Muunnetaan jokaisesta dokumentista objekti
                querySnapshot.forEach((doc) => {
                    const docData = doc.data();
                    const workoutData = {
                        id: doc.id,
                        date: docData.date.toDate(),
                        exercises: docData.workout.map(exercise => ({
                            name: exercise.name,
                            reps: exercise.reps,
                            weight: exercise.weight
                        }))
                    };
                    //lisätään oliot taulukkoon
                    fetchedWorkouts.push(workoutData);
                });
                setLoading(false)
                setWorkouts(fetchedWorkouts);
            } catch (error) {
                console.error('Error fetching workouts: ', error);
            }
        };

        fetchWorkouts();
    }, []);

    return (
        <View style={styles.container}>
            <Appbar.Header dark={true} mode='center-aligned' style={{ backgroundColor: '#2e2e2e' }}>
                <Appbar.Content title='History' />
            </Appbar.Header>
            <ActivityIndicator animating={loading} color='#D14100' style={{ marginTop: 10 }} />

            <FlatList
                data={workouts}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text variant="headlineMedium" style={{ color: '#D14100' }}>Workout</Text>
                        <Text style={{ marginBottom: 15, color: '#D14100' }} variant="titleSmall">{item.date.toDateString()}</Text>
                        {item.exercises.map((exercise, index) => (
                            <View key={index} style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text variant="titleLarge" style={{ color: 'white' }}>{exercise.name}</Text>
                                <Text variant="bodyLarge" style={{ color: 'white' }}>Weight: {exercise.weight}kg</Text>
                                <Text variant="bodyLarge" style={{ marginBottom: 20, color: 'white' }}>Reps: {exercise.reps}</Text>
                            </View>
                        ))}
                    </View>
                )}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
}

const styles = {
    container: {
        flex: 1,
        backgroundColor: '#242424',
    },
    itemContainer: {
        padding: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#242424',
    },
};
