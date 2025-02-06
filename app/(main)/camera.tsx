import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, Button } from "react-native";
import { Camera, CameraView } from "expo-camera";
import { useRouter, useLocalSearchParams } from "expo-router";

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const router = useRouter();
  const { returnTo, existingItems } = useLocalSearchParams();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    setScanned(true);

    try {
      const response = await fetch(
        `https://api.edamam.com/api/food-database/v2/parser?upc=${data}&app_id=${process.env.EXPO_PUBLIC_API_EDAMAM_ID}&app_key=${process.env.EXPO_PUBLIC_API_EDAMAM_KEY}`
      );
      const result = await response.json();

      if (result.hints && result.hints.length > 0) {
        const food = result.hints[0];

        const updatedItems = existingItems
          ? JSON.parse(
              Array.isArray(existingItems) ? existingItems[0] : existingItems
            )
          : [];

        updatedItems.push({
          id: Date.now().toString(), // Assurez-vous que l'id est une chaîne
          name: food.food.label,
          calories: food.food.nutrients.ENERC_KCAL || 0, // Assurez-vous que les calories sont définies
          image: food.food.image,
          quantity: 1, // Ajoutez la quantité ici
        });
        router.push({
          pathname: returnTo === "edit" ? "/edit" : "/add",
          params: {
            scannedFood: JSON.stringify(food),
            existingItems: JSON.stringify(updatedItems),
          },
        });
      } else {
        Alert.alert("Erreur", "Aucun aliment trouvé pour ce code-barres.");
        setScanned(false);
      }
    } catch (error) {
      console.error("Failed to fetch food data:", error);
      Alert.alert(
        "Erreur",
        "Une erreur s'est produite lors de la récupération des données."
      );
      setScanned(false);
    }
  };

  if (hasPermission === null) {
    return <Text>Demande de permission pour accéder à la caméra</Text>;
  }
  if (hasPermission === false) {
    return <Text>Accès à la caméra refusé</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{
          barcodeTypes: [
            "ean13",
            "ean8",
            "upc_a",
            "upc_e",
            "code39",
            "code93",
            "code128",
            "qr",
            "pdf417",
            "aztec",
            "datamatrix",
            "itf14",
            "codabar",
          ],
        }}
      />
      {scanned && (
        <Button title="Scanner à nouveau" onPress={() => setScanned(false)} />
      )}
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
