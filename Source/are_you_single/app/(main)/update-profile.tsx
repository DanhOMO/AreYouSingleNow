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

  const uploadImageToServer = async (uri: string) => {
    try {
      const token = useAuthStore.getState().token;
      const formDataUpload = new FormData();
      const fileName = `photo-${Date.now()}.jpg`;

      if (Platform.OS === "web") {
        const blob = await fetch(uri).then((r) => r.blob());
        formDataUpload.append(
          "image",
          new File([blob], fileName, { type: blob.type })
        );
      } else {
        formDataUpload.append("image", {
          uri,
          name: fileName,
          type: "image/jpeg",
        } as any);
      }

      const res = await fetch(`http://${IP}:3000/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataUpload,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload thất bại.");
      return data.url as string;
    } catch (err) {
      console.error(err);
      Alert.alert("Lỗi", "Không thể upload ảnh, vui lòng thử lại.");
      return null;
    }
  };

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
          contentContainerStyle={{ paddingBottom: 120 }}
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
                <Text style={{ fontSize: 24, color: "#5C3A21" }}>＋</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Thông tin cá nhân */}
          {[
            { label: "Số điện thoại", key: "phone", keyboard: "phone-pad" },
            { label: "Tên", key: "name" },
            { label: "Chiều cao (cm)", key: "height", keyboard: "numeric" },
            { label: "Học vấn", key: "education" },
          ].map((field) => (
            <View key={field.key}>
              <Text style={styles.label}>{field.label}</Text>
              <TextInput
                style={styles.input}
                value={formData[field.key]}
                keyboardType={field.keyboard || "default"}
                onChangeText={(text) =>
                  setFormData({ ...formData, [field.key]: text })
                }
              />
            </View>
          ))}

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

          {/* Giới tính */}
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

          {/* Trạng thái */}
          <Text style={styles.label}>Trạng thái</Text>
          <Switch
            value={formData.status}
            onValueChange={(val) => setFormData({ ...formData, status: val })}
          />

          {/* Giới thiệu */}
          <Text style={styles.label}>Giới thiệu</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            multiline
            value={formData.aboutMe}
            onChangeText={(text) => setFormData({ ...formData, aboutMe: text })}
          />

          {/* Sở thích */}
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

          {/* Buttons */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
            <Text style={styles.saveText}>Lưu thay đổi</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>Quay lại</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UpdateProfile;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF5E6", padding: 20 },
  header: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    color: "#5C3A21",
  },
  avatarContainer: { alignItems: "center", marginBottom: 15 },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#5C3A21",
  },
  changePhotoText: { color: "#5C3A21", marginTop: 8, fontWeight: "600" },
  extraPhotosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  extraPhoto: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0D4C8",
  },
  addPhotoButton: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#5C3A21",
    alignItems: "center",
    justifyContent: "center",
  },
  deletePhotoButton: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#5C3A21",
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  label: { fontSize: 14, fontWeight: "600", marginTop: 15, color: "#5C3A21" },
  input: {
    backgroundColor: "#FDF6F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginTop: 5,
    color: "#333",
    borderWidth: 1.5,
    borderColor: "#FDF6F0", // nâu đậm
    shadowColor: "#5C3A21",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
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
  genderActive: { backgroundColor: "#5C3A21", borderColor: "#5C3A21" },
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
  interestActive: { backgroundColor: "#5C3A21", borderColor: "#5C3A21" },
  interestText: { color: "#555" },
  interestTextActive: { color: "#fff" },
  saveButton: {
    backgroundColor: "#5C3A21",
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 25,
  },
  backButton: {
    backgroundColor: "#FDF6F0",
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#5C3A21",
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    shadowColor: "#5C3A21",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  backText: {
    color: "#5C3A21",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    shadowColor: "#5C3A21",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
