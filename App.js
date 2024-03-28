import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, } from 'react-native';
import Workouts from './components/Workouts';



export default function App() {
  return (
    <Workouts />

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242424',

  },
});
