import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  Text,
  FlatList,
  TouchableHighlight,
} from "react-native";
import { useRouter } from "expo-router";
import { useMeals } from "../../context/MealsContext";
import * as ImagePicker from "expo-image-picker";

const AddMealScreen = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [mealItems, setMealItems] = useState<any[]>([]);
  const router = useRouter();
  const { addMeal } = useMeals();

  const handleAddMeal = () => {
    if (!name.trim()) {
      Alert.alert("Erreur", "Veuillez entrer un nom pour le repas.");
      return;
    }

    if (mealItems.length === 0) {
      Alert.alert("Erreur", "Veuillez ajouter au moins un aliment.");
      return;
    }

    const newMeal = {
      id: Date.now(),
      name,
      calories: mealItems.reduce(
        (total, item) => total + item.calories * item.quantity,
        0
      ),
      image,
      items: mealItems,
    };
    addMeal(newMeal);
    Alert.alert("Succès", "Repas ajouté avec succès !");
    router.push("/");
  };

  const addMealItem = (food: any) => {
    const exists = mealItems.some((item) => item.name === food.food.label);
    if (exists) {
      Alert.alert("Erreur", "Cet aliment est déjà ajouté.");
      return;
    }

    const newItem = {
      id: Date.now(),
      name: food.food.label,
      calories: food.food.nutrients.ENERC_KCAL,
      image: food.food.image,
      quantity: 1,
    };
    setMealItems([...mealItems, newItem]);
    setSearchResults([]);
  };

  const updateQuantity = (id: number, increment: boolean) => {
    setMealItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: increment
                ? item.quantity + 1
                : Math.max(1, item.quantity - 1),
            }
          : item
      )
    );
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const searchFood = async () => {
    const response = await fetch(
      `https://api.edamam.com/api/food-database/v2/parser?ingr=${searchQuery}&app_id=${process.env.EXPO_PUBLIC_API_EDAMAM_ID}&app_key=${process.env.EXPO_PUBLIC_API_EDAMAM_KEY}`
    );
    const data = await response.json();
    setSearchResults(data.hints);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nom du repas"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Rechercher un aliment"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Rechercher" onPress={searchFood} />
      <FlatList
        data={searchResults}
        renderItem={({ item }) => (
          <TouchableHighlight onPress={() => addMealItem(item)}>
            <View style={styles.searchResultItem}>
              <Image
                source={{ uri: item.food.image }}
                style={styles.searchResultImage}
              />
              <View style={styles.searchResultText}>
                <Text>
                  {item.food.label} - {item.food.nutrients.ENERC_KCAL} kcal
                </Text>
              </View>
            </View>
          </TouchableHighlight>
        )}
        keyExtractor={(item) => item.food.foodId}
      />
      <FlatList
        data={mealItems}
        renderItem={({ item }) => (
          <View style={styles.mealItem}>
            <Image source={{ uri: item.image }} style={styles.mealImage} />
            <View style={styles.mealInfo}>
              <Text>
                {item.name} - {item.calories * item.quantity} kcal
              </Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  onPress={() => updateQuantity(item.id, false)}
                >
                  <Text style={styles.quantityButton}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => updateQuantity(item.id, true)}>
                  <Text style={styles.quantityButton}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Text style={styles.imagePickerText}>Ajouter une photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.imagePicker} onPress={takePhoto}>
          <Text style={styles.imagePickerText}>Prendre une photo</Text>
        </TouchableOpacity>
      </View>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Ajouter le repas" onPress={handleAddMeal} />
      <Button
        title="Scanner un code-barres"
        onPress={() => router.push("/camera")}
      />
    </View>
  );
};

export default AddMealScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  imagePicker: {
    backgroundColor: "#87CEEB",
    padding: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  imagePickerText: {
    color: "white",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 12,
    alignSelf: "center",
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  searchResultImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  searchResultText: {
    flexDirection: "column",
  },
  mealItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  mealImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  mealInfo: {
    flex: 1,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    fontSize: 20,
    paddingHorizontal: 10,
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 10,
  },
});
