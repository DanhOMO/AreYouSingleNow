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
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAuthStore } from "@store/useAuthStore";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateProfileSchema,
  UpdateProfileData,
} from "src/lib/validation";

// Import các hàm API và service (Từ logic của bạn)
import { pickImageFromLibrary } from "src/services/imagePicker";
import {
  uploadAvatar,
  uploadPhoto,
  deletePhoto,
  updateProfile,
} from "src/lib/api";

const interestsList = ["music", "travel", "coffee", "books", "movie"];

const UpdateProfile = () => {
  const router = useRouter();
  const authStore = useAuthStore();
  const user = authStore.user;
  const initialGender: "female" | "male" =
    user?.profile?.gender === "male" ? "male" : "female";

  // --- LOGIC: React Hook Form (Từ HEAD) ---
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema) as any,
    defaultValues: {
      phone: user?.phone || "",
      status: user?.status || false,
      name: user?.profile?.name || "",
      gender: initialGender,
      aboutMe: user?.profile?.aboutMe || "",
      education: user?.detail?.education || "",
      height: user?.detail?.height?.toString() || "",
      interested: user?.detail?.interested || [],
      photos: user?.profile?.photos || [],
      dob: user?.profile?.dob ? new Date(user.profile.dob) : null,
      location: user?.location || { type: "Point", coordinates: [0, 0] },
    },
  });

  // Watchers để cập nhật UI (Từ HEAD)
  const photos = watch("photos");
  const gender = watch("gender");
  const interested = watch("interested");

  // State cho UI (DatePicker, Loading) (Từ HEAD)
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // --- LOGIC: Các hàm xử lý (Từ HEAD) ---
  const handleSelectAvatar = async () => {
    if (isUploading) return;
    const uri = await pickImageFromLibrary();
    if (!uri) return;

    setIsUploading(true);
    try {
      const updatedUser = await uploadAvatar(uri);
      authStore.setUser(updatedUser);
      setValue("photos", updatedUser.profile.photos); // Cập nhật form state
      Alert.alert("Thành công", "Cập nhật ảnh đại diện thành công!");
    } catch (error) {
      console.error("Lỗi upload avatar:", error);
      Alert.alert("Lỗi", "Không thể upload ảnh đại diện.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddMoreImage = async () => {
    if (photos == null) return;
    if (photos.length >= 6) {
      Alert.alert("Thông báo", "Bạn đã đạt số lượng ảnh tối đa (6 ảnh).");
      return;
    }
    if (isUploading) return;

    const uri = await pickImageFromLibrary();
    if (!uri) return;

    setIsUploading(true);
    try {
      const updatedUser = await uploadPhoto(uri);
      authStore.setUser(updatedUser);
      setValue("photos", updatedUser.profile.photos); // Cập nhật form state
      Alert.alert("Thành công", "Đã thêm ảnh mới!");
    } catch (error) {
      console.error("Lỗi thêm ảnh:", error);
      Alert.alert("Lỗi", "Không thể thêm ảnh mới.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePhoto = async (photoUrl: string) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa ảnh này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            const updatedUser = await deletePhoto(photoUrl);
            authStore.setUser(updatedUser);
            setValue("photos", updatedUser.profile.photos); // Cập nhật form state
            Alert.alert("Thành công", "Đã xóa ảnh.");
          } catch (error) {
            console.error("Lỗi xóa ảnh:", error);
            Alert.alert("Lỗi", "Không thể xóa ảnh.");
          }
        },
      },
    ]);
  };

  const handleToggleInterest = (item: string) => {
    if (!interested) return;
    const newSelected = interested.includes(item)
      ? interested.filter((i) => i !== item)
      : [...interested, item];
    setValue("interested", newSelected, { shouldValidate: true });
  };

  const onSubmit = async (data: UpdateProfileData) => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const body = {
        phone: data.phone,
        status: data.status,
        profile: {
          name: data.name,
          gender: data.gender,
          aboutMe: data.aboutMe,
          dob: data.dob,
        },
        detail: {
          height: parseFloat(data.height || "0") || 0,
          education: data.education,
          interested: data.interested,
        },
        location: data.location,
      };

      const updatedUser = await updateProfile(body);

      authStore.setUser(updatedUser);
      Alert.alert("Thành công", "Cập nhật hồ sơ thành công!");
      router.back();
    } catch (err) {
      console.error(err);
      Alert.alert("Lỗi", "Không thể kết nối đến server");
    } finally {
      setIsSaving(false);
    }
  };
  
  // --- LOGIC: Kiểm tra (Từ HEAD) ---
  if (photos == null) return null;
  if (interested == null) return null;

  // --- GIAO DIỆN: JSX (Từ HEAD) ---
  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 110 }} // Sửa lại padding
        >
          <Text style={styles.header}>Chỉnh sửa hồ sơ</Text>

          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={handleSelectAvatar}
            disabled={isUploading}
          >
            <Image
              source={
                photos[0]
                  ? { uri: photos[0] }
                  // Sử dụng require đúng cách
                  : require("../src/assets/icon/imageHeart.png") 
              }
              style={styles.avatar}
            />
            {isUploading && (
              <ActivityIndicator
                style={styles.avatarLoading} // Style này được thêm từ HEAD
                size="large"
                color="#5C3A21" // Màu từ 'main'
              />
            )}
            <Text style={styles.changePhotoText}>Thay đổi ảnh đại diện</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Ảnh bổ sung (Tối đa 5)</Text>
          <View style={styles.extraPhotosContainer}>
            {photos.slice(1).map((uri, index) => (
              <View
                key={index}
                style={{ position: "relative", marginRight: 10 }}
              >
                <Image source={{ uri }} style={styles.extraPhoto} />
                <TouchableOpacity
                  style={styles.deletePhotoButton}
                  onPress={() => handleDeletePhoto(uri)}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
            {photos.length < 6 && (
              <TouchableOpacity
                style={styles.addPhotoButton}
                onPress={handleAddMoreImage}
                disabled={isUploading}
              >
                {isUploading ? (
                  <ActivityIndicator color="#5C3A21" /> // Màu từ 'main'
                ) : (
                  <Text style={{ fontSize: 24, color: "#5C3A21" }}>＋</Text>
                )}
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.label}>Số điện thoại</Text>
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="phone-pad"
              />
            )}
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}

          <Text style={styles.label}>Ngày sinh</Text>
          <Controller
            control={control}
            name="dob"
            render={({ field: { value, onChange } }) => (
              <>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text>
                    {value ? new Date(value).toLocaleDateString() : "Chọn ngày"}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={value ? new Date(value) : new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, date) => {
                      setShowDatePicker(false);
                      if (date) onChange(date);
                    }}
                  />
                )}
              </>
            )}
          />
          {errors.dob && <Text style={styles.errorText}>{errors.dob.message}</Text>}

          <Text style={styles.label}>Trạng thái</Text>
          <Controller
            control={control}
            name="status"
            render={({ field: { onChange, value } }) => (
              <Switch value={value} onValueChange={onChange} />
            )}
          />
          {errors.status && <Text style={styles.errorText}>{errors.status.message}</Text>}

          <Text style={styles.label}>Tọa độ hiện tại</Text>
          <Controller
            control={control}
            name="location"
            render={({ field: { value } }) => (
              <Text style={{ marginBottom: 10 }}>
                Lat: {value?.coordinates[1]}, Lng: {value?.coordinates[0]}
              </Text>
            )}
          />

          <Text style={styles.label}>Tên</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

          <Text style={styles.label}>Giới tính</Text>
          <View style={styles.genderContainer}>
            {(["female", "male"] as const).map((g: "female" | "male") => (
              <TouchableOpacity
                key={g}
                style={[
                  styles.genderButton,
                  gender === g && styles.genderActive, // Dùng `gender` từ `watch()`
                ]}
                onPress={() => setValue("gender", g)} // Dùng `setValue`
              >
                <Text
                  style={[
                    styles.genderText,
                    gender === g && styles.genderTextActive,
                  ]}
                >
                  {g === "female" ? "Nữ" : "Nam"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.gender && <Text style={styles.errorText}>{errors.gender.message}</Text>}

          <Text style={styles.label}>Chiều cao (cm)</Text>
          <Controller
            control={control}
            name="height"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="numeric"
              />
            )}
          />
          {errors.height && <Text style={styles.errorText}>{errors.height.message}</Text>}

          <Text style={styles.label}>Học vấn</Text>
          <Controller
            control={control}
            name="education"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.education && <Text style={styles.errorText}>{errors.education.message}</Text>}

          <Text style={styles.label}>Giới thiệu</Text>
          <Controller
            control={control}
            name="aboutMe"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, { height: 100 }]}
                multiline
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.aboutMe && <Text style={styles.errorText}>{errors.aboutMe.message}</Text>}

          <Text style={styles.label}>Sở thích</Text>
          <View style={styles.interestContainer}>
            {interestsList.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.interestButton,
                  interested.includes(item) && styles.interestActive,
                ]}
                onPress={() => handleToggleInterest(item)}
              >
                <Text
                  style={[
                    styles.interestText,
                    interested.includes(item) &&
                      styles.interestTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.interested && <Text style={styles.errorText}>{errors.interested.message}</Text>}

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSubmit(onSubmit)} // Dùng `handleSubmit`
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveText}>Lưu thay đổi</Text>
            )}
          </TouchableOpacity>
          
          {/* Nút Back của 'main' được giữ lại trong style nhưng không
              được render trong JSX của 'HEAD', 
              bạn có thể thêm lại nếu muốn
          <TouchableOpacity
             style={styles.backButton}
             onPress={() => router.back()}
           >
             <Text style={styles.backText}>Quay lại</Text>
           </TouchableOpacity>
          */}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UpdateProfile;

// --- STYLES: Gộp (Theme 'main' + Logic 'HEAD') ---
const styles = StyleSheet.create({
  // Bắt đầu Style từ 'main' (UI của bạn bạn)
  container: { flex: 1, backgroundColor: "#FFF5E6", padding: 20 },
  header: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    color: "#5C3A21",
  },
  avatarContainer: { alignItems: "center", marginBottom: 15, position: "relative" }, // Thêm 'position'
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
    marginRight: 10, // Thêm
    marginBottom: 10, // Thêm
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
    right: 5, // Sửa lại
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
    borderColor: "#FDF6F0",
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
    minHeight: 48, // Thêm từ HEAD
    justifyContent: "center", // Thêm từ HEAD
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

  // --- Style được thêm từ 'HEAD' để logic hoạt động ---
  avatarLoading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,245,230,0.5)", // Dùng màu nền của 'main'
    borderRadius: 60,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 8,
  },
});