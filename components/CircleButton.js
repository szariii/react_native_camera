import { TouchableOpacity, Image } from "react-native";
const CircleButton = ({ width, height, path, action }) => {
  let file = "";
  if (path === "return") {
    file = require("../assets/img/return.png");
  } else if (path === "plus") {
    file = require("../assets/img/plus.png");
  } else if (path === "settings") {
    file = require("../assets/img/settings.png");
  }

  return (
    <TouchableOpacity onPress={action}>
      <Image
        style={{
          width: width,
          height: height,
          backgroundColor: "#FFFFFF",
          borderRadius: width,
          opacity: 0.5,
        }}
        source={file}
      />
    </TouchableOpacity>
  );
};

export default CircleButton;
