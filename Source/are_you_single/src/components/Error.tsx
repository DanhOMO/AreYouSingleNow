import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ErrorStateProps {
  message?: string;
}

const ErrorState = ({ message  }: ErrorStateProps) => {
  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle-outline" size={48} color="#FF6B9A" />
      <Text style={styles.text}>{message ||  "Đã xảy ra lỗi. Vui lòng thử lại."}</Text>
    </View>
  );
};

export default ErrorState;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "500",
    color: "#FF6B9A",
    textAlign: "center",
  },
});
