import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  SafeAreaView,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { createTables, getMeals } from "../../libs/database";

const HomeScreen = () => {
  const [meals, setMeals] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    createTables();
    fetchMeals();
  }, []);

  const fetchMeals = () => {
    getMeals((meals: any[]) => {
      setMeals(meals);
    });
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => router.push(`/detail?id=${item.id}`)}>
      <View style={styles.mealItem}>
        <Text style={styles.mealName}>{item.name}</Text>
        <Text style={styles.mealCalories}>{item.calories} kcal</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={meals}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/add")}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
  },
  mealItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  mealName: {
    fontSize: 18,
  },
  mealCalories: {
    fontSize: 18,
    color: "#888",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#87CEEB",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});
