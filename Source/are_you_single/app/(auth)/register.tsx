// import React, { useState } from "react";
// import {
//   Text,
//   View,
//   StyleSheet,
//   TouchableOpacity,
//   TextInput,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   ActivityIndicator,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { useRouter } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import api from "@lib/api";
// import { useAuthStore } from "@store/useAuthStore";

// // ✅ Schema kiểm tra dữ liệu
// const registerSchema = z
//   .object({
//     email: z.string().email("Email không hợp lệ"),
//     password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
//     confirmPassword: z.string(),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Mật khẩu không khớp",
//     path: ["confirmPassword"],
//   });

// type RegisterData = z.infer<typeof registerSchema>;

// export default function Register() {
//   const router = useRouter();
//   const { setUser, setToken } = useAuthStore();
//   const [isLoading, setIsLoading] = useState(false);

//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<RegisterData>({
//     resolver: zodResolver(registerSchema),
//   });

//   const onSubmit = async (data: RegisterData) => {
//     setIsLoading(true);
//     try {
//       const res = await api.post("/auth/register", {
//         email: data.email,
//         password: data.password,
//       });

//       const result = res.data;
//       console.log("REGISTER RESULT:", result);

//       if (result?.success || (result?.token && result?.user)) {
//         if (result?.token && result?.user) {
//           await setUser(result.user);
//           await setToken(result.token);
//         }

//         Alert.alert(
//           "Thành công 💖",
//           result?.message || "Tài khoản của bạn đã được tạo!"
//         );

//         setTimeout(() => {
//           router.replace("/(main)/update-profile");
//         }, 300);
//       } else {
//         Alert.alert("Thất bại", result?.message || "Vui lòng thử lại sau.");
//       }
//     } catch (error: any) {
//       console.error("Lỗi khi đăng ký:", error);
//       Alert.alert(
//         "Đăng ký thất bại",
//         error.response?.data?.message || "Đã xảy ra lỗi không xác định."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       style={{ flex: 1 }}
//     >
//       <LinearGradient
//         colors={["#FFC0CB", "#FF6B9A", "#FF4F81"]}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 0, y: 1 }}
//         style={styles.container}
//       >
//         {/* Nút quay lại */}
//         <TouchableOpacity
//           onPress={() => router.back()}
//           style={styles.backButton}
//         >
//           <Ionicons name="arrow-back" size={26} color="#fff" />
//         </TouchableOpacity>

//         <Text style={styles.title}>Create Account</Text>
//         <Text style={styles.subtitle}>Join us and start your journey</Text>

//         <View style={styles.formContainer}>
//           {/* Email */}
//           <Controller
//             control={control}
//             name="email"
//             render={({ field: { onChange, onBlur, value } }) => (
//               <TextInput
//                 style={styles.input}
//                 placeholder="Email"
//                 placeholderTextColor="#FF9BBF"
//                 value={value}
//                 onBlur={onBlur}
//                 onChangeText={onChange}
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//               />
//             )}
//           />
//           {errors.email && (
//             <Text style={styles.errorText}>{errors.email.message}</Text>
//           )}

//           <Controller
//             control={control}
//             name="password"
//             render={({ field: { onChange, onBlur, value } }) => (
//               <TextInput
//                 style={styles.input}
//                 placeholder="Mật khẩu"
//                 placeholderTextColor="#FF9BBF"
//                 value={value}
//                 onBlur={onBlur}
//                 onChangeText={onChange}
//                 secureTextEntry
//               />
//             )}
//           />
//           {errors.password && (
//             <Text style={styles.errorText}>{errors.password.message}</Text>
//           )}

//           {/* Xác nhận mật khẩu */}
//           <Controller
//             control={control}
//             name="confirmPassword"
//             render={({ field: { onChange, onBlur, value } }) => (
//               <TextInput
//                 style={styles.input}
//                 placeholder="Xác nhận mật khẩu"
//                 placeholderTextColor="#FF9BBF"
//                 value={value}
//                 onBlur={onBlur}
//                 onChangeText={onChange}
//                 secureTextEntry
//               />
//             )}
//           />
//           {errors.confirmPassword && (
//             <Text style={styles.errorText}>
//               {errors.confirmPassword.message}
//             </Text>
//           )}

//           {/* Nút đăng ký */}
//           <TouchableOpacity
//             onPress={handleSubmit(onSubmit)}
//             style={styles.shadowWrapper}
//             disabled={isLoading}
//             activeOpacity={0.85}
//           >
//             <LinearGradient
//               colors={["#FF6B9A", "#E91E63"]}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 0 }}
//               style={styles.button}
//             >
//               {isLoading ? (
//                 <ActivityIndicator color="#fff" />
//               ) : (
//                 <Text style={styles.buttonText}>Sign Up</Text>
//               )}
//             </LinearGradient>
//           </TouchableOpacity>
//         </View>

