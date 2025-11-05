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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
// FIX LAYOUT 1: Import lại useSafeAreaInsets
import {
  SafeAreaProvider,
  useSafeAreaInsets,
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

type NewMessage = Message & { tempId?: string }  & {isTemporary: boolean};

export default function ChatDetail() {
  const { matchId } = useLocalSearchParams<{ matchId: string }>();
  const currentUser = useAuthStore((state) => state.user);
  const { partner, isError, isLoading } = usePartnerByMatchId(matchId);
  const { messages, mutateMessages } = useChatHistoryByMatchId(matchId);
  const [inputText, setInputText] = useState("");
  const router = useRouter();
  const socket = useSocket(matchId);
  

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage : NewMessage ) => {
      mutateMessages((currentMessages: Message[] = []) => {
        if (!currentMessages) currentMessages = []; 
        
        if (newMessage.senderId === currentUser?._id) {

          const tempMessageIndex = currentMessages.findIndex(
            (m) =>
              m.isTemporary === true && 
              m.senderId === newMessage.senderId &&
              m.text === newMessage.text
          );

          if (tempMessageIndex > -1) {
            const newCache = [...currentMessages];
            newCache[tempMessageIndex] = newMessage;
            return newCache; 
          }

          if (currentMessages.find((m) => m._id === newMessage._id)) {
            return currentMessages;
          }
          return [...currentMessages, newMessage];
        } else {
          if (currentMessages.find((m) => m._id === newMessage._id)) {
            return currentMessages; 
          }
          return [...currentMessages, newMessage];
        }
      }, false);
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, mutateMessages, currentUser]);

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
    
    mutateMessages(
      (currentMessages: Message[] = []) => {
         if (!currentMessages) currentMessages = [];
        return [...currentMessages, tempMessage];
      },
      false
    );

    socket.emit("sendMessage", {
      matchId: matchId,
      text: inputText,
      senderId: currentUser._id,
    });

    setInputText("");
  };

  if (isError) {
    return <ErrorState message="Load dữ liệu không thành công!!!" />;
  }
  if (isLoading || !partner) {
    return <Loading />;
  }

  const profile = partner?.profile;
  const avatarUri =
    profile?.photos?.[0] ??
    "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  return (
    <SafeAreaProvider>
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
        }}
      >
        <KeyboardAvoidingView
          style={styles.kavContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => router.push("/chat")}>
              <Ionicons name="chevron-back" size={26} color="#FF6B9A" />
            </TouchableOpacity>
            <View style={styles.headerProfile}>
              <Image source={{ uri: avatarUri }} style={styles.headerAvatar} />
              <Text style={styles.headerName}>{profile?.name}</Text>
            </View>
          </View>

          <View style= {styles.flatList}>
            <FlatList
            style={styles.listContainer} 
            data={messages}
            keyExtractor={(item) => item._id!.toString()}
            renderItem={({ item }) => (
              <Messages
                item={item}
                currentUser={currentUser as User}
                partner={partner!}
              />
            )}
            // inverted 
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={styles.listContentContainer}
          />
          </View>

          
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

const styles = StyleSheet.create({
  kavContainer: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
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
    color: "#333",
  },
  listContainer: {
    flex: 1, 
  },
  flatList:{
    height: "75%"
  },
  listContentContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  inputContainer: {
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
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
    fontSize: 16,
  },
});