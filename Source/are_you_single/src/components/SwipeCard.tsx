import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import type { User } from "src/types/User";

const { width, height } = Dimensions.get("window");

type SwipeCardProps = {
  user: User;
  onLike?: () => void;
  onDislike?: () => void;
};

const SwipeCard: React.FC<SwipeCardProps> = ({ user, onLike, onDislike }) => {
  const photo = user?.profile?.photos?.[0] ?? "https://via.placeholder.com/400";

  return (
    <View style={styles.wrapper}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <ImageBackground
            source={{ uri: photo }}
            resizeMode="cover"
            imageStyle={styles.imageStyle}
            style={styles.imageBackground}
          >
            <View style={styles.overlay} />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.profile?.name}</Text>
            </View>
          </ImageBackground>

          <InfoSection title="My bio">
            <Text style={styles.text}>{user.profile?.aboutMe ?? "Chưa có mô tả."}</Text>
          </InfoSection>
          {user.detail?.interested?.length > 0 && (
            <InfoSection title="Sở thích">
              <View style={styles.interestContainer}>
                {user.detail.interested.map((i, idx) => (
                  <View key={idx} style={styles.interestItem}>
                    <Text style={styles.interestText}>{i}</Text>
                  </View>
                ))}
              </View>
            </InfoSection>
          )}

          {user.detail?.education && (
            <InfoSection title="Giáo dục">
              <View style={styles.singleTag}>
                <Text style={styles.tagText}>🎓 {user.detail.education}</Text>
              </View>
            </InfoSection>
          )}

          {user.detail?.height && (
            <InfoSection title="Chiều cao">
              <View style={styles.singleTag}>
                <Text style={styles.tagText}>📏 {user.detail.height} cm</Text>
              </View>
            </InfoSection>
          )}

          {user.profile?.photos?.slice(1).map((p, i) => (
            <Image key={i} source={{ uri: p }} style={styles.extraImage} />
          ))}
        </View>
      </ScrollView>

      {(onLike || onDislike) && (
        <View style={styles.actionButtons}>
          {onDislike && (
            <TouchableOpacity onPress={onDislike} style={styles.btnLeft}>
              <Text style={styles.btnIcon}>❌</Text>
            </TouchableOpacity>
          )}
          {onLike && (
            <TouchableOpacity onPress={onLike} style={styles.btnRight}>
              <Text style={styles.btnIcon}>💗</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const InfoSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View style={styles.infoSection}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={{ marginTop: 20 }}>{children}</View>
  </View>
);

export default SwipeCard;

const styles = StyleSheet.create({
  wrapper: {
    width: width * 0.95,
    alignSelf: "center",
    marginVertical: 10,
    maxHeight: height * 0.92,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
    paddingBottom: 10,
  },
  imageBackground: {
    width: "100%",
    height: height * 0.53,
    justifyContent: "flex-end",
  },
  imageStyle: {
    borderRadius: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  profileInfo: {
    padding: 18,
  },
  profileName: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },
  infoSection: {
    backgroundColor: "white",
    marginVertical: 8,
    padding: 20,
  },
  sectionTitle: {
    position: "absolute",
    top: 8,
    left: 12,
    fontWeight: "700",
  },
  text: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
  interestContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  interestItem: {
    backgroundColor: "rgb(243,243,243)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 6,
  },
  interestText: {
    fontWeight: "700",
  },
  singleTag: {
    backgroundColor: "rgb(243,243,243)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: "flex-start",
  },
  tagText: {
    fontWeight: "700",
  },
  extraImage: {
    width: "100%",
    height: 320,
    borderRadius: 12,
    marginTop: 10,
  },
  actionButtons: {
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "space-around",
    paddingVertical: 12,
    marginTop: 8,
  },
  btnLeft: {
    backgroundColor: "#eee",
    borderRadius: 30,
    padding: 10,
    width: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  btnRight: {
    backgroundColor: "#FF4F81",
    borderRadius: 30,
    padding: 10,
    width: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  btnIcon: {
    fontSize: 18,
    color: "white",
  },
  scrollContent: {
    paddingBottom: 10,
  },
});
