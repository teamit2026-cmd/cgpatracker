import { registerRootComponent } from 'expo';

import about from './about';
import dash from './dash';
import feedback from './feedback';
import App from './App';
import pratices from './pratices';
import CGPACalculator from './CGPACalculator';
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately

// registerRootComponent(about);
// registerRootComponent(dash);
// registerRootComponent(CGPACalculator);
registerRootComponent(App);
// registerRootComponent(pratices);