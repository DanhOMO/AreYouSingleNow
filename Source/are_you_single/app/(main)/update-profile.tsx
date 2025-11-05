import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAuthStore } from "@store/useAuthStore";
import { IP } from "src/types/type";

const interestsList = ["music", "travel", "coffee", "books", "movie"];

const UpdateProfile = () => {
  const router = useRouter();
  const authStore = useAuthStore();
  const user = authStore.user;

  const [formData, setFormData] = useState({
    phone: user?.phone || "",
    status: user?.status || false,
    name: user?.profile?.name || "",
    gender: user?.profile?.gender || "female",
    aboutMe: user?.profile?.aboutMe || "",
    education: user?.detail?.education || "",
    height: user?.detail?.height?.toString() || "",
    interested: user?.detail?.interested || [],
    photos: user?.profile?.photos || [],
    dob: user?.profile?.dob ? new Date(user.profile.dob) : null,
    location: user?.location || { coordinates: [0, 0] },
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  // Chọn ảnh (avatar hoặc ảnh phụ)
  const handleSelectImage = async (index?: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const newPhotos = [...formData.photos];
      if (index !== undefined) {
        newPhotos[index] = uri;
      } else {
        newPhotos[0] = uri;
      }
      setFormData({ ...formData, photos: newPhotos });
    }
  };

  const handleAddMoreImage = async () => {
    if (formData.photos.length >= 4) {
      Alert.alert("Thông báo", "Bạn chỉ có thể thêm tối đa 3 ảnh phụ.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setFormData({
        ...formData,
        photos: [...formData.photos, result.assets[0].uri],
      });
    }
  };

  const handleToggleInterest = (item: string) => {
    const selected = formData.interested.includes(item)
      ? formData.interested.filter((i) => i !== item)
      : [...formData.interested, item];
    setFormData({ ...formData, interested: selected });
  };

  // ... (các import và state giữ nguyên)

  const uploadImageToServer = async (uri: string) => {
    try {
      const token = useAuthStore.getState().token; // Lấy token trực tiếp từ store
      const formDataUpload = new FormData();
      const fileName = `photo-${Date.now()}.jpg`;

      // 1. Chuẩn bị đối tượng file cho FormData
      if (Platform.OS === "web") {
        // Trên web (Expo Web): Cần fetch blob và tạo File object
        const blob = await fetch(uri).then((r) => r.blob());
        // File object: new File(fileBits, fileName, options)
        formDataUpload.append(
          "image",
          new File([blob], fileName, { type: blob.type })
        );
      } else {
        // Trên mobile (iOS/Android): Dùng URI và định nghĩa đối tượng tương thích với RN Fetch
        formDataUpload.append("image", {
          uri,
          name: fileName,
          type: "image/jpeg", // Hoặc dựa vào type thực tế nếu có
        } as any);
      }

      // 2. Gọi API Upload
      const res = await fetch(`http://${IP}:3000/api/upload`, {
        method: "POST",
        headers: {
          // LƯU Ý: Không cần set 'Content-Type' cho FormData,
          // React Native/Browser sẽ tự động set 'multipart/form-data' với boundary
          Authorization: `Bearer ${token}`,
        },
        body: formDataUpload, // Gửi FormData
      });

      const data = await res.json();
      if (!res.ok) {
        // Log chi tiết lỗi từ backend
        console.error("Backend Upload Error:", data.error);
        throw new Error(data.error || "Upload thất bại.");
      }

      // 3. Trả về link public Google Drive (data.url)
      return data.url as string;
    } catch (err) {
      console.error("Upload image error:", err);
      Alert.alert("Lỗi", "Không thể upload ảnh, vui lòng thử lại.");
      return null;
    }
  };

  // ... (các hàm khác giữ nguyên)

  const handleSubmit = async () => {
    try {
      const token = authStore.token;
      const uploadedPhotos: string[] = [];
      for (const uri of formData.photos) {
        if (uri.startsWith("file://")) {
          const uploadedUrl = await uploadImageToServer(uri);
          if (!uploadedUrl) return;
          uploadedPhotos.push(uploadedUrl);
        } else {
          uploadedPhotos.push(uri);
        }
      }

      const body = {
        phone: formData.phone,
        status: formData.status,
        profile: {
          name: formData.name,
          gender: formData.gender,
          photos: uploadedPhotos,
          aboutMe: formData.aboutMe,
          dob: formData.dob,
        },
        detail: {
          height: parseFloat(formData.height) || 0,
          interested: formData.interested,
          education: formData.education,
        },
        location: formData.location,
        interested: formData.interested,
      };

      const res = await fetch(`http://${IP}:3000/api/users/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert("Thành công", "Cập nhật hồ sơ thành công!");
        authStore.setUser(data.user || data);
        router.back();
      } else {
        Alert.alert("Lỗi", data.message || "Không thể cập nhật hồ sơ");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Lỗi", "Không thể kết nối đến server");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 110 }}
        >
          <Text style={styles.header}>Chỉnh sửa hồ sơ</Text>

          {/* Avatar */}
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={() => handleSelectImage()}
          >
            <Image
              source={
                formData.photos[0]
                  ? { uri: formData.photos[0] }
                  : require("src/assets/default-avatar.jpg")
              }
              style={styles.avatar}
            />
            <Text style={styles.changePhotoText}>Thay đổi ảnh đại diện</Text>
          </TouchableOpacity>

          {/* Ảnh phụ */}
          <Text style={styles.label}>Ảnh bổ sung</Text>
          <View style={styles.extraPhotosContainer}>
            {formData.photos.slice(1).map((uri, index) => (
              <View
                key={index}
                style={{ position: "relative", marginRight: 10 }}
              >
                <TouchableOpacity onPress={() => handleSelectImage(index + 1)}>
                  <Image source={{ uri }} style={styles.extraPhoto} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deletePhotoButton}
                  onPress={() => {
                    const newPhotos = [...formData.photos];
                    newPhotos.splice(index + 1, 1);
                    setFormData({ ...formData, photos: newPhotos });
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
            {formData.photos.length < 4 && (
              <TouchableOpacity
                style={styles.addPhotoButton}
                onPress={handleAddMoreImage}
              >
                <Text style={{ fontSize: 24, color: "#FF6B9A" }}>＋</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Số điện thoại */}
          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput
            style={styles.input}
            value={formData.phone}
            keyboardType="phone-pad"
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
          />

          {/* Ngày sinh */}
          <Text style={styles.label}>Ngày sinh</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>
              {formData.dob ? formData.dob.toLocaleDateString() : "Chọn ngày"}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={formData.dob || new Date()}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) setFormData({ ...formData, dob: date });
              }}
            />
          )}

          {/* Trạng thái */}
          <Text style={styles.label}>Trạng thái</Text>
          <Switch
            value={formData.status}
            onValueChange={(val) => setFormData({ ...formData, status: val })}
          />

          {/* Tọa độ */}
          <Text style={styles.label}>Tọa độ hiện tại</Text>
          <Text style={{ marginBottom: 10 }}>
            Lat: {formData.location?.coordinates[1]}, Lng:{" "}
            {formData.location?.coordinates[0]}
          </Text>

          {/* Thông tin khác */}
          <Text style={styles.label}>Tên</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />

          <Text style={styles.label}>Giới tính</Text>
          <View style={styles.genderContainer}>
            {["female", "male"].map((g) => (
              <TouchableOpacity
                key={g}
                style={[
                  styles.genderButton,
                  formData.gender === g && styles.genderActive,
                ]}
                onPress={() => setFormData({ ...formData, gender: g })}
              >
                <Text
                  style={[
                    styles.genderText,
                    formData.gender === g && styles.genderTextActive,
                  ]}
                >
                  {g === "female" ? "Nữ" : "Nam"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Chiều cao (cm)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={formData.height}
            onChangeText={(text) => setFormData({ ...formData, height: text })}
          />

          <Text style={styles.label}>Học vấn</Text>
          <TextInput
            style={styles.input}
            value={formData.education}
            onChangeText={(text) =>
              setFormData({ ...formData, education: text })
            }
          />

          <Text style={styles.label}>Giới thiệu</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            multiline
            value={formData.aboutMe}
            onChangeText={(text) => setFormData({ ...formData, aboutMe: text })}
          />

          <Text style={styles.label}>Sở thích</Text>
          <View style={styles.interestContainer}>
            {interestsList.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.interestButton,
                  formData.interested.includes(item) && styles.interestActive,
                ]}
                onPress={() => handleToggleInterest(item)}
              >
                <Text
                  style={[
                    styles.interestText,
                    formData.interested.includes(item) &&
                      styles.interestTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
            <Text style={styles.saveText}>Lưu thay đổi</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UpdateProfile;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  avatarContainer: { alignItems: "center", marginBottom: 15 },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#FF6B9A",
  },
  changePhotoText: { color: "#FF6B9A", marginTop: 8, fontWeight: "600" },
  extraPhotosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },
  extraPhoto: { width: 80, height: 80, borderRadius: 10 },
  addPhotoButton: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#FF6B9A",
    alignItems: "center",
    justifyContent: "center",
  },
  deletePhotoButton: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FF6B9A",
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  label: { fontSize: 14, fontWeight: "600", marginTop: 10, color: "#333" },
  input: {
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginTop: 5,
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  genderButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  genderActive: { backgroundColor: "#FF6B9A", borderColor: "#FF6B9A" },
  genderText: { color: "#555" },
  genderTextActive: { color: "#fff" },
  interestContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 10 },
  interestButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  interestActive: { backgroundColor: "#FF6B9A", borderColor: "#FF6B9A" },
  interestText: { color: "#555" },
  interestTextActive: { color: "#fff" },
  saveButton: {
    backgroundColor: "#FF6B9A",
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 25,
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
});
