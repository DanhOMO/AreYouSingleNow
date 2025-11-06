import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type HeaderProps = {
  onOpenFilter: () => void;
  onLogout: () => void;
};

const Header = ({ onOpenFilter, onLogout }: HeaderProps) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const scaleAnim = useState(new Animated.Value(0.9))[0];
  const opacityAnim = useState(new Animated.Value(0))[0];

  const toggleMenu = () => {
    if (!isMenuVisible) {
      setIsMenuVisible(true);
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 120,
          useNativeDriver: true,
        }),
      ]).start(() => setIsMenuVisible(false));
    }
  };

  return (
    <SafeAreaView style={styles.header}>
      <View>
        <TouchableOpacity onPress={toggleMenu} style={styles.iconButton}>
          <Ionicons name="menu" size={26} color="#FF6B9A" />
        </TouchableOpacity>

        {isMenuVisible && (
          <Animated.View
            style={[
              styles.menuPopup,
              {
                opacity: opacityAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                toggleMenu();
                router.push("/(main)/profile");
              }}
            >
              <Ionicons name="person" size={18} color="#FF6B9A" />
              <Text style={styles.menuText}>Hồ sơ</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                toggleMenu();
                onLogout();
              }}
            >
              <Ionicons name="log-out-outline" size={18} color="#FF6B9A" />
              <Text style={styles.menuText}>Đăng xuất</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>

      <Text style={styles.headerTitle}>Are You Single</Text>

      <TouchableOpacity onPress={onOpenFilter} style={styles.iconButton}>
        <Ionicons name="filter" size={26} color="#FF6B9A" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "white",
    borderBottomColor: "#FFDCE8",
    borderBottomWidth: 1,
    shadowColor: "#FF6B9A",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  iconButton: {
    padding: 6,
    borderRadius: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FF6B9A",
    letterSpacing: 0.5,
  },
  menuPopup: {
    position: "absolute",
    top: 45,
    left: 0,
    backgroundColor: "#FFF9FB",
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 6,
    width: 140,
    borderWidth: 1,
    borderColor: "#FFD6E5",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  menuText: {
    color: "#FF6B9A",
    fontWeight: "600",
    fontSize: 15,
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#FFE8F0",
    marginVertical: 4,
  },
});

export default Header;
