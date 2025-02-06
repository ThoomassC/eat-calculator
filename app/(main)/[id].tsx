import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  FlatList,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useMeals } from "../../context/MealsContext";

const DetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [meal, setMeal] = useState<any>(null);
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
              <Text style={styles.foodQuantity}>Quantité: {item.quantity}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={confirmDelete}>
          <Ionicons name="trash" size={24} color="white" />
        </TouchableOpacity>
      </View>
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
});

export default DetailScreen;
