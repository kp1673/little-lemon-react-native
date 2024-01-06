import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const Filters = ({ onChange, selections, sections }) => {
  return (
    <View style={styles.filtersContainer}>
      {sections.map((section, index) => (
        <TouchableOpacity
          onPress={() => {
            onChange(index);
          }}
          // Adds key
          key={index}
          style={{
            flex: 1 / sections.length,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 8, // 16,
            backgroundColor: selections[index] ? '#EE9972' : '#495E57',
            borderWidth: 1,
            borderColor: 'white',
            borderRadius: 20,
          }}>
          <View>
            <Text style={{ fontSize: 16, fontFamily: "Karla-ExtraBold", color: selections[index] ? 'black' : 'white' }}>
              {section.charAt(0).toUpperCase()+ section.slice(1)}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginBottom: 8, // 16,
  },
});

export default Filters;