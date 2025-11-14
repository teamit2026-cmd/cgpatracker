import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import individual screens
import SplashScreen from './screens/SplashScreen';
import Dashboard from './dash.js';
import About from './about.js';
import Feedback from './feedback.js';
import CGPAProgressAnalysis from './fo.js';
import ViewProfile from './ViewProfile.js';
import ChangePassword from './ChangePassword.js';
import CGPACalculator from './CGPACalculator.js';
import Result from './Result.js';
import CustomSubject from './custom_subject.js';
import Download from './Download.js';
import Privacy from './Privacy.js';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        {/* Splash Screen */}
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen}
        />
        
        {/* Main App Screens */}
        <Stack.Screen 
          name="Dashboard" 
          component={Dashboard}
        />
        <Stack.Screen 
          name="About" 
          component={About}
        />
        <Stack.Screen 
          name="Feedback" 
          component={Feedback}
        />
        <Stack.Screen 
          name="Privacy" 
          component={Privacy}
        />
        <Stack.Screen 
          name="CGPAProgressAnalysis" 
          component={CGPAProgressAnalysis}
        />
        <Stack.Screen 
          name="ViewProfile" 
          component={ViewProfile}
        />
        <Stack.Screen 
          name="ChangePassword" 
          component={ChangePassword}
        />
        <Stack.Screen 
          name="Download" 
          component={Download}
        />
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
