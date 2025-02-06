import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";
import { Alert, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AuthRoutesLayout() {
  const { isSignedIn, signOut } = useAuth();

  if (!isSignedIn) {
    return <Redirect href={"/sign-in"} />;
  }

  const handleSignOut = () => {
    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Se déconnecter",
          onPress: () => signOut(),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Vos repas",
          headerRight: () => (
            <TouchableOpacity onPress={handleSignOut} style={{ padding: 8 }}>
              <Ionicons name="log-out-outline" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="add"
        options={{
          title: "Ajouter un repas",
          headerRight: () => (
            <TouchableOpacity onPress={handleSignOut} style={{ padding: 8 }}>
              <Ionicons name="log-out-outline" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Détail d'un repas",
          headerRight: () => (
            <TouchableOpacity onPress={handleSignOut} style={{ padding: 8 }}>
              <Ionicons name="log-out-outline" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
