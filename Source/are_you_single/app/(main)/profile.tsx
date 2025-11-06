// import React from "react";
// import {
//   Dimensions,
//   Image,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   ScrollView,
//   FlatList,
// } from "react-native";
// import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
// import { useAuthStore } from "@store/useAuthStore";
// import { router } from "expo-router";

// const userDetail = {
//   _id: "68f5ce17dc99208742f2f11f",
//   profile: {
//     name: "Alice Nguyen",
//     gender: "female",
//     photos: ["https://cdn-icons-png.flaticon.com/512/847/847969.png"],
//     aboutMe: "Yêu thích du lịch và đọc sách.",
//   },
//   detail: {
//     height: 160.5,
//     interested: ["Du lịch", "Âm nhạc"],
//     education: "University of Economics",
//   },
// };

// const Profile = () => {
//   const authStore = useAuthStore();
//   const user = authStore.user ? authStore.user : userDetail;

//   return (
//     <SafeAreaProvider>
//       <SafeAreaView style={styles.container}>
//         <ScrollView contentContainerStyle={styles.scrollContainer}>
//           {/* Profile Card */}
//           <View style={styles.card}>
//             <Image
//               source={{ uri: user.profile.photos[0] }}
//               style={styles.avatar}
//             />
//             <View style={styles.infoContainer}>
//               <Text style={styles.name}>{user.profile.name}</Text>
//               <TouchableOpacity
//                 style={styles.editButton}
//                 onPress={() => router.push("/(main)/update-profile")}
//               >
//                 <Text style={styles.editText}>Chỉnh sửa</Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* About Me */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Giới thiệu</Text>
//             <Text style={styles.sectionText}>{user.profile.aboutMe}</Text>
//           </View>

//           {/* Details */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Chi tiết</Text>
//             <Text style={styles.sectionText}>
//               <Text style={styles.label}>Giới tính:</Text>{" "}
//               {user.profile.gender === "female" ? "Nữ" : "Nam"}
//             </Text>
//             <Text style={styles.sectionText}>
//               <Text style={styles.label}>Chiều cao:</Text> {user.detail.height}{" "}
//               cm
//             </Text>
//             <Text style={styles.sectionText}>
//               <Text style={styles.label}>Quan tâm:</Text>{" "}
//               {user.detail.interested.join(", ")}
//             </Text>
//             <Text style={styles.sectionText}>
//               <Text style={styles.label}>Học vấn:</Text> {user.detail.education}
//             </Text>
//           </View>

//           {/* Photos */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Ảnh khác</Text>
//             <FlatList
//               data={user.profile.photos}
//               keyExtractor={(_, index) => index.toString()}
//               numColumns={2}
//               scrollEnabled={false}
//               columnWrapperStyle={{ justifyContent: "space-between" }}
//               contentContainerStyle={{ paddingVertical: 5 }}
//               renderItem={({ item }) => (
//                 <Image source={{ uri: item }} style={styles.photoItem} />
//               )}
//             />
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     </SafeAreaProvider>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFF5E6", // cream nhạt
//   },
//   scrollContainer: {
//     padding: 15,
//     alignItems: "center",
//     minHeight: Dimensions.get("window").height * 1.2,
//   },
//   card: {
//     flexDirection: "row",
//     alignItems: "center",
//     width: Dimensions.get("window").width - 30,
//     backgroundColor: "#FDF6F0", // cream card
//     borderRadius: 20,
//     padding: 15,
//     marginBottom: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 5 },
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   avatar: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     borderWidth: 2,
//     borderColor: "#5C3A21", // viền nâu đậm
//   },
//   infoContainer: {
//     flex: 1,
//     paddingLeft: 15,
//   },
//   name: {
//     fontSize: 20,
//     fontWeight: "700",
//     marginBottom: 10,
//     color: "#5C3A21", // nâu đậm
//   },
//   editButton: {
//     backgroundColor: "#5C3A21", // nâu đậm
//     paddingVertical: 8,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//     alignSelf: "flex-start",
//     shadowColor: "#5C3A21",
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   editText: {
//     color: "#FFF",
//     fontWeight: "600",
//   },
//   section: {
//     width: Dimensions.get("window").width - 30,
//     backgroundColor: "#FDF6F0", // cream card
//     borderRadius: 20,
//     padding: 15,
//     marginBottom: 15,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "700",
//     marginBottom: 8,
//     color: "#5C3A21", // nâu đậm
//   },
//   sectionText: {
//     fontSize: 14,
//     color: "#7A5C49", // nâu nhạt
//     marginBottom: 5,
//   },
//   label: {
//     fontStyle: "italic",
//     color: "#5C3A21",
//   },
//   photoItem: {
//     width: (Dimensions.get("window").width - 80) / 2,
//     height: 250,
//     borderRadius: 15,
//     borderWidth: 1,
//     borderColor: "#E0D4C8", // nâu nhạt viền
//     marginBottom: 10,
//   },
// });

// export default Profile;
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
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@store/useAuthStore";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

const defaultUser = {
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

export default function Profile() {
  const { user } = useAuthStore();
  const currentUser = user || defaultUser;

  const photos =
    currentUser.profile.photos && currentUser.profile.photos.length > 0
      ? currentUser.profile.photos
      : ["https://cdn-icons-png.flaticon.com/512/847/847969.png"];

  return (
    <SafeAreaView
      style={[styles.container, { paddingTop: 0 }]}
      edges={["left", "right", "bottom"]}
    >
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Image source={{ uri: photos[0] }} style={styles.avatar} />
            <Text style={styles.name}>{currentUser.profile.name}</Text>
            <Text style={styles.subtext}>
              {currentUser.detail.education || "Người dùng mới"}
            </Text>

            <TouchableOpacity
              onPress={() => router.push("/(main)/update-profile")}
              style={styles.editButton}
            >
              <Text style={styles.editText}>Chỉnh sửa hồ sơ</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Giới thiệu</Text>
            <Text style={styles.sectionText}>
              {currentUser.profile.aboutMe || "Chưa có giới thiệu."}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin chi tiết</Text>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Giới tính</Text>
              <Text style={styles.value}>
                {currentUser.profile.gender === "female" ? "Nữ" : "Nam"}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.label}>Chiều cao</Text>
              <Text style={styles.value}>
                {currentUser.detail.height
                  ? `${currentUser.detail.height} cm`
                  : "Chưa cập nhật"}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.label}>Sở thích</Text>
              <Text style={styles.value}>
                {currentUser.detail.interested?.length
                  ? currentUser.detail.interested.join(", ")
                  : "Chưa có thông tin"}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bộ sưu tập</Text>
            <FlatList
              data={photos}
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    paddingTop: 0,
  },
  scrollContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 25,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 1,
    borderColor: "#FF6B9A",
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2D2D2D",
  },
  subtext: {
    fontSize: 14,
    color: "#7A7A7A",
    marginTop: 4,
  },
  editButton: {
    marginTop: 14,
    backgroundColor: "#FF6B9A",
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  editText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  section: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderColor: "#FF6B9A",
    borderWidth: 1,
    padding: 18,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    color: "#2D2D2D",
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#555",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  label: {
    color: "#777",
    fontSize: 14,
  },
  value: {
    color: "#2D2D2D",
    fontSize: 14,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 6,
  },
  photoItem: {
    width: (Dimensions.get("window").width - 80) / 2,
    height: 250,
    borderRadius: 14,
    backgroundColor: "#EEE",
    marginBottom: 10,
  },
});
