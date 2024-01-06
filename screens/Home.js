import { useEffect, useState, useCallback, useMemo } from 'react';
import { Text, View, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from "react-native";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Searchbar } from 'react-native-paper';
import debounce from 'lodash.debounce';
import {
  createTable,
  getMenuItems,
  insertAllDishes,
  filterByQueryAndCategories,
} from '../utils/database';
import Filters from '../components/Filters';
import ProfileImage from '../components/ProfileImage';
import { useUpdateEffect } from '../utils/hooks';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


SplashScreen.preventAutoHideAsync();

const API_URL =
  'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';

const sections = ['starters', 'mains', 'desserts'];

const listSeparator = () => {
  return <View style={ styles.listSeparator } />
  }

const Separator = () => <View style={styles.separator} />;

const Home = ({navigation}) => {
    const [appIsReady, setAppIsReady] = useState(false);
    const [menu, setMenu] = useState([]);
    const [searchBarText, setSearchBarText] = useState('');
    const [query, setQuery] = useState('');
    const [filterSelections, setFilterSelections] = useState(
      sections.map(() => false)
      // sections.fill(false)
    );

    useEffect(() => {
      (async () => {
        try {
          // 1. Create table if it does not exist
          await createTable();
          // 2. Check if data was already stored
          let menuItems = await getMenuItems();

          if (!menuItems.length) {
            // Fetching menu from URL
            const response = await fetch(API_URL);
            const json = await response.json();
            menuItems = json.menu;

            // Storing into database
            await insertAllDishes(menuItems);

          }
          setMenu(menuItems);
        } catch (e) {
          // Handle error
          Alert.alert(e.message);
        }
      })();
    }, []);


  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchUser = async () => {
        try {
          const savedUser = await AsyncStorage.getItem('user');
          const currentUser = JSON.parse(savedUser);

          if (isActive) {
            navigation.setOptions({
              headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                  <ProfileImage
                    firstName={currentUser.firstName}
                    lastName={currentUser.lastName}
                    avatarImage={currentUser.avatarImage}
                    size={50}
            />
            </TouchableOpacity>
          ),
          });
          }
        } catch (e) {
          // Handle error
          Alert.alert(`An error occurred: ${e.message}`);
        }
      };

      fetchUser();

      return () => {
        isActive = false;
      };
    }, [navigation])
  );


    useUpdateEffect(() => {
      (async () => {
        const activeCategories = sections.filter((s, i) => {
          // If all filters are deselected, all categories are active
          if (filterSelections.every((item) => item === false)) {
            return true;
          }
          return filterSelections[i];
        });
        try {
          const menuItems = await filterByQueryAndCategories(
            query,
            activeCategories
          );
          setMenu(menuItems);
        } catch (e) {
          Alert.alert(e.message);
        }
      })();
    }, [filterSelections, query]);

    const lookup = useCallback((q) => {
      setQuery(q);
    }, []);

    const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

  const handleSearchChange = (text) => {
    setSearchBarText(text);
    debouncedLookup(text);
  };

  const handleFiltersChange = async (index) => {
    const arrayCopy = [...filterSelections];
    arrayCopy[index] = !filterSelections[index];
    setFilterSelections(arrayCopy);
  };

  const fetchImage = (image) => {

    const IMAGE_URL = `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${image}?raw=true`;

    if (image === 'grilledFish.jpg'){
      return require('../assets/grilledFish.png')
    } else if (image === 'lemonDessert.jpg'){
      return require('../assets/lemonDessert.png');
    } else {
      return {uri: IMAGE_URL };
    }
  }


