import { StyleSheet, Image, SafeAreaView } from 'react-native';

const Splash = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Image
                style={styles.image}
                source = {require('../assets/Logo.png')}
            />
        </SafeAreaView>
     )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#edefee',
      padding: 8,
    },
    image: {
      width: 200,
      height: 200,
      resizeMode: 'contain',
    },
  });

export default Splash;