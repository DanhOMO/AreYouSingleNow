import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  FlatList,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@store/useAuthStore";
import { router } from "expo-router";
const userDetail = {
  _id: "68f5ce17dc99208742f2f11f",
  profile: {
    name: "Alice Nguyen",
    gender: "female",
    photos: ["https://cdn-icons-png.flaticon.com/512/847/847969.png"],
    aboutMe: "Yêu thích du lịch và đọc sách.",
  },
  detail: {
    height: 160.5,
    interested: ["Du lịch", "Âm nhạc"],
    education: "University of Economics",
  },
};

const Profile = () => {
  const authStore = useAuthStore();
  const user = authStore.user ? authStore.user : userDetail;
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.card}>
            <Image
              source={{ uri: user.profile.photos[0] }}
              style={styles.avatar}
            />
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{user.profile.name}</Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => router.push("/(main)/update-profile")}
              >
                <Text style={styles.editText}>Chỉnh sửa</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Giới thiệu</Text>
            <Text style={styles.sectionText}>{user.profile.aboutMe}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chi tiết</Text>
            <Text style={styles.sectionText}>
              <Text style={{ fontStyle: "italic" }}>Giới tính:</Text>{" "}
              {user.profile.gender === "female" ? "Nữ" : "Nam"}
            </Text>
            <Text style={styles.sectionText}>
              <Text style={{ fontStyle: "italic" }}>Chiều cao:</Text>{" "}
              {user.detail.height} cm
            </Text>
            <Text style={styles.sectionText}>
              <Text style={{ fontStyle: "italic" }}>Quan tâm:</Text>{" "}
              {user.detail.interested.join(", ")}
            </Text>
            <Text style={styles.sectionText}>
              <Text style={{ fontStyle: "italic" }}>Học vấn:</Text>{" "}
              {user.detail.education}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ảnh khác</Text>
            <FlatList
              data={user.profile.photos}
              keyExtractor={(_, index) => index.toString()}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              contentContainerStyle={{ paddingVertical: 5 }}
              renderItem={({ item }) => (
                <Image source={{ uri: item }} style={styles.photoItem} />
              )}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    padding: 15,
    alignItems: "center",
    minHeight: Dimensions.get("window").height * 1.2,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    width: Dimensions.get("window").width - 30,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#FF6B9A",
  },
  infoContainer: {
    flex: 1,
    paddingLeft: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    color: "#333",
  },
  editButton: {
    backgroundColor: "#FF6B9A",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: "flex-start",
    shadowColor: "#FF6B9A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  editText: {
    color: "#fff",
    fontWeight: "600",
  },
  section: {
    width: Dimensions.get("window").width - 30,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    color: "#333",
  },
  sectionText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  photoItem: {
    width: (Dimensions.get("window").width - 80) / 2,
    height: 250,
    borderRadius: 15,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 10,
  },
});

export default Profile;
