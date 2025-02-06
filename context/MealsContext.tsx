import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MealsContext = createContext<any>(null);

export const MealsProvider = ({ children }: { children: React.ReactNode }) => {
  const [meals, setMeals] = useState<any[]>([]);

  useEffect(() => {
    const loadMeals = async () => {
      try {
        const storedMeals = await AsyncStorage.getItem("meals");
        if (storedMeals) {
          setMeals(JSON.parse(storedMeals));
        }
      } catch (error) {
        console.error("Failed to load meals from AsyncStorage", error);
      }
    };

    loadMeals();
  }, []);

  const addMeal = async (meal: any) => {
    try {
      const updatedMeals = [...meals, meal];
      setMeals(updatedMeals);
      await AsyncStorage.setItem("meals", JSON.stringify(updatedMeals));
    } catch (error) {
      console.error("Failed to add meal to AsyncStorage", error);
    }
  };

  const deleteMeal = async (id: number) => {
    try {
      const updatedMeals = meals.filter((meal) => meal.id !== id);
      setMeals(updatedMeals);
      await AsyncStorage.setItem("meals", JSON.stringify(updatedMeals));
    } catch (error) {
      console.error("Failed to delete meal from AsyncStorage", error);
    }
  };

  const updateMeal = async (updatedMeal: any) => {
    try {
      const updatedMeals = meals.map((meal) =>
        meal.id === updatedMeal.id ? updatedMeal : meal
      );
      setMeals(updatedMeals);
      await AsyncStorage.setItem("meals", JSON.stringify(updatedMeals));
    } catch (error) {
      console.error("Failed to update meal in AsyncStorage", error);
    }
  };

  const value = React.useMemo(
    () => ({ meals, addMeal, deleteMeal, updateMeal }),
    [meals]
  );

  return (
    <MealsContext.Provider value={value}>{children}</MealsContext.Provider>
  );
};

export const useMeals = () => useContext(MealsContext);
