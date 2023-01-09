import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import * as Font from "expo-font";
import { useEffect, useState } from "react";

const Main = ({ navigation }) => {
  const [fontLoaded, setFontloaded] = useState(false);

  const downloadFont = async () => {
    await Font.loadAsync({
      myfont: require("../assets/fonts/freedom.ttf"), // Uwaga: proszę w nazwie fonta nie używać dużych liter
    });
    setFontloaded(true);
  };

  useEffect(() => {
    downloadFont();
  }, []);

  const titlePress = () => {
    navigation.navigate("gallery");
  };

  return (
    <View style={styles.main}>
      {fontLoaded === true ? (
        <View style={styles.body}>
          <TouchableOpacity style={{ flex: 1, alignItems: "center", justifyContent: "flex-end", paddingBottom: 40, }} onPress={titlePress}>
            <Text style={styles.fontAppName}>Camera Settings App</Text>
          </TouchableOpacity>
          <View style={styles.subtitleView} >
            <Text style={styles.fontSubTitle}>
              change camera white balance
            </Text>
            <Text style={styles.fontSubTitle}>
              change camera flash mode
            </Text>

            <Text style={styles.fontSubTitle}>
              change camera picture size
            </Text>
            <Text style={styles.fontSubTitle}>
              change camera ration
            </Text>
          </View>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {console.log("weszlo w czekanie")}
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },

  body: {
    flex: 1,
    backgroundColor: "#3F51B5",
    alignItems: "center",
    justifyContent: "center",
  },

  fontAppName: {
    color: "#C5CAE9",
    fontFamily: "myfont",
    fontSize: 60,
    textAlign: "center",
  },

  fontSubTitle: {
    color: "#C5CAE9",
    fontSize: 20,
    textAlign: "center",
  },

  subtitleView: {
    flex: 1
  }
});

export default Main;
