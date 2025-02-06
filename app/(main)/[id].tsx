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
            <Image source={{ uri: item.image }} style={styles.foodImage} />
            <Text style={styles.foodName}>{item.name}</Text>
            <Text style={styles.foodCalories}>
              {item.calories * item.quantity} kcal
            </Text>
            <Text>Quantité: {item.quantity}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={confirmDelete}>
          <Ionicons name="trash" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  mealImage: {
    width: 200,
    height: 200,
    marginBottom: 12,
  },
  mealName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  mealCalories: {
    fontSize: 20,
    color: "#888",
    marginVertical: 8,
  },
  foodItem: {
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  foodImage: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  foodName: {
    fontSize: 18,
  },
  foodCalories: {
    fontSize: 16,
    color: "#888",
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
