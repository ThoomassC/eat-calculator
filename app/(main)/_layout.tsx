import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  if (!isSignedIn) {
    return <Redirect href={"/sign-in"} />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Vos repas",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push("/profile")}
              style={{ padding: 8 }}
            >
              <Ionicons name="person-circle-outline" size={32} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="add"
        options={{
          title: "Ajouter un repas",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push("/profile")}
              style={{ padding: 8 }}
            >
              <Ionicons name="person-circle-outline" size={32} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Détail d'un repas",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push("/profile")}
              style={{ padding: 8 }}
            >
              <Ionicons name="person-circle-outline" size={32} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
