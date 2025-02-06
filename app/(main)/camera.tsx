// import React, { useState, useEffect } from "react";
// import { View, Text, StyleSheet, Alert, Button } from "react-native";
// import { BarCodeScanner } from "expo-barcode-scanner";
// import { useRouter } from "expo-router";
// import { useMeals } from "../../context/MealsContext";

// const CameraScreen = () => {
//   const [hasPermission, setHasPermission] = useState<boolean | null>(null);
//   const [scanned, setScanned] = useState(false);
//   const router = useRouter();
//   const { addMeal } = useMeals();

//   useEffect(() => {
//     const getBarCodeScannerPermissions = async () => {
//       const { status } = await BarCodeScanner.requestPermissionsAsync();
//       setHasPermission(status === "granted");
//     };

//     getBarCodeScannerPermissions();
//   }, []);

//   const handleBarCodeScanned = async ({
//     type,
//     data,
//   }: {
//     type: string;
//     data: string;
//   }) => {
//     setScanned(true);

//     const API_KEY = process.env.EXPO_PUBLIC_API_EDAMAM_ID;
//     console.log("API_KEY", API_KEY);
//     const response = await fetch(
//       `https://api.edamam.com/api/food-database/v2/parser?upc=${data}&app_id=${process
//         .env.EXPO_PUBLIC_API_EDAMAM_ID!}&app_key=${process.env.EXPO_PUBLIC_API_EDAMAM_KEY!}`
//     );
//     const result = await response.json();
//     if (result.hints.length > 0) {
//       const food = result.hints[0].food;
//       const newMeal = {
//         id: Date.now(),
//         name: food.label,
//         calories: food.nutrients.ENERC_KCAL,
//         image: null,
//       };
//       addMeal(newMeal);
//       Alert.alert("Succès", "Repas ajouté avec succès !");
//       router.push("/");
//     } else {
//       Alert.alert("Erreur", "Produit non reconnu.");
//       setScanned(false);
//     }
//   };

//   if (hasPermission === null) {
//     return <Text>Demande de permission de la caméra</Text>;
//   }
//   if (hasPermission === false) {
//     return <Text>Accès à la caméra refusé</Text>;
//   }

//   return (
//     <View style={styles.container}>
//       <BarCodeScanner
//         onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
//         style={StyleSheet.absoluteFillObject}
//       />
//       {scanned && (
//         <Button title="Scanner à nouveau" onPress={() => setScanned(false)} />
//       )}
//     </View>
//   );
// };

// export default CameraScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });
