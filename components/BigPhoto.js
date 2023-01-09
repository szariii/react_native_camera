import {
  View,
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
  PanResponder,
  ActivityIndicator,
} from "react-native";
import * as Sharing from "expo-sharing";
import MyButton from "./MyButton";
import * as MediaLibrary from "expo-media-library";
import { useState, useRef } from "react";

import { manipulateAsync } from "expo-image-manipulator";

const BigPhoto = ({ route, navigation }) => {
  const cadr = useRef(null);
  const photo = useRef(null);
  const [showEdit, setShowEdit] = useState(false);
  const [startPosition, setStartPosition] = useState({
    x: -100,
    y: -100,
  });

  const [widthAndHeight, setWidthAndHeight] = useState({
    x: 0,
    y: 0,
  });

  const [tempPhoto, setTempPhoto] = useState(false);

  const [waiting, setWaiting] = useState(false);
  const [squareOpacity, setSquareOpacity] = useState(1);
  const [tempPhotoSizes, setTempPhotoSizes] = useState({ x: 0, y: 0 });

  const panResponder = useRef(
    PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => false,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: async (evt, gestureState) => {
        await photo.current.measure((x, y, width, height, pageX, pageY) => {
          let objStart = {
            x: gestureState.x0 - pageX,
            y: gestureState.y0 - pageY,
          };

          if (objStart.x < -5) {
            objStart.x = -5;
          }

          if (objStart.y < -5) {
            objStart.y = -5;
          }

          if (objStart.x > width + 5) {
            objStart.x = width + 5;
          }

          if (objStart.y > height + 5) {
            objStart.y = height + 5;
          }

          setStartPosition(objStart);
          setWidthAndHeight({
            x: 0,
            y: 0,
          });
        });
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!
        // gestureState.d{x,y} will be set to zero now
      },
      onPanResponderMove: async (evt, gestureState) => {
        await photo.current.measure((x, y, width, height, pageX, pageY) => {
          if (gestureState.dx !== 0) {
            let objStart = {};
            let objWidth = {};
            if (gestureState.dx < 0) {
              objStart.x = gestureState.x0 - pageX + gestureState.dx;
              objWidth.x = -gestureState.dx;
            } else {
              objStart.x = gestureState.x0 - pageX;
              objWidth.x = gestureState.dx;
            }

            if (gestureState.dy < 0) {
              objStart.y = gestureState.y0 - pageY + gestureState.dy;
              objWidth.y = -gestureState.dy;
            } else {
              objStart.y = gestureState.y0 - pageY;
              objWidth.y = gestureState.dy;
            }

            //Validation
            if (objStart.x < -5) {
              objStart.x = -5;
            }

            if (objWidth.x + objStart.x > width + 5) {
              objWidth.x = width - objStart.x + 5;
            }

            if (objStart.y < -5) {
              objStart.y = -5;
            }

            if (objWidth.y + objStart.y > height + 5) {
              objWidth.y = height - objStart.y + 5;
            }

            setWidthAndHeight(objWidth);
            setStartPosition(objStart);
          }
        });

        // The most recent move distance is gestureState.move{X,Y}
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    })
  ).current;

  const deletePhoto = async () => {
    await MediaLibrary.deleteAssetsAsync([id]);
    refreshGalleryFunction();
    navigation.goBack();
  };

  const sharePhoto = async () => {
    const boll = await Sharing.isAvailableAsync();
    Sharing.shareAsync(uri);
  };

  const editPhoto = () => {
    setShowEdit(true);
  };

  const cancelEdit = () => {
    setShowEdit(false);
  };

  const deleteSelected = () => {
    setStartPosition({
      x: -100,
      y: -100,
    });

    setWidthAndHeight({
      x: 1,
      y: 1,
    });
  };

  const goBack = () => {
    setTempPhoto(false);
    setSquareOpacity(1);
  };

  const { uri, id, refreshGalleryFunction, width, height } = route.params;

  const saveCopy = async () => {
    if (widthAndHeight.x > 0 && widthAndHeight.y > 0) {
      setWaiting(true);
      let ask = await MediaLibrary.requestPermissionsAsync();
      if (ask.granted) {
        await photo.current.measure(
          async (x, y, photoWidth, photoHeight, pageX, pageY) => {
            setSquareOpacity(0);
            const widthScale = width / photoWidth;
            const heightScale = height / photoHeight;

            const cropStartingPositionX = (startPosition.x + 5) * widthScale;
            const cropStartingPositionY = (startPosition.y + 5) * heightScale;
            const cropWidth = (widthAndHeight.x - 10) * widthScale;
            const cropHeight = (widthAndHeight.y - 10) * heightScale;

            const cropRegion = {
              x: cropStartingPositionX,
              y: cropStartingPositionY,
              width: cropWidth,
              height: cropHeight,
            };
            console.log(cropRegion);
            const manipResult = await manipulateAsync(uri, [
              {
                crop: {
                  height: cropHeight,
                  originX: cropStartingPositionX,
                  originY: cropStartingPositionY,
                  width: cropWidth,
                },
              },
            ]);
            setTempPhoto(manipResult.uri);
            setTempPhotoSizes({
              x: Math.round(cropWidth),
              y: Math.round(cropHeight),
            });

            await MediaLibrary.saveToLibraryAsync(manipResult.uri);

            await refreshGalleryFunction();
            setWaiting(false);
          }
        );
      } else {
        alert("Brak uprawnień");
      }
    } else {
      alert("Select place to crop");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#757575" }}>
      {showEdit ? (
        <View
          style={{
            flex: 4,
            width: Dimensions.get("window").width - 10,
            height: Dimensions.get("window").width / 1.5,
            margin: 5,
          }}
        >
          {tempPhoto ? (
            <Image
              style={{ flex: 1, resizeMode: "stretch" }}
              source={{ uri: tempPhoto }}
            />
          ) : (
            <Image
              style={{ flex: 1, resizeMode: "stretch" }}
              {...panResponder.panHandlers}
              source={{ uri: uri }}
              ref={photo}
            />
          )}
          {waiting ? (
            <View
              style={{
                position: "absolute",
                width: 200,
                height: 100,
                top: Dimensions.get("window").height / 2 - 50,
                left: Dimensions.get("window").width / 2 - 100,
                backgroundColor: "#C5CAE9",
              }}
            >
              <Text
                style={{
                  fontSize: 30,
                  textAlign: "center",
                }}
              >
                Saving photo
              </Text>
              <ActivityIndicator size="large" />
            </View>
          ) : (
            ""
          )}

          <TouchableOpacity
            onPressIn={deleteSelected}
            activeOpacity={1}
            ref={cadr}
            style={{
              position: "absolute",
              opacity: squareOpacity,
              borderWidth: 5,
              borderStyle: "solid",
              borderColor: "red",
              left: startPosition.x,
              top: startPosition.y,
              width: widthAndHeight.x,
              height: widthAndHeight.y,
            }}
          ></TouchableOpacity>
        </View>
      ) : (
        <>
          <Image
            style={{
              flex: 4,
              width: Dimensions.get("window").width - 10,
              height: Dimensions.get("window").width / 1.5,
              margin: 5,
              resizeMode: "stretch",
            }}
            source={{ uri: uri }}
          />
        </>
      )}

      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "stretch",
          justifyContent: "center",
        }}
      >
        {tempPhoto ? (
          <Text
            style={{
              alignSelf: "stretch",
              textAlign: "center",
              color: "white",
              fontSize: 40,
            }}
          >
            {tempPhotoSizes.y} X {tempPhotoSizes.x}
          </Text>
        ) : (
          <Text
            style={{
              alignSelf: "stretch",
              textAlign: "center",
              color: "white",
              fontSize: 40,
            }}
          >
            {height} X {width}
          </Text>
        )}
      </View>
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
        {showEdit ? (
          <>
            {tempPhoto ? (
              <MyButton text={"GO BACK"} action={goBack} />
            ) : (
              <>
                <MyButton text={"CANCEL"} action={cancelEdit} />
                <MyButton text={"SAVE COPY"} action={saveCopy} />
              </>
            )}
          </>
        ) : (
          <>
            <MyButton text={"SHARE"} action={sharePhoto} />
            <MyButton text={"EDIT"} action={editPhoto} />
            <MyButton text={"DELETE"} action={deletePhoto} />
          </>
        )}
      </View>
    </View>
  );
};

export default BigPhoto;
