import { Camera, CameraType, FlashMode } from "expo-camera";
import { useState, useRef, useEffect } from "react";
import * as MediaLibrary from "expo-media-library";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Animated,
  ScrollView,
} from "react-native";

import CircleButton from "./CircleButton";

import { BackHandler } from "react-native";

import RadioGroup from "./RadioGroup";

const CameraScreen = ({ route, navigation }) => {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const cameraEl = useRef(null);
  const { refreshGalleryFunction } = route.params;

  const [position, setPosition] = useState(new Animated.Value(800));
  const [hidden, setHidden] = useState(true);

  const [cameraReady, setCameraReady] = useState(false);

  const [whiteBalance, setWhiteBalance] = useState();
  const [whiteBalanceArray, setWhiteBalanceArray] = useState({});

  const [flashMode, setFlashMode] = useState();
  const [flashModeArray, setFlashModeArray] = useState([]);

  const [ratios, setRatios] = useState("4:3");
  const [ratioArray, setRatioArray] = useState([
    { valueName: "4:3", value: "4:3" },
    { valueName: "16:9", value: "16:9" },
  ]);

  const [pictureSize, setPictureSize] = useState();
  const [pictureSizeArray, setPictureSizeArray] = useState([]);

  const toggle = () => {
    let toPos = 800;
    if (hidden) {
      toPos = 0;
    }

    //animacja

    Animated.spring(position, {
      toValue: toPos,
      velocity: 1,
      tension: 0,
      friction: 10,
      useNativeDriver: true,
    }).start();

    //this.isHidden = !this.isHidden;
    setHidden(!hidden);
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackPress);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    };
  }, [hidden]);

  const handleBackPress = () => {
    //tutaj wywołanie funkcji odświeżającej gallery, przekazanej w props-ach
    //...
    if (hidden === false) {
      toggle();
    } else {
      refreshGalleryFunction();
      //powrót do ekranu poprzedniego
      navigation.goBack();
    }
    return true;
  };

  if (!permission) {
    requestPermission();
  }
  //   if (!permission.granted) {
  //   }

  const takePhotoHandler = async () => {
    let foto = await cameraEl.current.takePictureAsync();
    let asset = await MediaLibrary.createAssetAsync(foto.uri); // domyślnie zapisuje w folderze DCIM
  };

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        onCameraReady={() => {
          const cameraWhiteBalance = Camera.Constants.WhiteBalance;
          const whiteBalanceArrayTemp = [];
          for (let key of Object.keys(cameraWhiteBalance)) {
            const json = { valueName: key, value: cameraWhiteBalance[key] };
            whiteBalanceArrayTemp.push(json);
          }
          setWhiteBalance(whiteBalanceArrayTemp[0].value);
          setWhiteBalanceArray(whiteBalanceArrayTemp);

          const cameraFlashMode = Camera.Constants.FlashMode;
          const flashModeArrayTemp = [];
          for (let key of Object.keys(cameraFlashMode)) {
            const json = { valueName: key, value: cameraFlashMode[key] };
            flashModeArrayTemp.push(json);
          }
          setFlashMode(flashModeArrayTemp[0].value);
          setFlashModeArray(flashModeArrayTemp);

          const getSizes = async () => {
            if (cameraEl) {
              const sizes =
                await cameraEl.current.getAvailablePictureSizesAsync(ratios);
              const sizesArrayTemp = [];
              sizes.forEach((ele) => {
                sizesArrayTemp.push({ valueName: ele, value: ele });
              });
              setPictureSize(sizesArrayTemp[0].value);
              setPictureSizeArray(sizesArrayTemp);
            }
          };

          getSizes();

          setCameraReady(true);
        }}
        whiteBalance={whiteBalance}
        flashMode={flashMode}
        type={type}
        ref={cameraEl}
        ratio={ratios}
        pictureSize={pictureSize}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "space-around",
            marginBottom: 20,
          }}
        >
          <CircleButton
            width={50}
            height={50}
            path="return"
            action={toggleCameraType}
          />

          <CircleButton
            width={80}
            height={80}
            path="plus"
            action={takePhotoHandler}
          />

          <CircleButton
            width={50}
            height={50}
            path="settings"
            action={toggle}
          />
        </View>
      </Camera>
      <Animated.View
        style={[
          styles.animatedView,
          {
            transform: [{ translateY: position }],
          },
        ]}
      >
        {cameraReady === true ? (
          <ScrollView style={{ flex: 1 }}>
            <Text style={styles.settingsText}>Settings</Text>
            <RadioGroup
              title="WHITE BALANCE"
              setState={setWhiteBalance}
              state={whiteBalance}
              data={whiteBalanceArray}
            />
            <RadioGroup
              title="FLASH MODE"
              setState={setFlashMode}
              state={flashMode}
              data={flashModeArray}
            />
            <RadioGroup
              title="CAMERA RATIO"
              setState={setRatios}
              state={ratios}
              data={ratioArray}
            />

            <RadioGroup
              title="PICTURE SIZES"
              setState={setPictureSize}
              state={pictureSize}
              data={pictureSizeArray}
            />
          </ScrollView>
        ) : (
          ""
        )}
      </Animated.View>
    </View>
  );
};

let styles = StyleSheet.create({
  animatedView: {
    position: "absolute",
    top: 0,
    //bottom: 0,
    left: 0,
    //right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    height: "110%",
    width: "50%",
    zIndex: 5,
    marginBottom: "-40%",
  },

  settingsText: {
    fontSize: 40,
    marginTop: 50,
    marginLeft: 10,
    color: "#FFFFFF",
    opacity: 1,
  },
});

export default CameraScreen;
