import { Partner } from "@hooks/useApi";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Message } from "src/types/Message";
import { User } from "src/types/User";
interface MessagesProps {
  item: Message,
  currentUser: User,
  partner: Partner
}
const Messages = ({ item, currentUser, partner }: MessagesProps) => {
    const isUser = item.senderId === currentUser._id;
    const avatarUri =
  partner?.profile.photos?.[0] ??
  "https://cdn-icons-png.flaticon.com/512/847/847969.png";
  return (
    <View
      style={[
        styles.messageContainer,
        isUser ? styles.messageRight : styles.messageLeft,
      ]}
    >
      {!isUser && partner && (
        <Image source={{ uri: avatarUri }} style={styles.avatarSmall} />
      )}
      <View
        style={[styles.bubble, isUser ? styles.bubbleRight : styles.bubbleLeft]}
      >
        <Text style={{ color: isUser ? "#fff" : "#333" }}>{item.text}</Text>
      </View>
    </View>
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

export default Messages;
