import React from "react";
import { View, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Ionicons } from "@expo/vector-icons";

const DetailScreen = () => {
  const { file } = useLocalSearchParams();
  const router = useRouter();

  const deleteFile = async () => {
    if (typeof file === "string") {
      try {
        await FileSystem.deleteAsync(file);
        Alert.alert("Succès", "Fichier supprimé avec succès !");
        router.push("/");
      } catch (error) {
        Alert.alert("Erreur", "Échec de la suppression du fichier.");
      }
    }
  };

  const downloadFile = async () => {
    if (typeof file === "string") {
      try {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission refusée",
            "Nous avons besoin des permissions de la galerie pour enregistrer le fichier !"
          );
          return;
        }

        const asset = await MediaLibrary.createAssetAsync(file);
        await MediaLibrary.createAlbumAsync("Download", asset, false);
        Alert.alert("Succès", "Fichier enregistré dans la galerie !");
      } catch (error) {
        Alert.alert("Erreur", "Échec de l'enregistrement du fichier.");
      }
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Confirmer la suppression",
      "Êtes-vous sûr de vouloir supprimer ce fichier ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            deleteFile();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {typeof file === "string" && (
        <>
          <Image source={{ uri: file }} style={styles.media} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/")}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={confirmDelete}>
              <Ionicons name="trash" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={downloadFile}>
              <Ionicons name="download" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  media: {
    width: "100%",
    height: "80%",
    resizeMode: "contain",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    padding: 20,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
});

export default DetailScreen;
