import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  SafeAreaProvider,
  // (Bỏ useSafeAreaInsets vì <View> của 'main' đã xử lý)
} from "react-native-safe-area-context";
import Messages from "@components/Messages";
import { useAuthStore } from "@store/useAuthStore";
import { useChatHistoryByMatchId, usePartnerByMatchId } from "@hooks/useApi";
import { useLocalSearchParams, useRouter } from "expo-router";
import ErrorState from "@components/Error";
import Loading from "@components/Loading";
import { User } from "src/types/User";
import { Message } from "src/types/Message";
import { useSocket } from "@hooks/useSocket";

// Định nghĩa kiểu cho tin nhắn tạm (từ HEAD/main)
type NewMessage = Message & { tempId?: string } & { isTemporary: boolean };

export default function ChatDetail() {
  const { matchId } = useLocalSearchParams<{ matchId: string }>();
  const currentUser = useAuthStore((state) => state.user);
  const { partner, isError, isLoading } = usePartnerByMatchId(matchId);
  const { messages,  mutateMessages } = useChatHistoryByMatchId(matchId); // Đổi tên mutate
  const [inputText, setInputText] = useState("");
  const router = useRouter();
  const socket = useSocket(matchId);

  // LOGIC: Lắng nghe tin nhắn mới (từ main)
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage: NewMessage) => {
      mutateMessages((currentMessages: Message[] = []) => {
        if (!currentMessages) currentMessages = [];

        // Nếu tin nhắn là của TÔI (tin nhắn thật thay thế tin nhắn tạm)
        if (newMessage.senderId === currentUser?._id) {
          const tempMessageIndex = currentMessages.findIndex(
            (m) =>
              (m as any).isTemporary === true &&
              m.senderId === newMessage.senderId &&
              m.text === newMessage.text
          );

          // Nếu tìm thấy tin nhắn tạm, thay thế nó
          if (tempMessageIndex > -1) {
            const newCache = [...currentMessages];
            newCache[tempMessageIndex] = newMessage;
            return newCache;
          }

          // Nếu không tìm thấy (hoặc đã có), kiểm tra trùng lặp
          if (currentMessages.find((m) => m._id === newMessage._id)) {
            return currentMessages;
          }
          return [newMessage, ...currentMessages]; // Sửa: Thêm vào đầu (vì inverted)
        } else {
          // Nếu tin nhắn là của PARTNER
          if (currentMessages.find((m) => m._id === newMessage._id)) {
            return currentMessages;
          }
          return [newMessage, ...currentMessages]; // Sửa: Thêm vào đầu (vì inverted)
        }
      }, false);
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, mutateMessages, currentUser]);

  // LOGIC: Gửi tin nhắn (từ main)
  const handleSend = () => {
    if (!inputText.trim() || !currentUser || !matchId) return;

    const tempId = `temp_${Date.now()}`;
    const tempMessage = {
      _id: tempId,
      text: inputText,
      senderId: currentUser._id!,
      matchId: matchId!,
      createdAt: new Date().toISOString(),
      isTemporary: true,
    };

    // Cập nhật UI ngay lập tức (Optimistic UI)
    mutateMessages((currentMessages: Message[] = []) => {
      if (!currentMessages) currentMessages = [];
      return [tempMessage, ...currentMessages]; // Sửa: Thêm vào đầu (vì inverted)
    }, false);

    // Gửi qua socket
    socket.emit("sendMessage", {
      matchId: matchId,
      text: inputText,
      senderId: currentUser._id,
    });

    setInputText("");
  };

  // LOGIC: Nút gọi Video (từ HEAD)
  const handleVideoCall = (callID: string) => {
    if (!matchId) {
      Alert.alert("Lỗi", "Không tìm thấy thông tin cuộc trò chuyện.");
      return;
    }
    router.push(`/chat/call/${callID}`);
  };

  // ... (Code if (isError), if (isLoading) giữ nguyên)

  const profile = partner?.profile;
  const avatarUri =
    profile?.photos?.[0] ??
    "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  // --- GIAO DIỆN: Gộp ---
  return (
    <SafeAreaProvider>
      {/* View thay thế SafeAreaView (từ HEAD) */}
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <KeyboardAvoidingView
          style={styles.kavContainer} // Style từ 'main'
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          // (Bỏ keyboardVerticalOffset)
        >
          {/* Header (từ HEAD, có nút Video Call) */}
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => router.push("/chat")}>
              <Ionicons name="chevron-back" size={26} color="#FF6B9A" />
            </TouchableOpacity>
            <View style={styles.headerProfile}>
              <Image source={{ uri: avatarUri }} style={styles.headerAvatar} />
              <Text style={styles.headerName}>{profile?.name}</Text>
            </View>

            <View style={{ flex: 1 }} />

            <TouchableOpacity
              onPress={() => handleVideoCall(matchId)}
              style={styles.videoButton} // Thêm style
            >
              <Ionicons name="videocam-outline" size={28} color="#FF6B9A" />
            </TouchableOpacity>
          </View>

          {/* FlatList (từ HEAD, có 'inverted') */}
          <View style={styles.flatList}>
            <FlatList
              style={styles.listContainer}
              data={messages}
              keyExtractor={(item) => item._id!.toString()}
              renderItem={({ item }) => (
                <Messages
                  item={item as NewMessage}
                  currentUser={currentUser as User}
                  partner={partner!}
                />
              )}
              inverted // <-- Giữ lại từ HEAD
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              contentContainerStyle={styles.listContentContainer}
            />
          </View>

          {/* Input Bar (từ main, có style đẹp hơn) */}
          <View style={styles.inputContainer}>
            <TouchableOpacity>
              <Ionicons name="image-outline" size={24} color="#FF6B9A" />
            </TouchableOpacity>
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Nhắn tin..."
              style={styles.textInput}
              multiline
              autoCorrect={false}
              textAlignVertical="top"
              underlineColorAndroid="transparent"
              keyboardType="default"
            />
            <TouchableOpacity onPress={handleSend}>
              <Ionicons name="send" size={24} color="#FF6B9A" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaProvider>
  );
}

// --- STYLES: Ưu tiên 'main' (style đẹp hơn) ---
const styles = StyleSheet.create({
  kavContainer: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#FDE3EB", // Màu 'main'
    shadowColor: "#FF6B9A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
  headerProfile: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  headerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF6B9A", // Màu 'main'
  },
  // Style cho nút video (từ HEAD)
  videoButton: {
    paddingLeft: 10,
  },
  listContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  flatList: {
    flex: 1, // Sửa: Dùng 'flex: 1' thay vì 'height: 75%'
  },
  listContentContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 20, // Tăng padding
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#FDE3EB",
    padding: 10,
    backgroundColor: "#fff",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
  textInput: {
    flex: 1,
    backgroundColor: "white", // Màu 'main'
    borderRadius: 25, // Màu 'main'
    paddingHorizontal: 15,
    marginHorizontal: 10,
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
    fontSize: 16,
    color: "black",
  },
});