// {'\u0024'} dollar sign
  const renderItem = ({ item }) => {

    return(
          <View style={{paddingHorizontal: 24, paddingVertical: 12,}}>
             <Text style={{fontSize: 18, fontFamily: "Karla-Bold", marginBottom: 12, }}>{item.name}</Text>
             <View style={{flexDirection: 'row', gap: 12}}>
               <View style={{width: '70%', gap: 12}}>
                 <Text style={{fontSize: 16, fontFamily: "Karla-Regular", color: '#495e57', }}>{item.description}</Text>
                 <Text style={{fontSize: 18, fontFamily: "Karla-Medium", color: '#495e57'}}>${item.price}</Text>
               </View>
               <Image
                 style={{ flex: 1,
                 width: "100%",
                 height: 100,
                 resizeMode: 'stretch',
                }}
                 source = {fetchImage(item.image)}
                 //onError={({nativeEvent: {error} }) => console.log(error)}
               />
             </View>
           </View>
        )
      };

    useEffect(() => {
          async function prepare() {
            try {
              // Pre-load fonts, make any API calls you need to do here
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
    <View
      style={styles.container}
      onLayout={onLayoutRootView}
    >
        <FlatList
        data={menu}
        ListHeaderComponent={
          <>
            <View style={styles.heroContainer}>
                <Text style={styles.title}>Little Lemon</Text>
                <View style={styles.heroDetails}>
                  <View style={styles.heroText}>
                    <Text style={styles.subtitle}>Chicago</Text>
                    <Text style={styles.paragraph}>
                    We are a family-owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
                    </Text>
                  </View>
                  <Image style={styles.heroImage}
                        source={require('../assets/hero-image.png')}/>
                </View>
                <Searchbar
                  placeholder="Search"
                  placeholderTextColor="#AAAAAA"
                  onChangeText={handleSearchChange}
                  value={searchBarText}
                  style={styles.searchBar}
                  iconColor= "#333"
                  inputStyle={{
                    fontSize: 20,
                    fontFamily: "Karla-Regular",
                    color: '#333',
                  }}
                  elevation={0}
                />
              </View>
              <View style={styles.menuBreakdown}>
                <Text style={styles.attention}>
                  ORDER FOR DELIVERY!
                </Text>
                <Filters
                  selections={filterSelections}
                  onChange={handleFiltersChange}
                  sections={sections}
                />
                <Separator/>
            </View>
          </>
        }
        renderItem={renderItem}
        ItemSeparatorComponent = { listSeparator }
        keyExtractor={(item) => item.name}
        />
    </View>
    );
}

export default Home;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingBottom: 24,
    },
    heroContainer: {
      padding: 24,
      paddingTop: 4,
      backgroundColor: '#495E57',
    },
    title: {
      fontSize: 56,
      height: 56,
      fontFamily: 'MarkaziText-Medium',
      includeFontPadding: false,
      color: '#F4CE14',
    },
    heroDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    heroText: {
      maxWidth: '60%',
      gap: 20,
    },
    heroImage: {
      flex: 1,
      width: "100%",
      height: "90%",
      resizeMode: 'stretch',
      alignSelf: 'flex-end',
      borderRadius: 20,
    },
    subtitle: {
      fontSize: 40,
      height: 40,
      fontFamily: 'MarkaziText-Regular',
      includeFontPadding: false,
      color: '#EDEFEE',
    },
    paragraph: {
      fontSize: 18,
      color: '#FFF',
      fontFamily: 'Karla-Medium',
    },
    searchBar: {
      marginTop: 24,
      backgroundColor: '#EDEFEE',
      shadowRadius: 0,
      shadowOpacity: 0,
      fontSize: 20,
      fontFamily: "Karla-Regular",
    },
    menuBreakdown: {
      paddingTop: 24,
      paddingHorizontal: 24,
    },
    attention: {
      fontSize: 20,
      marginBottom: 12,
      fontFamily: 'Karla-ExtraBold',
    },
    separator: {
      marginTop: 16,
      marginBottom: 8,
      borderBottomColor: 'gray', // '#EDEFEE',
      borderBottomWidth: 1, //StyleSheet.hairlineWidth,
    },
    listSeparator: {
      height: 1,
      marginHorizontal: 24,
      backgroundColor: '#CCC',
    },
  });