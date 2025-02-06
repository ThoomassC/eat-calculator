import React from "react";
import {
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  SafeAreaView,
  View,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useMeals } from "../../context/MealsContext";

const HomeScreen = () => {
  const { meals } = useMeals();
  const router = useRouter();

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => router.push(`/${item.id}`)}
      style={styles.mealItemContainer}
    >
      <View style={styles.mealItem}>
        <View style={styles.mealInfo}>
          <Text style={styles.mealName} numberOfLines={2} ellipsizeMode="tail">
            {item.name}
          </Text>
          <Text style={styles.mealCalories}>{item.calories} kcal</Text>
          <FlatList
            data={item.items}
            renderItem={({ item }) => (
              <View style={styles.foodItem}>
                {item.image ? (
                  <Image
                    source={{ uri: item.image }}
                    style={styles.foodImage}
                  />
                ) : (
                  <Ionicons
                    name="image-outline"
                    size={30}
                    color="#ccc"
                    style={styles.defaultFoodImage}
                  />
                )}
                <Text style={styles.foodText}>
                  {item.name} x {item.quantity} -{" "}
                  {item.calories * item.quantity} kcal
                </Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
        {item.image && (
          <Image source={{ uri: item.image }} style={styles.mealImage} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {meals.length === 0 ? (
        <View style={styles.noMealsContainer}>
          <Text style={styles.noMealsText}>Aucun repas disponible</Text>
        </View>
      ) : (
        <FlatList
          data={meals}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
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
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  listContent: {
    paddingBottom: 80,
  },
  mealItemContainer: {
    marginTop: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#000",
    marginLeft: 5,
    marginRight: 5,
  },
  mealItem: {
    flexDirection: "row",
    padding: 8,
    borderRadius: 8,
    justifyContent: "space-between",
  },
  mealImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  mealInfo: {
    flex: 1,
    justifyContent: "center",
    marginRight: 16,
  },
  mealName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  mealCalories: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  foodItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  foodImage: {
    width: 30,
    height: 30,
    marginRight: 10,
    borderRadius: 8,
  },
  defaultFoodImage: {
    width: 30,
    height: 30,
    marginRight: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  foodText: {
    fontSize: 14,
    color: "#555",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#4CAF50",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  noMealsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noMealsText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
