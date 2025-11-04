
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Messages from "@components/Messages";
import { useAuthStore } from "@store/useAuthStore";

import { useChatHistoryByMatchId, usePartnerByMatchId } from "@hooks/useApi";
import { useLocalSearchParams, useRouter } from "expo-router";
import ErrorState from "@components/Error";
import Loading from "@components/Loading";
import { User } from "src/types/User";
import { Message } from "src/types/Message";

import { useSocket } from "@hooks/useSocket";

export default function ChatDetail() {
  const { matchId } = useLocalSearchParams<{ matchId: string }>();
  
  const currentUser = useAuthStore((state) => state.user);
  
  const { partner } = usePartnerByMatchId(matchId);
  
  const { messages, mutateMessages } = useChatHistoryByMatchId(matchId);
  
  const [inputText, setInputText] = useState("");
  const router = useRouter();

  const socket = useSocket(matchId);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage: Message) => {
      mutateMessages((currentMessages: Message[] = []) => {
        if (currentMessages.find(m => m._id === newMessage._id)) {
          return currentMessages;
        }
        return [newMessage, ...currentMessages];
      }, false); 
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, mutateMessages]);

  const handleSend = () => {
    if (!inputText.trim() || !currentUser || !matchId) return;

    const tempMessage: Message = {
      text: inputText,
      senderId: currentUser._id! ,
      matchId: matchId! ,
      createdAt: new Date().toISOString(),
    };

    mutateMessages((currentMessages: Message[] = []) => [tempMessage, ...currentMessages], false);
    
    socket.emit('sendMessage', {
      matchId: matchId,
      text: inputText,
      senderId: currentUser._id, 
    });

    setInputText("");
  };


  const profile = partner?.profile;
  const avatarUri =
    profile?.photos?.[0] ??
    "https://cdn-icons-png.flaticon.com/512/847/847969.png";
  
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0} // (Điều chỉnh nếu cần)
        >
          {/* Header (giữ nguyên) */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={26} color="#FF6B9A" />
            </TouchableOpacity>
            <View style={styles.userInfo}>
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
              <Text style={styles.name}>{profile?.name}</Text>
            </View>
          </View>

          <FlatList
            data={messages}
            keyExtractor={(item) => item._id! }
            renderItem={({ item }) => (
              <Messages
                item={item}
                currentUser={currentUser as User}
                partner={partner!}
              />
            )}
            inverted 
            contentContainerStyle={{ padding: 10 }}
          />

          <View style={styles.inputBar}>
            <TouchableOpacity>
              <Ionicons name="image-outline" size={24} color="#FF6B9A" />
            </TouchableOpacity>

            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Nhắn tin..."
              style={styles.textInput}
            />

            <TouchableOpacity onPress={handleSend}>
              <Ionicons name="send" size={24} color="#FF6B9A" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  userInfo: { flexDirection: "row", alignItems: "center", marginLeft: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 8 },
  name: { fontSize: 16, fontWeight: "600", color: "#333" },
  messageContainer: {
    flexDirection: "row",
    marginVertical: 6,
    alignItems: "flex-end",
  },
  messageLeft: { justifyContent: "flex-start" },
  messageRight: { justifyContent: "flex-end", alignSelf: "flex-end" },
  avatarSmall: { width: 26, height: 26, borderRadius: 13, marginRight: 5 },
  bubble: { maxWidth: "75%", borderRadius: 16, padding: 10 },
  bubbleLeft: { backgroundColor: "#f2f2f2" },
  bubbleRight: { backgroundColor: "#FF6B9A" },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    padding: 10,
    backgroundColor: "#fff",
  },
  textInput: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginHorizontal: 10,
  },
});