//         {/* Chuyển sang login */}
//         <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
//           <Text style={styles.linkText}>
//             Already have an account?{" "}
//             <Text style={styles.linkHighlight}>Sign In</Text>
//           </Text>
//         </TouchableOpacity>
//       </LinearGradient>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 20,
//   },
//   backButton: {
//     position: "absolute",
//     top: 60,
//     left: 20,
//     backgroundColor: "rgba(255,255,255,0.2)",
//     padding: 8,
//     borderRadius: 20,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: "800",
//     color: "#fff",
//     marginBottom: 5,
//     letterSpacing: 0.8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "rgba(255,255,255,0.9)",
//     marginBottom: 40,
//   },
//   formContainer: {
//     width: "100%",
//   },
//   input: {
//     backgroundColor: "rgba(255,255,255,0.9)",
//     width: "100%",
//     padding: 15,
//     borderRadius: 25,
//     marginBottom: 15,
//     fontSize: 16,
//     color: "#FF4F81",
//   },
//   errorText: {
//     color: "#FFD1DC",
//     alignSelf: "flex-start",
//     marginLeft: 20,
//     marginBottom: 8,
//     fontSize: 13,
//   },
//   shadowWrapper: {
//     borderRadius: 25,
//     shadowColor: "#E91E63",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//     elevation: 6,
//     marginTop: 10,
//     overflow: "hidden",
//   },
//   button: {
//     padding: 15,
//     borderRadius: 25,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "700",
//     letterSpacing: 0.5,
//   },
//   linkText: {
//     color: "#fff",
//     marginTop: 30,
//     fontSize: 14,
//   },
//   linkHighlight: {
//     color: "#FFE1EB",
//     fontWeight: "bold",
//     textDecorationLine: "underline",
//   },
// });

import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@lib/api";
import { useAuthStore } from "@store/useAuthStore";

// ✅ Schema kiểm tra dữ liệu
const registerSchema = z
  .object({
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

type RegisterData = z.infer<typeof registerSchema>;

export default function Register() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const res = await api.post("/auth/register", {
        email: data.email,
        password: data.password,
      });

      const result = res.data;
      console.log("REGISTER RESULT:", result);

      if (result?.success || (result?.token && result?.user)) {
        if (result?.token && result?.user) {
          await setUser(result.user);
          await setToken(result.token);
        }

        Alert.alert(
          "Thành công",
          result?.message || "Tài khoản của bạn đã được tạo!"
        );

        setTimeout(() => {
          router.replace("/(main)/update-profile");
        }, 300);
      } else {
        Alert.alert("Thất bại", result?.message || "Vui lòng thử lại sau.");
      }
    } catch (error: any) {
      console.error("Lỗi khi đăng ký:", error);
      Alert.alert(
        "Đăng ký thất bại",
        error.response?.data?.message || "Đã xảy ra lỗi không xác định."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <LinearGradient
        colors={["#FF6B9A", "#FFC0CB", "#E91E63"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.container}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={26} color="white" />
        </TouchableOpacity>

        <Text style={styles.title}>Tạo tài khoản</Text>
        <Text style={styles.subtitle}>Bắt đầu hành trình của bạn nào!</Text>

        <View style={styles.formContainer}>
          {/* Email */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email.message}</Text>
          )}

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                secureTextEntry
              />
            )}
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password.message}</Text>
          )}

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#999"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                secureTextEntry
              />
            )}
          />
          {errors.confirmPassword && (
            <Text style={styles.errorText}>
              {errors.confirmPassword.message}
            </Text>
          )}

          {/* Nút đăng ký */}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            style={styles.shadowWrapper}
            disabled={isLoading}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={["#FF6B9A", "#E91E63"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Đăng ký</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
          <Text style={styles.linkText}>
            Bạn đã có mật khẩu?{" "}
            <Text style={styles.linkHighlight}>Đăng nhập</Text>
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    padding: 8,
    borderRadius: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "white",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: "white",
    marginBottom: 40,
  },
  formContainer: {
    width: "100%",
  },
  input: {
    backgroundColor: "#fff",
    width: "100%",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#eee",
  },
  errorText: {
    color: "#c94f4f",
    alignSelf: "flex-start",
    marginLeft: 10,
    marginBottom: 8,
    fontSize: 13,
  },
  shadowWrapper: {
    borderRadius: 20,
    shadowColor: "#aaa",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    marginTop: 10,
    overflow: "hidden",
  },
  button: {
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  linkText: {
    color: "white",
    marginTop: 30,
    fontSize: 14,
  },
  linkHighlight: {
    color: "white",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
