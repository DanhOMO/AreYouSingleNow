// Tệp: app/index.tsx (File WelcomeScreen của bạn)

import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

export default function WelcomeScreen() {
  

  return (
    <LinearGradient
      colors={["#FF6B9A", "#FFC0CB", "#E91E63"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require("@assets/icon/imageHeart_v2.png")}
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
            colors={["#FF6B9A", "#FF4F81"]}
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

// Giữ nguyên styles của bạn
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
    color: "#FF4F81",
  },
  subtitle: {
    fontSize: 16,
    color: "white",
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
    backgroundColor: "white",
    padding: 10,
    borderRadius: 25,
    borderColor: "#FF6B9A",
    borderWidth: 1,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  buttonTextSignIn: {
    color: "#FF6B9A",
    fontSize: 18,
  },
  terms: {
    fontSize: 12,
    color: "white",
    textAlign: "center",
  },
  privacy: {
    fontSize: 12,
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
});