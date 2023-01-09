import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const RadioButton = ({ optionName, setState, state, optionValue }) => {
  const pressHandler = () => {
    setState(optionValue);
  };

  return (
    <View style={{ flex: 1, margin: 5 }}>
      <TouchableOpacity
        style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
        onPress={pressHandler}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 40,
            borderColor: "#3F51B5",
            padding: 5,
            borderWidth: 5,
            borderStyle: "solid",
          }}
        >
          {state === optionValue ? (
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 20,
                borderColor: "#3F51B5",
                borderWidth: 5,
                borderStyle: "solid",
                backgroundColor: "#3F51B5",
              }}
            ></View>
          ) : (
            ""
          )}
        </View>
        <Text
          style={{
            fontSize: 15,
            color: "white",
            textAlign: "center",
          }}
        >
          {optionName}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

let styles = StyleSheet.create({
  animatedView: {
    position: "absolute",
    top: "4%",
    //bottom: 0,
    left: 0,
    //right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    height: "100%",
    width: "50%",
  },
});

export default RadioButton;
