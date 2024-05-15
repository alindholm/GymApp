import React, { useState } from 'react';
import { View } from 'react-native';
import { BottomNavigation } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Workouts from './components/Workouts';
import Search from './components/Search';
import FirebaseConfig from './firebaseConfig'
import History from './components/History';
import TemplateSearch from './components/TemplateSearch'

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {/*Poistetaan headerit näkyvistä*/}
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={Main} />
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen name="TemplateSearch" component={TemplateSearch} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

function Main() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'workouts', title: 'Workouts', focusedIcon: 'dumbbell' },
    { key: 'history', title: 'History', focusedIcon: 'history' },

  ]);
  const renderScene = BottomNavigation.SceneMap({
    workouts: () => <Workouts />,
    history: () => <History />
  });

  return (
    <View style={{ flex: 1 }}>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        activeColor='white'
        inactiveColor='#D14100'
        barStyle={{ backgroundColor: '#2e2e2e', }}
      />
    </View>
  );
}
