import { Partner } from "@hooks/useApi";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Message } from "src/types/Message";
import { User } from "src/types/User";

interface MessagesProps {
  item: Message;
  currentUser: User;
  partner: Partner; 
}

const Messages = ({ item, currentUser, partner }: MessagesProps) => {
  let senderId: string;
  if (typeof item.senderId === 'string') {
    senderId = item.senderId;
  } else {
    senderId = (item.senderId as User)?._id || "";
  }
  const isUser = senderId === currentUser._id;

  const avatarUri =
    partner?.profile.photos?.[0] ??
    "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  const formattedTime = new Date(item.createdAt).toLocaleTimeString('default', {
    hour: '2-digit',
    minute: '2-digit',
  });

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
        
        <Text style={[
            styles.timestampText, // Style chung (chữ nhỏ)
            isUser ? styles.timestampRight : styles.timestampLeft 
        ]}>
          {formattedTime}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: "row",
    marginVertical: 6,
    alignItems: "flex-end",
  },
  messageLeft: { justifyContent: "flex-start" },
  messageRight: { justifyContent: "flex-end", alignSelf: "flex-end" },
  avatarSmall: { width: 26, height: 26, borderRadius: 13, marginRight: 5 },
  bubble: { 
    maxWidth: "75%", 
    borderRadius: 16, 
    padding: 10,
    paddingBottom: 6, // Giảm padding dưới 1 chút
  },
  bubbleLeft: {
    backgroundColor: "#F0F0F0",
    borderRadius: 15,
  },
  bubbleRight: { 
    backgroundColor: "#FF6B9A" 
  },
  
  timestampText: {
    fontSize: 10,
    marginTop: 4, // Khoảng cách với tin nhắn
  },
  timestampLeft: {
    alignSelf: 'flex-start', 
    color: '#666',
  },
  timestampRight: {
    alignSelf: 'flex-end', 
    color: '#eee', 
  },

  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "white",
    padding: 10,
    backgroundColor: "white",
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