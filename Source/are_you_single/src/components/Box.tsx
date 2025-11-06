// Tệp: src/components/Box.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { Match } from "src/types/Match";
import { usePartnerByMatchId, chatDetail } from "@hooks/useApi";

interface BoxProps {
  item: Match;
}

const Box = ({ item }: BoxProps) => {
  const { partner, isLoading } = usePartnerByMatchId(item._id);
  const { message } = chatDetail(item.lastMessageId || "");
  const router = useRouter();
  const profile = partner?.profile;

  const avatarUri =
    profile?.photos?.[0] ??
    "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  return (
    <TouchableOpacity
      style={styles.chatItem}
      activeOpacity={0.8}
      onPress={() =>
        router.push({
          pathname: "/chat/[matchId]",
          params: { matchId: item._id },
        })
      }
    >
      <Image source={{ uri: avatarUri }} style={styles.avatar} />
      <View style={styles.chatInfo}>
        <Text style={styles.name}>
          {isLoading ? "Đang tải..." : (profile?.name ?? "Người dùng")}
        </Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {message?.text ?? "Say hi 👋"}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#FF6B9A" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: "#FF6B9A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 14,
    borderWidth: 1,
    borderColor: "#FFB0C1",
  },
  chatInfo: { flex: 1 },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4E3B31",
    marginBottom: 2,
  },
  lastMessage: {
    fontSize: 14,
    color: "#A76C8F",
  },
});

export default Box;
