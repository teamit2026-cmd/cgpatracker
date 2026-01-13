import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, ActivityIndicator } from 'react-native';

// Database
import RealmDB from './database/RealmDB';

// Screens
import SplashScreen from './screens/SplashScreen';
import Dashboard from './dash';
import About from './about';
import Feedback from './feedback';
import CGPAProgressAnalysis from './fo';
import ViewProfile from './ViewProfile';
import CGPACalculator from './CGPACalculator';
import Result from './Result';
import CustomSubject from './custom_subject';
import Download from './Download';
import Privacy from './Privacy';
import Syllabus from './Syllabus';

const Stack = createStackNavigator();

// Database Error Component
const DatabaseError = ({ error }) => (
  <View style={{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 20
  }}>
    <Text style={{
      color: '#ff6b6b',
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 10,
      textAlign: 'center'
    }}>
      Database Error
    </Text>
    <Text style={{
      color: '#b3e5fc',
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 20
    }}>
      {error || 'Failed to initialize database'}
    </Text>
    <Text style={{
      color: '#87ceeb',
      fontSize: 12,
      textAlign: 'center'
    }}>
      Please restart the app. If problem persists, reinstall the application.
    </Text>
  </View>
);

function App() {
  const [databaseState, setDatabaseState] = useState({
    isReady: false,
    error: null
  });

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🔄 Initializing Realm Database...');
        await RealmDB.getInstance().initialize();
        console.log('✅ Realm Database initialized successfully');

        setDatabaseState({ isReady: true, error: null });
      } catch (error) {
        console.error('❌ Failed to initialize database:', error);
        setDatabaseState({
          isReady: false,
          error: error.message || 'Unknown database error'
        });
      }
    };

    initializeApp();

    // Cleanup on app unmount
    return () => {
      if (RealmDB.getInstance().realm) {
        console.log('🔒 Closing Realm database connection');
        RealmDB.getInstance().close();
      }
    };
  }, []);

  // Show error screen if database initialization failed (non-Splash)
  if (databaseState.error) {
    return <DatabaseError error={databaseState.error} />;
  }

  // Always return the navigator. SplashScreen will handle the "wait" time.
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#ffffff' },
          animationEnabled: true,
        }}
      >
        <Stack.Screen name="Splash">
          {(props) => <SplashScreen {...props} isDatabaseReady={databaseState.isReady} />}
        </Stack.Screen>

        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{
            gestureEnabled: false,
          }}
        />



        {/* Academic Features */}
        <Stack.Screen
          name="CGPACalculator"
          component={CGPACalculator}
        />

        <Stack.Screen
          name="CustomSubject"
          component={CustomSubject}
        />

        <Stack.Screen
          name="Result"
          component={Result}
        />

        <Stack.Screen
          name="CGPAProgressAnalysis"
          component={CGPAProgressAnalysis}
        />

        {/* User Profile & Settings */}
        <Stack.Screen
          name="ViewProfile"
          component={ViewProfile}
        />

        {/* Utility Screens */}
        <Stack.Screen
          name="Download"
          component={Download}
        />

        <Stack.Screen
          name="Syllabus"
          component={Syllabus}
        />

        <Stack.Screen
          name="Feedback"
          component={Feedback}
        />

        {/* Information Screens */}
        <Stack.Screen
          name="About"
          component={About}
        />

        <Stack.Screen
          name="Privacy"
          component={Privacy}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;