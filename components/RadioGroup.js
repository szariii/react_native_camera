import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import RadioButton from "./RadioButton";

const RadioGroup = ({ title, setState, state, data }) => {
  return (
    <View>
      <Text
        style={{
          fontSize: 20,
          textAlign: "center",
          color: "#FCFF3D",
          alignSelf: "stretch",
        }}
      >
        {title}
      </Text>
      {data.map((ele) => (
        <RadioButton
          setState={setState}
          state={state}
          optionName={ele.valueName}
          optionValue={ele.value}
        />
      ))}
    </View>
  );
};

export default RadioGroup;
