import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useMeals } from "../../context/MealsContext";

const AddMealScreen = () => {
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const router = useRouter();
  const { addMeal } = useMeals();

  const handleAddMeal = () => {
    if (name && calories) {
      const newMeal = { id: Date.now(), name, calories: parseInt(calories) };
      addMeal(newMeal);
      Alert.alert("Succès", "Repas ajouté avec succès !");
      router.push("/");
    } else {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
    }
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
      <Button title="Ajouter" onPress={handleAddMeal} />
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
});
