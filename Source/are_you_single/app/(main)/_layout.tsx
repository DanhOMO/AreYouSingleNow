import { router, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore, useFilterStore } from "@store/useAuthStore";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
} from "react-native";
import Header from "@components/Header";

export default function MainTabLayout() {
  const token = useAuthStore((state) => state.token);
  const setToken = useAuthStore((state) => state.setToken);
  const setFilterStore = useFilterStore((state) => state.setFilter);

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filter, setFilter] = useState<{
    gender?: string;
    minAge?: number;
    maxAge?: number;
  }>({});

  useEffect(() => {
    if (!token) router.replace("/(auth)/login");
  }, [token]);

  if (!token) return null;

  const applyFilter = () => {
    setFilterStore(filter);
    setIsFilterVisible(false);
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("token");
    setToken("");
    router.replace("/(auth)/login");
  };

  return (
    <>
      <Tabs
        screenOptions={({ route }) => ({
          header: () => (
            <Header
              onOpenFilter={() => setIsFilterVisible(true)}
              onLogout={handleLogout}
            />
          ),
          tabBarActiveTintColor: "#FF6B9A",
          tabBarInactiveTintColor: "#B0AFAF",
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
          tabBarIcon: ({ color, focused }) => {
            let iconName: React.ComponentProps<typeof Ionicons>["name"] =
              "ellipse-outline";
            if (route.name === "home")
              iconName = focused ? "people" : "people-outline";
            else if (route.name === "likeyou")
              iconName = focused ? "heart" : "heart-outline";
            else if (route.name === "chat")
              iconName = focused ? "chatbubble" : "chatbubble-outline";
            else if (route.name === "profile")
              iconName = focused ? "person" : "person-outline";
            return <Ionicons name={iconName} size={26} color={color} />;
          },
        })}
      >
        <Tabs.Screen name="profile" options={{ title: "Profile" }} />
        <Tabs.Screen
          name="update-profile"
          options={{ title: "Update", href: null }}
        />
        <Tabs.Screen name="home" options={{ title: "People" }} />
        <Tabs.Screen name="likeyou" options={{ title: "Like You" }} />
        <Tabs.Screen name="chat" options={{ title: "Chat" }} />
      </Tabs>

      <Modal
        visible={isFilterVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setIsFilterVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalBox}>
                <TouchableOpacity
                  onPress={() => setIsFilterVisible(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={22} color="#FF6B9A" />
                </TouchableOpacity>

                <Text style={styles.modalTitle}>Bộ lọc</Text>

                <Text style={styles.label}>Giới tính</Text>
                <View style={styles.genderRow}>
                  {["male", "female"].map((g) => (
                    <TouchableOpacity
                      key={g}
                      onPress={() => setFilter({ ...filter, gender: g })}
                      style={[
                        styles.genderButton,
                        filter.gender === g && styles.genderButtonActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.genderText,
                          filter.gender === g && styles.genderTextActive,
                        ]}
                      >
                        {g === "male" ? "Nam" : "Nữ"}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.label}>Tuổi Min</Text>
                <TextInput
                  keyboardType="number-pad"
                  placeholder="Nhập tuổi nhỏ nhất"
                  placeholderTextColor="#B0AFAF"
                  value={filter.minAge?.toString() || ""}
                  onChangeText={(t) =>
                    setFilter({ ...filter, minAge: t ? Number(t) : undefined })
                  }
                  style={styles.input}
                />

                <Text style={styles.label}>Tuổi Max</Text>
                <TextInput
                  keyboardType="number-pad"
                  placeholder="Nhập tuổi lớn nhất"
                  placeholderTextColor="#B0AFAF"
                  value={filter.maxAge?.toString() || ""}
                  onChangeText={(t) =>
                    setFilter({ ...filter, maxAge: t ? Number(t) : undefined })
                  }
                  style={styles.input}
                />

                <TouchableOpacity
                  onPress={applyFilter}
                  style={styles.applyButton}
                >
                  <Text style={styles.applyText}>Áp dụng</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    borderRadius: 0,
    marginHorizontal: 0,
    paddingTop: 10,
    backgroundColor: "#FFFFFF",
    height: 70,
    borderTopWidth: 1,
    borderTopColor: "#FF6B9A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  closeButton: { position: "absolute", top: 14, right: 14 },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FF6B9A",
    marginBottom: 16,
    textAlign: "center",
  },
  label: { color: "#555", marginBottom: 6, fontWeight: "500" },
  genderRow: { flexDirection: "row", marginBottom: 15 },
  genderButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#F4F4F4",
    marginRight: 10,
  },
  genderButtonActive: { backgroundColor: "#FF6B9A" },
  genderText: { color: "#1E1E1E" },
  genderTextActive: { color: "#FFF" },
  input: {
    borderWidth: 1,
    borderColor: "#FFD6E4",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    color: "#1E1E1E",
    marginBottom: 15,
  },
  applyButton: {
    backgroundColor: "#FF6B9A",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  applyText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
});
