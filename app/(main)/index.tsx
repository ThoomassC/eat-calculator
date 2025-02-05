import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const HomeScreen = () => {
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const mediaDir = FileSystem.documentDirectory + "media/";
      const files = await FileSystem.readDirectoryAsync(mediaDir);

      const filesWithInfo = await Promise.all(
        files.map(async (file) => {
          const info = await FileSystem.getInfoAsync(mediaDir + file);
          if (info.exists) {
            return {
              uri: mediaDir + file,
              creationTime: info.modificationTime,
            };
          }
          return null;
        })
      );

      const validFiles = filesWithInfo.filter((file) => file !== null);
      validFiles.sort((a, b) => a.creationTime - b.creationTime);

      setMediaFiles(validFiles.map((file) => file.uri));
    })();
  }, []);

  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity onPress={() => router.push(`/detail?file=${item}`)}>
      <Image source={{ uri: item }} style={styles.media} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={mediaFiles}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        numColumns={3}
      />
      <TouchableOpacity
        style={styles.captureButton}
        onPress={() => router.push("/camera")}
      >
        <Ionicons name="camera" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 32,
    textAlign: "center",
  },
  media: {
    width: 100,
    height: 100,
    margin: 5,
  },
  captureButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#87CEEB",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});
