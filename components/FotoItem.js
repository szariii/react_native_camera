import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";

const FotoItem = ({
  uri,
  id,
  width,
  height,
  selectedPhotos,
  setSelectedPhotos,
  navigation,
  refreshGalleryFunction,
  startingValue,
  sourceWidth,
  sourceHeight,
}) => {
  const [selected, setSelected] = useState(startingValue);

  // if (selectedPhotos.includes(id)) {
  //   setSelected(true);
  // }

  const longPressHandler = () => {
    if (selected === false) {
      const newArray = selectedPhotos;
      newArray.push(id);
      setSelectedPhotos(newArray);
      setSelected(true);
    } else {
      const newArray = selectedPhotos.filter((ele) => ele !== id);
      setSelectedPhotos(newArray);
      setSelected(false);
    }
  };

  const pressHandler = () => {
    navigation.navigate("bigPhoto", {
      uri: uri,
      id: id,
      refreshGalleryFunction: refreshGalleryFunction,
      width: sourceWidth,
      height: sourceHeight,
    });
  };

  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      onPress={pressHandler}
      onLongPress={longPressHandler}
    >
      <View style={{ flex: 1, margin: 5 }}>
        <Image
          style={{
            width: width,
            height: height,
          }}
          source={{ uri: uri, id: id }}
        />
        <Text
          style={{
            position: "absolute",
            color: "#FFFFFF",
            left: width - 60,
            top: height - 40,
          }}
        >
          {id}
        </Text>

        {selected === true ? (
          <View style={styles.hidder}>
            <Image
              style={{
                width: width,
                height: height,
              }}
              source={require("../assets/img/plus.png")}
            />
          </View>
        ) : (
          ""
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // textId: {
  //   position: "absolute",
  //   color: "#FFFFFF",
  //   left: width - 50,
  //   bottom: height - 5,
  // },
  hidder: {
    position: "absolute",
    backgroundColor: "black",
    top: 0,
    left: 0,
    opacity: 0.5,
  },
});

export default FotoItem;
