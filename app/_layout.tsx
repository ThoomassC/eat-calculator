import React, { useEffect } from "react";
import { View, StyleSheet, LogBox } from "react-native";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import Header from "./header";
import { Slot } from "expo-router";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import { tokenCache } from "../libs/cache";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Il manque la clé de publication. Veuillez définir EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY dans votre .env"
  );
}

// Ignore la barre d'erreur en bas de l'application
// (Obligatoire car s'il existe une erreur elle s'affichera quand même)
LogBox.ignoreAllLogs(true);

const Layout = () => {
  useEffect(() => {
    (async () => {
      const { status: cameraStatus } =
        await Camera.requestCameraPermissionsAsync();
      const { status: mediaLibraryStatus } =
        await MediaLibrary.requestPermissionsAsync();
      if (cameraStatus !== "granted" || mediaLibraryStatus !== "granted") {
        alert(
          "Désolé les permissions de la caméra et de la bibliothèque de médias sont nécessaires pour utiliser cette application."
        );
      }
    })();
  }, []);

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <View style={styles.container}>
          <Header />
          <Slot />
        </View>
      </ClerkLoaded>
    </ClerkProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Layout;
