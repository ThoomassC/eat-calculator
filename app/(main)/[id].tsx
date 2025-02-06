import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  FlatList,
  Modal,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useMeals } from "../../context/MealsContext";

const DetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [meal, setMeal] = useState<any>(null);
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [foodDetails, setFoodDetails] = useState<any>(null);
  const router = useRouter();
  const { meals, deleteMeal } = useMeals();

  useEffect(() => {
    const meal = meals.find((meal: any) => meal.id === parseInt(id as string));
    setMeal(meal);
  }, [id, meals]);

  const confirmDelete = () => {
    Alert.alert(
      "Confirmer la suppression",
      "Êtes-vous sûr de vouloir supprimer ce repas ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            deleteMeal(parseInt(id as string));
            Alert.alert("Succès", "Repas supprimé avec succès !");
            router.push("/");
          },
        },
      ]
    );
  };

  const fetchFoodDetails = async (food: any) => {
    try {
      const response = await fetch(
        `https://api.edamam.com/api/food-database/v2/parser?ingr=${food.name}&app_id=${process.env.EXPO_PUBLIC_API_EDAMAM_ID}&app_key=${process.env.EXPO_PUBLIC_API_EDAMAM_KEY}`
      );
      const data = await response.json();
      const foodData = data.hints[0].food.nutrients;
      setFoodDetails({
        calories: foodData.ENERC_KCAL * food.quantity,
        proteins: foodData.PROCNT * food.quantity,
        carbs: foodData.CHOCDF * food.quantity,
        fats: foodData.FAT * food.quantity,
      });
    } catch (error) {
      console.error("Failed to fetch food details", error);
    }
  };

  const openModal = (food: any) => {
    setSelectedFood(food);
    fetchFoodDetails(food);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedFood(null);
    setFoodDetails(null);
    setModalVisible(false);
  };

  if (!meal) {
    return null;
  }

  return (
    <View style={styles.container}>
      {meal.image && (
        <Image source={{ uri: meal.image }} style={styles.mealImage} />
      )}
      <Text style={styles.mealName}>{meal.name}</Text>
      <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
      <FlatList
        data={meal.items}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openModal(item)}>
            <View style={styles.foodItem}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.foodImage} />
              ) : (
                <Ionicons
                  name="image-outline"
                  size={50}
                  color="#ccc"
                  style={styles.defaultFoodImage}
                />
              )}
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={styles.foodCalories}>
                  {item.calories * item.quantity} kcal
                </Text>
                <Text style={styles.foodQuantity}>
                  Quantité: {item.quantity}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={confirmDelete}>
          <Ionicons name="trash" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {selectedFood && foodDetails && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {selectedFood.name} x{selectedFood.quantity}
              </Text>
              <Text>Calories: {foodDetails.calories} kcal</Text>
              <View style={styles.chipsContainer}>
                <View style={[styles.chip, styles.proteinChip]}>
                  <Text style={styles.chipText}>
                    Protéines: {foodDetails.proteins} g
                  </Text>
                </View>
                <View style={[styles.chip, styles.carbChip]}>
                  <Text style={styles.chipText}>
                    Glucides: {foodDetails.carbs} g
                  </Text>
                </View>
                <View style={[styles.chip, styles.fatChip]}>
                  <Text style={styles.chipText}>
                    Lipides: {foodDetails.fats} g
                  </Text>
                </View>
              </View>
              {selectedFood.image ? (
                <Image
                  source={{ uri: selectedFood.image }}
                  style={styles.modalImage}
                />
              ) : (
                <Ionicons
                  name="image-outline"
                  size={100}
                  color="#ccc"
                  style={styles.defaultModalImage}
                />
              )}
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  mealImage: {
    width: 200,
    height: 200,
    marginBottom: 12,
    borderRadius: 8,
    alignSelf: "center",
  },
  mealName: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  mealCalories: {
    fontSize: 20,
    color: "#888",
    marginVertical: 8,
    textAlign: "center",
  },
  listContent: {
    paddingBottom: 80,
  },
  foodItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#4CAF50",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  foodImage: {
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
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  foodCalories: {
    fontSize: 16,
    color: "#888",
    marginTop: 4,
  },
  foodQuantity: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    padding: 20,
  },
  button: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 350,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  chipsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    width: "100%",
    marginVertical: 10,
  },
  chip: {
    padding: 8,
    borderRadius: 16,
    margin: 4,
    maxWidth: "45%",
    flexDirection: "row",
    alignItems: "center",
  },
  proteinChip: {
    backgroundColor: "#FFCDD2",
  },
  carbChip: {
    backgroundColor: "#C8E6C9",
  },
  fatChip: {
    backgroundColor: "#BBDEFB",
  },
  chipText: {
    fontSize: 14,
    color: "#333",
  },
  modalImage: {
    width: 100,
    height: 100,
    marginVertical: 10,
    borderRadius: 8,
  },
  defaultModalImage: {
    width: 100,
    height: 100,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DetailScreen;
