import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const MyButton = ({ text, action }) => {
  return (
    <TouchableOpacity onPress={action} style={{ flex: 1 }}>
      <View style={styles.myButton}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  myButton: {
    flex: 1,
    maxHeight: 50,
    backgroundColor: "#3F51B5",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },

  text: {
    color: "#FFFFFF",
  },
});

export default MyButton;
