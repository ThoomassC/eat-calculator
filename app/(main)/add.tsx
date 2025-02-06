import React, { useState, useEffect } from "react";
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
  const [calories, setCalories] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const router = useRouter();
  const { addMeal } = useMeals();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        searchFood();
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleAddMeal = () => {
    if (name && calories) {
      const newMeal = {
        id: Date.now(),
        name,
        calories: parseInt(calories),
        image,
      };
      addMeal(newMeal);
      Alert.alert("Succès", "Repas ajouté avec succès !");
      router.push("/");
    } else {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
    }
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

  const handleSelectFood = (food: any) => {
    setName(food.food.label);
    setCalories(food.food.nutrients.ENERC_KCAL.toString());
    setSearchResults([]);
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
        placeholder="Calories"
        value={calories}
        onChangeText={setCalories}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Rechercher un aliment"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={searchResults}
        renderItem={({ item }) => (
          <TouchableHighlight onPress={() => handleSelectFood(item)}>
            <View style={styles.searchResultItem}>
              <Image
                source={{ uri: item.food.image }}
                style={styles.searchResultImage}
              />
              <Text>{item.food.label}</Text>
            </View>
          </TouchableHighlight>
        )}
        keyExtractor={(item) => item.food.foodId}
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
      <Button title="Ajouter" onPress={handleAddMeal} />
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
});
