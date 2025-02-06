import React from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useMeals } from "../../context/MealsContext";
import MealForm from "../../components/MealForm";
import { Alert } from "react-native";

const EditMealScreen = () => {
  const {
    meal: mealParam,
    scannedFood,
    existingItems,
  } = useLocalSearchParams();
  const { updateMeal } = useMeals();
  const router = useRouter();

  let initialMeal;
  try {
    initialMeal = mealParam
      ? JSON.parse(mealParam as string)
      : { name: "", image: null, items: [] };
  } catch (error) {
    console.error("Failed to parse mealParam", error);
    initialMeal = { name: "", image: null, items: [] };
  }

  const handleUpdateMeal = (updatedMeal: any) => {
    updateMeal(updatedMeal);
    Alert.alert("Succès", "Repas modifié avec succès !");
    router.push("/");
  };

  return (
    <MealForm
      initialMeal={initialMeal}
      existingItems={existingItems}
      scannedFood={scannedFood}
      onSubmit={handleUpdateMeal}
      labelButton="Modifier"
    />
  );
};

export default EditMealScreen;
