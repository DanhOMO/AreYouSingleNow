import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type HeaderProps = {
  onOpenFilter: () => void;
  onLogout: () => void;
};

const Header = ({ onOpenFilter, onLogout }: HeaderProps) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false); // trạng thái menu

  const toggleMenu = () => setIsMenuVisible(!isMenuVisible);

  return (
    <View style={style.header}>
      {/* Menu Icon */}
      <View>
        <TouchableOpacity onPress={toggleMenu}>
          <Ionicons name="menu" size={26} color={"#FF4F81"} />
        </TouchableOpacity>

        {isMenuVisible && (
          <View style={style.menuPopup}>
            <TouchableOpacity
              style={style.menuItem}
              onPress={() => {
                setIsMenuVisible(false);
                onLogout(); // thực hiện logout
              }}
            >
              <Text style={style.menuText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Title */}
      <Text style={style.headerTitle}>HeartSync</Text>

      {/* Filter Icon */}
      <TouchableOpacity onPress={onOpenFilter}>
        <Ionicons name="filter" size={26} color={"#FF4F81"} />
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
    paddingTop: 40,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#FF4F81" },
  menuPopup: {
    position: "absolute",
    top: 35,
    left: 0,
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
    minWidth: 100, // đảm bảo đủ rộng để chữ không xuống dòng
  },
  menuItem: {
    paddingVertical: 8,
    paddingHorizontal: 10, // thêm padding ngang
  },
  menuText: {
    color: "#FF4F81",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center", // căn chữ giữa
  },
});

export default Header;
