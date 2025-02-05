import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-expo";

const Header = () => {
  const { isSignedIn, signOut } = useAuth();

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

  // Ne pas afficher le bouton de déconnexion si l'utilisateur n'est pas connecté
  if (!isSignedIn) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSignOut} style={styles.iconButton}>
          <Ionicons name="log-out-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#87CEEB",
  },
  header: {
    width: "100%",
    height: 40,
    backgroundColor: "#87CEEB",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
  },
  iconButton: {
    padding: 8,
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Header;
