import React from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useMeals } from "../../context/MealsContext";
import MealForm from "../../components/MealForm";
import { Alert } from "react-native";

const AddMealScreen = () => {
  const { scannedFood, existingItems } = useLocalSearchParams();
  const { addMeal } = useMeals();
  const router = useRouter();

  const initialMeal = { name: "", image: null, items: [] };

  const handleAddMeal = (newMeal: {
    name: string;
    image: string | null;
    items: any[];
  }) => {
    addMeal(newMeal);
    Alert.alert("Succès", "Repas ajouté avec succès !");
    router.push("/");
  };

  return (
    <MealForm
      initialMeal={initialMeal}
      existingItems={existingItems}
      scannedFood={scannedFood}
      onSubmit={handleAddMeal}
      labelButton="Ajouter"
    />
  );
};

export default AddMealScreen;
