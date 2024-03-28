import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context'


export default function Workouts() {
    return (
        <SafeAreaProvider>
            <View style={styles.container}>
                <Appbar.Header dark={true} mode='center-aligned' style={{ backgroundColor: '#2e2e2e' }}>
                    <Appbar.Action icon='menu' />
                    <Appbar.Content title='Workout' />
                    <Appbar.Action icon='account' />
                </Appbar.Header>
                <Button icon='plus' mode='elevated' style={{ marginTop: 10 }} buttonColor='#D14100' textColor='white'>
                    New workout
                </Button>
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
});
