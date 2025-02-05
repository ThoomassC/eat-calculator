import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getMealById, deleteMeal } from "../../libs/database";

const DetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [meal, setMeal] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      getMealById(parseInt(id as string), (meal: any) => {
        setMeal(meal);
      });
    }
  }, [id]);

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
      <Text style={styles.mealName}>{meal.name}</Text>
      <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
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
  mealName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  mealCalories: {
    fontSize: 20,
    color: "#888",
    marginVertical: 8,
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
