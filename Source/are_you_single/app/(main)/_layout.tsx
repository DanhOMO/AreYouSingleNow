// app/(main)/_layout.tsx
import { Tabs, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore, useFilterStore } from "@store/useAuthStore";
import { useEffect, useState } from "react";
import {
  Platform,
  View,
  Modal,
  Text,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import Header from "@components/Header";

export default function MainTabLayout() {
  const token = useAuthStore((state) => state.token);
  const setToken = useAuthStore((state) => state.setToken); // để logout
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

  const handleLogout = () => {
    setToken(null);
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
          tabBarInactiveTintColor: "#FF6B9A",
          tabBarShowLabel: true,
          tabBarLabelStyle: { color: "#FF6B9A", fontSize: 12, marginTop: 4 },
          tabBarStyle: {
            position: "absolute",
            height: 90,
            borderTopWidth: 1,
            borderTopColor: "#FF6B9A",
            paddingBottom: Platform.OS === "ios" ? 30 : 20,
            backgroundColor: "#fff",
          },
          tabBarIcon: ({ color, focused }) => {
            let iconName: React.ComponentProps<typeof Ionicons>["name"] =
              "alert-circle-outline";
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
        <Tabs.Screen name="home" options={{ title: "People" }} />
        <Tabs.Screen name="likeyou" options={{ title: "Like You" }} />
        <Tabs.Screen name="chat" options={{ title: "Chat" }} />
      </Tabs>

      {/* Filter Modal */}
      <Modal
        visible={isFilterVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsFilterVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <TouchableWithoutFeedback onPress={() => {}}>
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 10,
                  padding: 20,
                  position: "relative",
                }}
              >
                {/* Nút đóng X */}
                <TouchableOpacity
                  onPress={() => setIsFilterVisible(false)}
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    padding: 5,
                  }}
                >
                  <Text style={{ fontSize: 18, fontWeight: "bold" }}>X</Text>
                </TouchableOpacity>

                <Text
                  style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
                >
                  Bộ lọc
                </Text>

                {/* Giới tính */}
                <Text>Giới tính</Text>
                <View style={{ flexDirection: "row", marginVertical: 5 }}>
                  <TouchableOpacity
                    style={{
                      padding: 10,
                      backgroundColor:
                        filter.gender === "male" ? "#FF4F81" : "#eee",
                      marginRight: 10,
                      borderRadius: 5,
                    }}
                    onPress={() => setFilter({ ...filter, gender: "male" })}
                  >
                    <Text
                      style={{
                        color: filter.gender === "male" ? "#fff" : "#000",
                      }}
                    >
                      Nam
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      padding: 10,
                      backgroundColor:
                        filter.gender === "female" ? "#FF4F81" : "#eee",
                      borderRadius: 5,
                    }}
                    onPress={() => setFilter({ ...filter, gender: "female" })}
                  >
                    <Text
                      style={{
                        color: filter.gender === "female" ? "#fff" : "#000",
                      }}
                    >
                      Nữ
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Tuổi Min */}
                <Text>Tuổi Min</Text>
                <TextInput
                  keyboardType="number-pad"
                  placeholder="Min Age"
                  value={filter.minAge?.toString() || ""}
                  style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 5,
                    padding: 5,
                    marginVertical: 5,
                  }}
                  onChangeText={(t) =>
                    setFilter({ ...filter, minAge: t ? Number(t) : undefined })
                  }
                />

                {/* Tuổi Max */}
                <Text>Tuổi Max</Text>
                <TextInput
                  keyboardType="number-pad"
                  placeholder="Max Age"
                  value={filter.maxAge?.toString() || ""}
                  style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 5,
                    padding: 5,
                    marginVertical: 5,
                  }}
                  onChangeText={(t) =>
                    setFilter({ ...filter, maxAge: t ? Number(t) : undefined })
                  }
                />

                {/* Nút Áp dụng */}
                <TouchableOpacity
                  onPress={applyFilter}
                  style={{
                    marginTop: 10,
                    backgroundColor: "#FF4F81",
                    padding: 10,
                    borderRadius: 5,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Áp dụng
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}
