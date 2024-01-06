import { useState, useContext, useCallback, useEffect } from 'react';
import * as Font from "expo-font";
import { Text, TextInput, View, StyleSheet, KeyboardAvoidingView, Keyboard } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import Button from "../components/Button";
import {validateEmail, validateName} from "../utils/validators";
import { AppContext } from '../utils/appContext';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const Onboarding = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const isNameValid = validateName(firstName);
  const isEmailValid = validateEmail(email);
  const { signIn } = useContext(AppContext);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
         "Karla-Regular": require("../assets/fonts/Karla-Regular.ttf"),
         "Karla-Bold": require("../assets/fonts/Karla-Bold.ttf"),
         "Karla-ExtraBold": require("../assets/fonts/Karla-ExtraBold.ttf"),
          "MarkaziText-Medium": require("../assets/fonts/MarkaziText-Medium.ttf"),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

    return (
      <KeyboardAvoidingView
         style={styles.container}
         behavior={Platform.OS === "ios" ? "padding" : "height"}
        onLayout={onLayoutRootView}
      >
        <Text style={styles.title}>
          Let us get to know you
        </Text>
        <View
            style={styles.formContainer}
        >
            <Text style={styles.label}>First name</Text>
            <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                onBlur={Keyboard.dismiss}
                autoCapitalize="words"
                autoComplete="given-name"
                autoCorrect={false}
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                onBlur={Keyboard.dismiss}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email" // work cross-platform
                autoCorrect={false}
            />
            <View style={styles.buttonContainer}>
            <Button
              onPress={() => signIn({ firstName, email })}
              disabled={!isEmailValid || !isNameValid}
            >
              Next
            </Button>
            </View>
            </View>
            </KeyboardAvoidingView>
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
    },
    title: {
      paddingVertical: 16,
      color: '#f4ce14',
      backgroundColor: '#495e57',
      width: "100%",
      textAlign: "center",
      fontSize: 48,
      fontFamily: 'MarkaziText-Medium',
    },
    formContainer: {
      width: "100%",
      padding: 24,
      flex: 1,
      justifyContent: "center",
    },
    label: {
      fontSize: 24,
      fontFamily: "Karla-Bold",
      color: '#495e57',
      textAlign: "center",
      paddingVertical: 8,
    },
    input: {
        height: 50,
        width: "80%",
        borderWidth: 2,
        borderRadius: 8,
        padding: 12,
        fontSize: 20,
        fontFamily: "Karla-Regular",
        marginBottom: 24,
        alignSelf: 'center',
    },
    buttonContainer: {
      marginTop: 40,
      width: '40%',
      //alignSelf: 'flex-end',
      alignSelf: 'center',
    },
  });

export default Onboarding;