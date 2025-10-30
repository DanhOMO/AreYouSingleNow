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

export default function ChatDetail() {
  const { matchId } = useLocalSearchParams<{ matchId: string }>();
  const authStore = useAuthStore();
  const { partner, isError, isLoading } = usePartnerByMatchId(matchId);
  const { messages } = useChatHistoryByMatchId(matchId);
  const [inputText, setInputText] = useState("");
  const router = useRouter();
  // const handleSend = () => {
  //   if (!inputText.trim()) return;

  //   const newMessage = {
  //     id: Math.random().toString(),
  //     text: inputText,
  //     sender: currentUser.name,
  //     createdAt: new Date().toISOString(),
  //   };

  //   setMessages([newMessage, ...messages]);
  //   setInputText("");
  // };
  const avatarUri =
  partner?.photos?.[0] ??
  "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  if (isError) {
    return <ErrorState message="Load dữ liệu không thành công!!!" />;
  }
  if (isLoading || !partner) {
    return <Loading />;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={26} color="#FF6B9A" />
            </TouchableOpacity>
            <View style={styles.userInfo}>
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
              <Text style={styles.name}>{partner.name}</Text>
            </View>
          </View>

          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={(root) => (
              <Messages
                item={root.item}
                currentUser={authStore.user}
                partner={partner}
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

            <TouchableOpacity
            //  onPress={handleSend}
             >
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
