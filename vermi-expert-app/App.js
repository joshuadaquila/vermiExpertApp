import React, { useEffect, useState } from 'react';
import { View, Text, Button, Linking, SafeAreaView } from 'react-native';
import Home from './pages/Home';

const HomeScreen = ({ navigation }) => (
  <SafeAreaView>
    <Text>Welcome to the Home Screen!</Text>
    <Button title="Go to Profile" onPress={() => navigation('profile')} />
  </SafeAreaView>
);

const ProfileScreen = () => (
  <SafeAreaView>
    <Text>Welcome to the Profile Screen!</Text>
  </SafeAreaView>
);

const App = () => {
  const [screen, setScreen] = useState('home'); // Default screen

  useEffect(() => {
    // Listen for deep links/navigation requests
    const handleUrl = (event) => {
      const route = event.url.replace('myapp://', '');
      if (route === 'profile') {
        setScreen('profile');
      } else {
        setScreen('home');
      }
    };

    Linking.addEventListener('url', handleUrl);

    // Check if the app was opened from a deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleUrl({ url });
      }
    });

    return () => {
      Linking.removeEventListener('url', handleUrl);
    };
  }, []);

  return (
    <SafeAreaView>
      {screen === 'home' ? <Home/> : <ProfileScreen />}
    </SafeAreaView>
  );
};

export default App;
