// Tệp: app/(auth)/setup-profile.tsx

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
import {
  uploadAvatar,
  uploadPhoto,
  deletePhoto,
  updateProfile,
} from "@lib/api"; 
import { pickImageFromLibrary } from "src/services/imagePicker";

const interestsList = ["music", "travel", "coffee", "books", "movie"];

export default function SetupProfile() {
  const router = useRouter();
  const authStore = useAuthStore(); // Chỉ dùng để clearAuth

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema) as any,
    defaultValues: {
      photos: [],
      interested: [],
      gender: "female",
    },
  });

  const photos = watch("photos");
  const gender = watch("gender");
  const interested = watch("interested");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  
  const handleSelectAvatar = async () => {
    if (isUploading) return;
    const uri = await pickImageFromLibrary();
    if (!uri) return;

    setIsUploading(true);
    try {
        console.log("bat dau up anh");
      const updatedUser = await uploadAvatar(uri); 
      authStore.setUser(updatedUser);
      setValue("photos", updatedUser.profile.photos); 
      Alert.alert("Thành công", "Cập nhật ảnh đại diện thành công!");
    } catch (error) {
      console.error("Lỗi upload avatar:", error);
      Alert.alert("Lỗi", "Không thể upload ảnh đại diện.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddMoreImage = async () => {
    if(photos== null) return;
    if (photos.length >= 6) { 
      Alert.alert("Thông báo", "Bạn đã đạt số lượng ảnh tối đa (6 ảnh).");
      return;
    }
    if (isUploading) return;

    const uri = await pickImageFromLibrary();
    if (!uri) return;

    setIsUploading(true);
    try {
      // Gọi hàm 'uploadPhoto' từ 'api.ts'
      const updatedUser = await uploadPhoto(uri);
      authStore.setUser(updatedUser);
      setValue("photos", updatedUser.profile.photos); // Cập nhật form
      Alert.alert("Thành công", "Đã thêm ảnh mới!");
    } catch (error)
    {
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
            setValue("photos", updatedUser.profile.photos); // Cập nhật form
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
    if(!interested) return;
    const newSelected = interested.includes(item)
      ? interested.filter((i) => i !== item)
      : [...interested, item];
    setValue("interested", newSelected, { shouldValidate: true }); 
  };

  // === HÀM ONSUBMIT ĐÃ SỬA LẠI LUỒNG (THEO YÊU CẦU) ===
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
          photos: data.photos, // (Các hàm upload đã cập nhật 'photos')
        },
        detail: {
          height: parseFloat(data.height || "0") || 0,
          education: data.education,
          interested: data.interested,
        },
        location: data.location,
      };

      // 1. Gọi API updateProfile (vẫn cần token đang có)
      await updateProfile(body);

      // 2. ĐĂNG XUẤT (như bạn yêu cầu)
      await authStore.clearAuth(); 

      Alert.alert(
        "Hoàn tất!",
        "Hồ sơ của bạn đã được lưu. Vui lòng đăng nhập để bắt đầu."
      );
      
      // 3. CHUYỂN VỀ LOGIN (như bạn yêu cầu)
      router.replace("/(auth)/login");

    } catch (err) {
      console.error(err);
      Alert.alert("Lỗi", "Không thể lưu hồ sơ, vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };
  
  if (photos == null) return null;
  if (interested == null) return null;

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
          <Text style={styles.header}>Thiết lập Hồ sơ</Text>
          <Text style={styles.subtitle}>Điền các thông tin cơ bản để bắt đầu</Text>

          {/* Avatar */}
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={handleSelectAvatar}
            disabled={isUploading}
          >
            <Image
              source={
                photos[0]
                  ? { uri: photos[0] }
                  : require("src/assets/icon/imageHeart.png") // (Ảnh default)
              }
              style={styles.avatar}
            />
            {isUploading && (
              <ActivityIndicator
                style={styles.avatarLoading}
                size="large"
                color="#FF6B9A"
              />
            )}
            <Text style={styles.changePhotoText}>Chọn ảnh đại diện</Text>
          </TouchableOpacity>
          {/* Lỗi cho Avatar (nếu yêu cầu) */}
          {errors.photos && <Text style={styles.errorText}>{errors.photos.message}</Text>}

          {/* Ảnh phụ */}
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
                  <ActivityIndicator color="#FF6B9A" />
                ) : (
                  <Text style={{ fontSize: 24, color: "#FF6B9A" }}>＋</Text>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* Tên */}
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
                placeholder="Tên của bạn"
              />
            )}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

          {/* Ngày sinh */}
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
                    value={value || new Date()}
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

          {/* Giới tính */}
          <Text style={styles.label}>Giới tính</Text>
          <View style={styles.genderContainer}>
            {(["female", "male"] as const).map((g) => (
              <TouchableOpacity
                key={g}
                style={[
                  styles.genderButton,
                  gender === g && styles.genderActive,
                ]}
                onPress={() => setValue("gender", g)}
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
          
          {/* Giới thiệu */}
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
                placeholder="Một chút về bạn..."
              />
            )}
          />
          {errors.aboutMe && <Text style={styles.errorText}>{errors.aboutMe.message}</Text>}
          
          {/* Sở thích */}
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

          {/* Các trường phụ (SĐT, Học vấn, Chiều cao) */}
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

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSubmit(onSubmit)}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveText}>Lưu và Hoàn tất</Text>
            )}
          </TouchableOpacity>
          
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA", padding: 20 },
  header: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    color: "#2D2D2D",
  },
  avatarContainer: { alignItems: "center", marginBottom: 15, position: 'relative' },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#FF6B9A",
  },
  changePhotoText: { color: "#2D2D2D", marginTop: 8, fontWeight: "600" },
  extraPhotosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  extraPhoto: {
    width: 80,
    height: 80,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E0D4C8",
    marginBottom: 10,
    marginRight: 10, // Thêm
  },
  addPhotoButton: {
    width: 80,
    height: 80,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#FF6B9A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  deletePhotoButton: {
    position: "absolute",
    top: -5,
    right: 5, // Sửa (thay vì -5)
    backgroundColor: "#FF6B9A",
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  label: { fontSize: 14, fontWeight: "600", marginTop: 15, color: "#2D2D2D" },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginTop: 5,
    color: "#555",
    borderWidth: 1,
    borderColor: "#FF6B9A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
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
    minHeight: 48, // Thêm
    justifyContent: 'center', // Thêm
  },
  backButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#FF6B9A",
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  backText: {
    color: "#FF6B9A",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  // --- Thêm style từ 'HEAD' ---
  avatarLoading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(250,250,250,0.5)", // (Dùng màu nền 'main')
    borderRadius: 60,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    
  }
});