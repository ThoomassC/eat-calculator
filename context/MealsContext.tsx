import React, { createContext, useState, useContext } from "react";

const MealsContext = createContext<any>(null);

export const MealsProvider = ({ children }: { children: React.ReactNode }) => {
  const [meals, setMeals] = useState<any[]>([]);

  const addMeal = (meal: any) => {
    setMeals([...meals, meal]);
  };

  const deleteMeal = (id: number) => {
    setMeals(meals.filter((meal) => meal.id !== id));
  };

  const value = React.useMemo(() => ({ meals, addMeal, deleteMeal }), [meals]);

  return (
    <MealsContext.Provider value={value}>{children}</MealsContext.Provider>
  );
};

export const useMeals = () => useContext(MealsContext);
