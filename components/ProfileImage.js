import { Text, View, Image } from "react-native";

const ProfileImage = ({avatarImage, firstName, lastName, size}) => {
    if (avatarImage) {
        return (
            <Image
                source={{ uri: avatarImage }}
                style={{
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    resizeMode: 'cover',
                 }}
            />
        );
        }

    return (
        <View style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: "#fbdabb",
            justifyContent: 'center',
            alignItems: 'center',
            }}
        >
            <Text style={{
                fontSize: size / 2.4,
                color: '#ee9972',
                fontWeight: 'bold',
                //fontFamily: 'MarkaziText-Bold',
                letterSpacing: 1.5,
            }}
            >
                {!firstName ? '' : firstName.charAt(0).toUpperCase()}{!lastName ? '' : lastName.charAt(0).toUpperCase()}
            </Text>
          </View>
    );
}

export default ProfileImage;