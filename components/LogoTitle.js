import { Text, TextInput, View, SafeAreaView, StyleSheet, Image, Button, Pressable, Keyboard, TouchableOpacity, StatusBar, Alert } from "react-native";

const LogoTitle = () => {
    return (
      <Image
        style={{ width: 180, height: 50, resizeMode: 'contain', marginVertical: 12 }}
        source={require('../assets/Logo.png')}
      />
    );
  }

  export default LogoTitle;