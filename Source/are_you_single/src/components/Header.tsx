import { Ionicons } from "@expo/vector-icons";

import { Icon, IconButton } from "react-native-paper";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { View } from "react-native";

const Header = () => {
  return (
    <View style={style.header}>
      <TouchableOpacity>
        <Ionicons name="menu" size={26} color={"#FF4F81"} />
      </TouchableOpacity>
      <Text style={style.headerTitle}>HeartSync</Text>
      <TouchableOpacity>
        <Ionicons name="return-up-back" size={26} color={"#FF4F81"} />
      </TouchableOpacity>
    </View>
  );
};

const style = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomColor: "#FF6B9A",
    borderBottomWidth: 1,
    backgroundColor: "white",
    paddingTop: 40
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#FF4F81" },
});

export default Header;
