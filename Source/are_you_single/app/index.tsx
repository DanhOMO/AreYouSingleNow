import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

export default function WelcomeScreen() {
  return (
    <LinearGradient
      colors={["#FF6B9A", "#FFC0CB", "#E91E63"]} // 🌸 pastel → đậm dần
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require("@assets/icon/imageHeart_v2.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Are You Single</Text>
        <Text style={styles.subtitle}>
          Nơi trái tim kết nối, tình yêu tìm thấy sự đồng điệu.
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => router.push("/(auth)/login")}
          style={styles.shadowWrapper}
        >
          <LinearGradient
            colors={["#FF6B9A", "#E91E63"]} // 💖 gradient chính
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonSignIn}
          >
            <Text style={styles.buttonText}>Đăng nhập</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buttonSignUp, styles.shadowWrapper]}
          onPress={() => router.push("/(auth)/register")}
        >
          <Text style={styles.buttonTextSignUp}>Đăng ký</Text>
        </TouchableOpacity>
      </View>

      {/* Terms */}
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
  shadowWrapper: {
    borderRadius: 25,
    shadowColor: "#E91E63",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  buttonSignIn: {
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
  buttonTextSignUp: {
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
