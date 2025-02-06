import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  Text,
  FlatList,
  TouchableHighlight,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useMeals } from "../../context/MealsContext";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

const EditMealScreen = () => {
  const {
    meal: mealParam,
    scannedFood,
    existingItems,
  } = useLocalSearchParams();
  let initialMeal;
  try {
    initialMeal = mealParam
      ? JSON.parse(mealParam as string)
      : { name: "", image: null, items: [] };
  } catch (error) {
    console.error("Failed to parse mealParam", error);
    initialMeal = { name: "", image: null, items: [] };
  }
  const [name, setName] = useState(initialMeal.name);
  const [image, setImage] = useState<string | null>(initialMeal.image);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [mealItems, setMealItems] = useState<any[]>(initialMeal.items);
  const router = useRouter();
  const { updateMeal } = useMeals();

  useEffect(() => {
    if (existingItems) {
      setMealItems(
        JSON.parse(
          Array.isArray(existingItems) ? existingItems[0] : existingItems
        )
      );
    }
    if (scannedFood) {
      try {
        const food = JSON.parse(
          Array.isArray(scannedFood) ? scannedFood[0] : scannedFood
        );
        addMealItem(food);
      } catch (error) {
        console.error("Failed to parse scannedFood", error);
      }
    }
  }, [scannedFood, existingItems]);

  const handleUpdateMeal = () => {
    if (!name.trim()) {
      Alert.alert("Erreur", "Veuillez entrer un nom pour le repas.");
      return;
    }

    if (mealItems.length === 0) {
      Alert.alert("Erreur", "Veuillez ajouter au moins un aliment.");
      return;
    }

    const updatedMeal = {
      ...initialMeal,
      name,
      calories: mealItems.reduce(
        (total, item) => total + item.calories * item.quantity,
        0
      ),
      image,
      items: mealItems,
    };
    updateMeal(updatedMeal);
    Alert.alert("Succès", "Repas modifié avec succès !");
    router.push("/");
  };

  const addMealItem = (food: any) => {
    const exists = mealItems.some((item) => item.name === food.food.label);
    if (exists) {
      Alert.alert("Erreur", "Cet aliment est déjà ajouté.");
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      name: food.food.label,
      calories: food.food.nutrients.ENERC_KCAL,
      image: food.food.image,
      quantity: 1,
    };
    setMealItems((prevItems) => [...prevItems, newItem]);
    setSearchResults([]);
  };

  const removeMealItem = (id: string) => {
    setMealItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, increment: boolean) => {
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
    const filteredResults = data.hints.filter(
      (item: any) =>
        !mealItems.some((mealItem) => mealItem.name === item.food.label)
    );
    setSearchResults(filteredResults);
  };

  const clearSearch = () => {
    setSearchQuery("");
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
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un aliment"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Ionicons name="close-circle" size={24} color="#ccc" />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity style={styles.searchButton} onPress={searchFood}>
          <Text style={styles.searchButtonText}>Rechercher</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() =>
            router.push({
              pathname: "/camera",
              params: {
                returnTo: "edit",
                existingItems: JSON.stringify(mealItems),
              },
            })
          }
        >
          <Ionicons name="barcode-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      {searchResults.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>Suggestions</Text>
          <FlatList
            data={searchResults}
            renderItem={({ item, index }) => (
              <TouchableHighlight onPress={() => addMealItem(item)}>
                <View style={styles.searchResultItem}>
                  {item.food.image ? (
                    <Image
                      source={{ uri: item.food.image }}
                      style={styles.searchResultImage}
                    />
                  ) : (
                    <Ionicons
                      name="image-outline"
                      size={50}
                      color="#ccc"
                      style={styles.searchResultImage}
                    />
                  )}
                  <View style={styles.searchResultText}>
                    <Text>
                      {item.food.label} - {item.food.nutrients.ENERC_KCAL} kcal
                    </Text>
                  </View>
                </View>
              </TouchableHighlight>
            )}
            keyExtractor={(item, index) => `${item.food.foodId}-${index}`}
            style={styles.flatList}
          />
        </>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Aliments choisis</Text>
          <FlatList
            data={mealItems}
            renderItem={({ item }) => (
              <View style={styles.mealItem}>
                {item.image ? (
                  <Image
                    source={{ uri: item.image }}
                    style={styles.mealImage}
                  />
                ) : (
                  <Ionicons
                    name="image-outline"
                    size={50}
                    color="#ccc"
                    style={styles.defaultFoodImage}
                  />
                )}
                <View style={styles.mealInfo}>
                  <Text>
                    {item.name} - {item.calories * item.quantity} kcal
                  </Text>
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      onPress={() => updateQuantity(item.id, false)}
                      style={styles.quantityIcon}
                    >
                      <Ionicons
                        name="remove-circle-outline"
                        size={24}
                        color="orange"
                      />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity
                      onPress={() => updateQuantity(item.id, true)}
                      style={styles.quantityIcon}
                    >
                      <Ionicons
                        name="add-circle-outline"
                        size={24}
                        color="orange"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => removeMealItem(item.id)}
                >
                  <Ionicons name="trash" size={24} color="red" />
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
            style={[styles.flatList, styles.mealList]}
          />
        </>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Text style={styles.imagePickerText}>Ajouter une photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.imagePicker} onPress={takePhoto}>
          <Text style={styles.imagePickerText}>Prendre une photo</Text>
        </TouchableOpacity>
      </View>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <TouchableOpacity style={styles.addButton} onPress={handleUpdateMeal}>
        <Text style={styles.addButtonText}>Modifier le repas</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditMealScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  clearButton: {
    marginLeft: 8,
  },
  searchButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  scanButton: {
    backgroundColor: "#FF5722",
    padding: 9,
    borderRadius: 8,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 16,
  },
  flatList: {
    marginBottom: 12,
  },
  mealList: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
    marginTop: 12,
  },
  imagePicker: {
    backgroundColor: "#2196F3",
    padding: 10,
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 12,
  },
  imagePickerText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 12,
    alignSelf: "center",
    borderRadius: 8,
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#000",
  },
  searchResultImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 8,
  },
  searchResultText: {
    flexDirection: "column",
  },
  mealItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  mealImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 8,
  },
  defaultFoodImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  mealInfo: {
    flex: 1,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityIcon: {
    marginHorizontal: 4,
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  deleteButton: {
    marginLeft: 8,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
