import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

export default function WelcomeScreen() {
  return (
    <LinearGradient
      colors={["#FFF5E6", "#F0E0D6"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require("@assets/icon/imageHeart_v3.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Are You Single</Text>
        <Text style={styles.subtitle}>
          Where Hearts Connect, Love Finds Its Sync.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => router.push("/(auth)/login")}
          style={{ borderRadius: 25, overflow: "hidden" }}
        >
          <LinearGradient
            colors={["#5C3A21", "#7A5C49"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonSigIn}
          >
            <Text style={styles.buttonText}>Sign in</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonSignUp}
          onPress={() => router.push("/(auth)/register")}
        >
          <Text style={styles.buttonTextSignIn}>Sign up</Text>
        </TouchableOpacity>
      </View>

      <View>
        <Text style={styles.terms}>
          By signing up you agree to our Terms and Conditions
        </Text>
        <Text style={styles.privacy}>
          See how we use your data in our Privacy Policy
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 100,
  },
  logo: {
    width: 300,
    height: 200,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 10,
    color: "#5C3A21",
  },
  subtitle: {
    fontSize: 16,
    color: "#7A5C49",
    textAlign: "center",
    marginTop: 5,
  },
  buttonContainer: {
    width: "80%",
    gap: 20,
  },
  buttonSigIn: {
    padding: 10,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonSignUp: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 25,
    borderColor: "#5C3A21",
    borderWidth: 1,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  buttonTextSignIn: {
    color: "#5C3A21",
    fontSize: 18,
    fontWeight: "600",
  },
  terms: {
    fontSize: 12,
    color: "#7A5C49",
    textAlign: "center",
  },
  privacy: {
    fontSize: 12,
    color: "#7A5C49",
    textAlign: "center",
    marginBottom: 20,
  },
});
