import {
  View,
  Dimensions,
  ToastAndroid,
  FlatList,
  SafeAreaView,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";

import MyButton from "./MyButton";
import FotoItem from "./FotoItem";

const Gallery = ({ navigation }) => {
  //const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [permmision, setPermission] = useState(true);
  const [photoInfo, setPhotoInfo] = useState([]);
  const [layout, setLayout] = useState("grid");
  const [stylePhotoInfo, setStylePhotoInfo] = useState({
    columns: 5,
    width: Dimensions.get("window").width / 5 - 10,
    height: Dimensions.get("window").width / 5 - 10,
  });
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  useEffect(() => {
    takePhotos();
  }, []);

  const deletePhotos = async () => {
    await MediaLibrary.deleteAssetsAsync(selectedPhotos);
    refreshGalleryFunction();
  };

  const refreshGalleryFunction = async () => {
    const album = await MediaLibrary.getAlbumAsync("DCIM");
    let obj = await MediaLibrary.getAssetsAsync({
      album: album,
      first: 100, // ilość pobranych assetów
      mediaType: "photo", // typ pobieranych danych, photo jest domyślne
      sortBy: "creationTime",
    });

    setPhotoInfo(obj.assets);
  };

  const takePhotos = async () => {
    let { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      alert("brak uprawnień do czytania image-ów z galerii");
      setPermission(false);
    } else {
      const album = await MediaLibrary.getAlbumAsync("DCIM");
      let obj = await MediaLibrary.getAssetsAsync({
        album: album,
        first: 100, // ilość pobranych assetów
        mediaType: "photo", // typ pobieranych danych, photo jest domyślne
        sortBy: "creationTime",
      });

      setPhotoInfo(obj.assets);
    }
  };

  const layoutClickHandler = () => {
    if (layout === "grid") {
      setStylePhotoInfo({
        columns: 1,
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height / 5 - 10,
      });
      setLayout("list");
    } else {
      setStylePhotoInfo({
        columns: 5,
        width: Dimensions.get("window").width / 5 - 10,
        height: Dimensions.get("window").width / 5 - 10,
      });

      setLayout("grid");
    }
  };

  const cameraClickHandler = () => {
    navigation.navigate("camera", {
      refreshGalleryFunction: refreshGalleryFunction,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <MyButton text={"LAYOUT"} action={layoutClickHandler} />
        <MyButton text={"CAMERA"} action={cameraClickHandler} />
        <MyButton text={"DELETE"} action={deletePhotos} />
      </View>
      <View style={{ flex: 10 }}>
        {permmision === false ? (
          <View style={{ flex: 1 }}>
            <Text>Brak Uprawnień</Text>
          </View>
        ) : (
          <FlatList
            numColumns={stylePhotoInfo.columns}
            key={stylePhotoInfo.columns}
            data={photoInfo}
            renderItem={({ item }) => (
              <FotoItem
                selectedPhotos={selectedPhotos}
                setSelectedPhotos={setSelectedPhotos}
                uri={item.uri}
                id={item.id}
                width={stylePhotoInfo.width}
                height={stylePhotoInfo.height}
                navigation={navigation}
                refreshGalleryFunction={refreshGalleryFunction}
                startingValue={selectedPhotos.includes(item.id) ? true : false}
                sourceWidth={item.width}
                sourceHeight={item.height}
              />
            )}
          />
        )}
      </View>
    </View>
  );
};

export default Gallery;
