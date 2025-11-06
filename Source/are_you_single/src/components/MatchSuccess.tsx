import React, { useEffect } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useAuthStore } from "@store/useAuthStore";
import { useRouter } from "expo-router";
import { User } from "src/types/User";
import { LinearGradient } from "expo-linear-gradient";
import { usePartnerByMatchId } from "@hooks/useApi";

type PopulatedMatch = {
  _id: string;
  userIds: User[];
};

type MatchSuccessProps = {
  isVisible: boolean;
  onClose: () => void;
  match: PopulatedMatch | null;
};

export default function MatchSuccess({
  isVisible,
  onClose,
  match,
}: MatchSuccessProps) {
  const router = useRouter();

  const currentUser = useAuthStore((state) => state.user);
  const { partner } = usePartnerByMatchId(match?._id || "");

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  if (!match || !currentUser) {
    return null;
  }

  if (!partner) {
    return (
      <Modal visible={isVisible} transparent={true} animationType="fade">
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#FF6B9A" />
          <Text style={{ color: "white", marginTop: 10 }}>
            Đang tải thông tin đối tác...
          </Text>
        </View>
      </Modal>
    );
  }

  const currentUserAvatar =
    currentUser.profile?.photos?.[0] ??
    "https://example.com/default-avatar.png";
  const partnerAvatar =
    partner.profile?.photos?.[0] ?? "https://example.com/default-avatar.png";

  const handleSendMessage = () => {
    onClose();
    router.push({
      pathname: "/chat/[matchId]",
      params: { matchId: match._id },
    });
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>It's a Match! 💘</Text>
          <Text style={styles.subtitle}>
            Bạn và {partner.profile.name} đã thích nhau.
          </Text>

          <View style={styles.avatarContainer}>
            <Image source={{ uri: currentUserAvatar }} style={styles.avatar} />
            <Image
              source={{ uri: partnerAvatar }}
              style={[styles.avatar, styles.avatarRight]}
            />
          </View>

          <TouchableOpacity onPress={handleSendMessage}>
            <LinearGradient
              colors={["#FF6B9A", "#FF4F81"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonSend}
            >
              <Text style={styles.buttonSendText}>Gửi tin nhắn</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonClose} onPress={onClose}>
            <Text style={styles.buttonCloseText}>Tiếp tục quẹt</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    width: "90%",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF4F81",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 25,
  },
  avatarContainer: {
    flexDirection: "row",
    marginBottom: 30,
    width: 220,
    justifyContent: "center",
    position: "relative",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "white",
    zIndex: 1,
  },
  avatarRight: {
    position: "absolute",
    left: 100,
    zIndex: 0,
  },
  buttonSend: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonSendText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonClose: {
    paddingVertical: 15,
  },
  buttonCloseText: {
    color: "#888",
    fontSize: 16,
    fontWeight: "bold",
  },
});
