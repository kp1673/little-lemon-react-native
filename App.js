
import { useEffect, useReducer, useMemo } from 'react';
import { Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from './screens/Splash';
import Onboarding from './screens/Onboarding';
import Home from './screens/Home';
import Profile from './screens/Profile';
import LogoTitle from './components/LogoTitle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from './utils/appContext';


const Stack = createNativeStackNavigator();

const initialProfile = {
  avatarImage: '',
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  orderStatuses: false,
  passwordChanges: false,
  specialOffers: false,
  newsletter: false
}

export default function App() {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'SIGN_IN':
          return {
            ...prevState,
            isOnboardingCompleted: true,
          };
        case 'SIGN_OUT':
          return {
              ...prevState,
              isOnboardingCompleted: false,
            };
        case 'STOP_LOADING':
          return {
            ...prevState,
            isLoading: false,
          };
      }
    },
    {
      isLoading: true,
      isOnboardingCompleted: false,
    }
  );

  useEffect(() => {
    (async () => {
      try {
        const userToken = await AsyncStorage.getItem('user');
        if (userToken !== null) {
          dispatch({ type: 'SIGN_IN' });
        }
      } catch (error) {
        Alert.alert('Failed to fetch user!', error.message)
      } finally {
        dispatch( { type: 'STOP_LOADING'});
      }
    })();

  }, []);


  const appContext = useMemo(
    () => ({
      signIn: async (obj) => {
        try {
          await AsyncStorage.setItem('user', JSON.stringify({...initialProfile, ...obj}));
          dispatch({ type: 'SIGN_IN' });
        } catch (error) {
          Alert.alert(`Failed to save user: ${error.message}`);
        }
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem('user');
          dispatch({ type: 'SIGN_OUT' });
        } catch (error) {
          Alert.alert(`Error clearing app data: ${error.message}`);
        }
      },

    }),
    []
  );


  if (state.isLoading) {
    // We haven't finished reading from AsyncStorage yet
    return <Splash />;
    }

  return (
    <AppContext.Provider
        value={appContext}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerTitle: (props) => <LogoTitle {...props} />,
            headerTitleAlign: 'center',
          }}
        >
        {state.isOnboardingCompleted ? (
      // Onboarding completed, user is signed in
          <>
            <Stack.Screen
              name="Home"
              component={Home}
            />
            <Stack.Screen
              name="Profile"
              component={Profile}
              //initialParams={...}
            />
          </>
        ) : (
        // User is NOT signed in
          <Stack.Screen
            name="Onboarding"
            component={Onboarding}
          />
        )}
        </Stack.Navigator>
      </NavigationContainer>
      </AppContext.Provider>
  );
}