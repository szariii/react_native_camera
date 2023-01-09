import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();

import Main from "./components/Main";
import Gallery from "./components/Gallery";
import CameraScreen from "./components/CameraScreen";
import BigPhoto from "./components/BigPhoto";

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="main"
          component={Main}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="gallery"
          component={Gallery}
          options={{
            headerStyle: {
              backgroundColor: "#303F9F",
            },
          }}
        />

        <Stack.Screen
          name="camera"
          component={CameraScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="bigPhoto"
          component={BigPhoto}
          options={{
            headerStyle: {
              backgroundColor: "#303F9F",
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
