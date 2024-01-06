import { useState, useEffect, useContext, useCallback, useLayoutEffect } from 'react';
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { Text, TextInput, View, SafeAreaView, StyleSheet, Image, ScrollView, Pressable, KeyboardAvoidingView, Keyboard, StatusBar, Alert, TouchableOpacity } from "react-native";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Checkbox from 'expo-checkbox';
import Button from "../components/Button";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { MaskedTextInput } from "react-native-mask-text";
import {validateEmail, validateName, validatePhone} from "../utils/validators";
import ProfileImage from '../components/ProfileImage';
import { AppContext } from '../utils/appContext';
import { useUpdateEffect } from '../utils/hooks';

SplashScreen.preventAutoHideAsync();

let initialProfile = {
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


const Profile = ({navigation}) => {
  const [appIsReady, setAppIsReady] = useState(false);
  /* Get the initial param through the route prop */
  //const {firstName, email} = route.params
  const { signOut } = useContext(AppContext);
  const [profile, setProfile] = useState(initialProfile);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const isNameValid = validateName(profile.firstName);
  const isLastNameValid = validateName(profile.lastName);
  const isEmailValid = validateEmail(profile.email);
  const isPhoneValid = validatePhone(profile.phoneNumber);

  useUpdateEffect(() => {
    updateHeaderRight();
  }, [profile.firstName, profile.lastName, profile.avatarImage]);

  useEffect(() => {
    (async () => {
      try {
        const savedUser = await AsyncStorage.getItem('user');
        const currentUser = JSON.parse(savedUser);
        initialProfile = {...initialProfile, ...currentUser};
        navigation.setOptions({
          headerRight: () => (
              <ProfileImage
                firstName={currentUser.firstName}
                lastName={currentUser.lastName}
                avatarImage={currentUser.avatarImage}
                size={50}
              />
          ),
        });
        setProfile({...profile, ...currentUser});
      } catch (error) {
        Alert.alert(`Failed to upload profile: ${error.message}`);
      }
    })();
  }, [navigation]);


  const updateForm = (key, value) => {
    setProfile((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const updatePreference = (key) => () =>
    setProfile((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));

  const updateHeaderRight = () => {
    navigation.setOptions({
      headerRight: () => (
          <ProfileImage
            firstName={profile.firstName}
            lastName={profile.lastName}
            avatarImage={profile.avatarImage}
            size={50}
          />
        )
      });
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    //console.log(result);

    if (!result.canceled) {
      setProfile({
        ...profile,
        avatarImage: result.assets[0].uri
      });
    }
  };

  const removeImage = () => {
    setProfile({
      ...profile,
      avatarImage: null
    });
  }

  const validateForm = (formData) => {
    return new Promise((resolve, reject) => {

      let errors = {};

    // Validate first name field
    if (!profile.firstName) {
        errors.name = 'First name is required.';
    } else if ((profile.firstName !== '') && !validateName(profile.firstName)) {
      errors.firstName = 'First name is invalid.';
    }

    // Validate last name field
    if ((profile.lastName !== '') && !validateName(profile.lastName) ) {
      errors.lastName = 'Last name is invalid.';
    }

    // Validate email field
    if (!profile.email) {
        errors.email = 'Email is required.';
    } else if ((profile.email !== '') && !validateEmail(profile.email)) {
        errors.email = 'Email is invalid.';
    }

    // Validate phone field
    if ((profile.phoneNumber !== '') && !validatePhone(profile.phoneNumber) ) {
        errors.phone = 'Phone number is invalid.';
    }

    // Set the errors and update form validity
    setErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);

    });
  }

  const saveUpdate = async () => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(profile));
      Alert.alert('Data successfully saved.')
    } catch (e) {
      Alert.alert('Failed to save data.')
    }
  }

  const resetProfile = () => {
    setProfile(initialProfile);
  }

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          "Karla-Regular": require("../assets/fonts/Karla-Regular.ttf"),
          "Karla-Medium": require("../assets/fonts/Karla-Medium.ttf"),
          "Karla-Bold": require("../assets/fonts/Karla-Bold.ttf"),
          "Karla-ExtraBold": require("../assets/fonts/Karla-ExtraBold.ttf"),
          "MarkaziText-Regular": require("../assets/fonts/MarkaziText-Regular.ttf"),
          "MarkaziText-Medium": require("../assets/fonts/MarkaziText-Medium.ttf"),
          "MarkaziText-Bold": require("../assets/fonts/MarkaziText-Bold.ttf"),
        });
      } catch (e) {
        console.warn(e);
      } finally {
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
    <KeyboardAwareScrollView
    onLayout={onLayoutRootView}
    >
    <View style={styles.container}>
      <Text style={styles.title}>
        Personal information
      </Text>
      <View style={[styles.buttonGroup, {gap: 16}]}>
      <ProfileImage
        firstName={profile.firstName}
        lastName={profile.lastName}
        avatarImage={profile.avatarImage}
        size={80}
      />
      <Button
        onPress={pickImage}
        disabled={false}
      >
        Change
      </Button>
      <Pressable
        style={styles.buttonContainer}
        disabled={false}
        onPress={removeImage}
      >
        <Text style={styles.buttonText}>
          Remove
        </Text>
      </Pressable>
      </View>
      <View style={{paddingVertical: 20}}>
        <Text style={styles.formLabel}>
          First name
        </Text>
        <TextInput
          style={styles.input}
          value={profile.firstName}
          onChangeText={newText => setProfile({
                  ...profile,
                  firstName: newText
                })}
          onBlur={Keyboard.dismiss}
          autoCapitalize="words"
          autoComplete="given-name"
          autoCorrect={false}
          //placeholder={"Type your first name"}
        />
        <Text style={styles.formLabel}>
          Last name
        </Text>
        <TextInput
          style={styles.input}
          value={profile.lastName}
          onChangeText={newText => setProfile({
                  ...profile,
                  lastName: newText
                })}
          onBlur={Keyboard.dismiss}
          autoCapitalize="words"
          autoComplete="family-name"
          autoCorrect={false}
          //placeholder={"Type your last name"}
        />
        <Text style={styles.formLabel}>
          Email
        </Text>
        <TextInput
          style={styles.input}
          value={profile.email}
          //placeholder="Ex.: martin@domain.com"
          onChangeText={(value) => updateForm('email', value)}
          onBlur={Keyboard.dismiss}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email" // work cross-platform
          autoCorrect={false}
        />
        <Text style={styles.formLabel}>
          Phone number
        </Text>
        <MaskedTextInput
          //mask="AAA-9999"
          //mask="+1 (999) 999-9999"
          mask="(999) 999-9999"
          style={styles.input}
          value={profile.phoneNumber}
          onChangeText={(value) => updateForm('phoneNumber', value)}
          onBlur={Keyboard.dismiss}
          keyboardType="phone-pad"
          autoComplete="tel"
          autoCorrect={false}
          placeholder="(999) 999-9999"
        />
      </View>
      <Text style={styles.title}>
        Email notifications
      </Text>
      <View style={styles.checkboxContainer}>
        <Checkbox
          style={styles.checkbox}
          value={profile.orderStatuses}
          onValueChange={updatePreference('orderStatuses')}
        />
        <Text style={styles.label}>
          Order statuses
        </Text>
      </View>
      <View style={styles.checkboxContainer}>
        <Checkbox
          style={styles.checkbox}
          value={profile.passwordChanges}
          onValueChange={updatePreference('passwordChanges')}
        />
        <Text style={styles.label}>
          Password changes
        </Text>
      </View>
      <View style={styles.checkboxContainer}>
        <Checkbox
          value={profile.specialOffers}
          onValueChange={updatePreference('specialOffers')}
          style={styles.checkbox}
        />
        <Text style={styles.label}>
          Special offers
        </Text>
      </View>
      <View style={styles.checkboxContainer}>
        <Checkbox
          value={profile.newsletter}
          onValueChange={updatePreference('newsletter')}
          style={styles.checkbox}
        />
        <Text style={styles.label}>
          Newsletter
        </Text>
      </View>
      <Pressable
        style={[styles.buttonContainer, {backgroundColor: "#f4ce14", borderColor: '#f4ce14', marginVertical: 20,}]}
        onPress={signOut}
      >
        <Text style={[styles.buttonText, {color: '#333'}]}>
          Log out
        </Text>
      </Pressable>
      <View style={[styles.buttonGroup, {justifyContent: 'space-between'}]}>
        <Pressable
          style={styles.buttonContainer}
          onPress={resetProfile}
        >
          <Text style={styles.buttonText}>
            Discard changes
          </Text>
        </Pressable>
        <Button
          onPress={saveUpdate}
          disabled={!isEmailValid || !isNameValid || ((profile.lastName !== '') && !isLastNameValid) ||
          ((profile.phoneNumber !== '') && !isPhoneValid)}
        >
          Save changes
        </Button>
      </View>
    </View>
    </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      paddingTop: StatusBar.currentHeight,
      backgroundColor: 'white',
    },
    checkboxContainer: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 20,
    },
    checkbox: {
      alignSelf: 'center',
    },
    label: {
      fontSize: 20,
      fontFamily: "Karla-Medium",
    },
    formLabel: {
      fontSize: 18,
      fontFamily: "Karla-Bold",
      paddingVertical: 8,
    },
    input: {
      height: 40,
      borderColor: "#EDEFEE",
      borderWidth: 2,
      borderRadius: 8,
      padding: 10,
      fontSize: 20,
      fontFamily: "Karla-Regular",
      marginBottom: 20,
    },
    buttonContainer: {
      borderRadius: 8,
      borderColor: '#495e57',
      borderWidth: 2,
      flexDirection: 'row',
      justifyContent: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    buttonGroup: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontFamily: "Karla-ExtraBold",
      marginBottom: 16,
    },
    buttonText: {
      fontSize: 18,
      fontFamily: "Karla-ExtraBold",
      color: '#495e57',
    },
  });

export default Profile;