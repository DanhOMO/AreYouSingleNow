// Tệp: src/components/Box.tsx

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Image, TouchableOpacity } from "react-native";
import { Match } from "src/types/Match"; 
import { usePartnerByMatchId } from "@hooks/useApi"; 

interface BoxProps {
  item: Match;
}

const Box = ({ item }: BoxProps) => {
  
  const { partner, isLoading, isError } = usePartnerByMatchId(item.id);
  const router = useRouter();

const avatarUri =
  partner?.photos?.[0] ??
  "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  return (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => 
      router.push({
          pathname: '/chat/[matchId]',
          params: { matchId: item.id }
  })
}
    >
      <Image source={{ uri: avatarUri }} style={styles.avatar} />
      <View style={styles.chatInfo}>
        
        <Text style={styles.name}>{isLoading ? "Đang tải..." : partner?.name}</Text>
        <Text style={styles.lastMessage}>
          {item.lastMessage ? item.lastMessage.text : "Say hi 👋"}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={22} color="#ccc" />
    </TouchableOpacity>
  );
};

// (Giữ nguyên styles của bạn)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginLeft: 20,
    marginBottom: 10,
    color: "#FF6B9A",
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  chatInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  lastMessage: {
    fontSize: 14,
    color: "#777",
    marginTop: 2,
  },
});

export default Box;