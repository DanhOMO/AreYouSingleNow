import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import type { User } from "src/types/User";

const { width } = Dimensions.get("window");

type SwipeCardProps = {
  user: User;
  onLike?: () => void;
  onDislike?: () => void;
};

const SwipeCard: React.FC<SwipeCardProps> = ({ user, onLike, onDislike }) => {
  return (
    <View style={styles.card}>
      {/* === ẢNH NỀN === */}
      <ImageBackground
        source={{
          uri: user.profile.photos?.[0] || "https://via.placeholder.com/400",
        }}
        resizeMode="cover"
        imageStyle={styles.imageStyle}
        style={styles.imageBackground}
      >
        <View style={styles.overlay} />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user.profile.name}</Text>
        </View>
      </ImageBackground>

      {/* === PHẦN BIO === */}
      <InfoSection title="My bio">
        <Text style={styles.text}>{user.profile.aboutMe}</Text>
      </InfoSection>

      {/* === PHẦN SỞ THÍCH === */}
      <InfoSection title="Sở thích">
        <View style={styles.interestContainer}>
          {user.detail.interested?.map((interest, i) => (
            <View key={i} style={styles.interestItem}>
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
        </View>
      </InfoSection>

      {/* === PHẦN GIÁO DỤC === */}
      <InfoSection title="Giáo dục">
        <View style={styles.singleTag}>
          <Text style={styles.tagText}>{user.detail.education}</Text>
        </View>
      </InfoSection>

      {/* === PHẦN CHIỀU CAO === */}
      <InfoSection title="Chiều cao">
        <View style={styles.singleTag}>
          <Text style={styles.tagText}>{user.detail.height}</Text>
        </View>
      </InfoSection>

      {/* === NÚT HÀNH ĐỘNG (Like/Dislike) === */}
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

/** --- COMPONENT PHỤ --- */
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

/** --- STYLES --- */
const styles = StyleSheet.create({
  card: {
    width: width * 0.9,
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  imageBackground: {
    width: "100%",
    height: 400,
    justifyContent: "flex-end",
    borderRadius: 30,
  },
  imageStyle: {
    borderRadius: 30,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  profileInfo: {
    padding: 20,
  },
  profileName: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
  },
  infoSection: {
    backgroundColor: "white",
    marginVertical: 10,
    padding: 25,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sectionTitle: {
    position: "absolute",
    top: 10,
    left: 15,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
    textAlign: "left",
    marginHorizontal: 10,
  },
  interestContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },
  interestItem: {
    backgroundColor: "rgb(243, 243, 243)",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 5,
  },
  interestText: {
    fontWeight: "bold",
  },
  singleTag: {
    backgroundColor: "rgb(243, 243, 243)",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignSelf: "flex-start",
  },
  tagText: {
    fontWeight: "bold",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    backgroundColor: "#fff",
  },
  btnLeft: {
    backgroundColor: "#eee",
    borderRadius: 30,
    padding: 10,
    width: 50,
    alignItems: "center",
  },
  btnRight: {
    backgroundColor: "#FF4F81",
    borderRadius: 30,
    padding: 10,
    width: 50,
    alignItems: "center",
  },
  btnIcon: {
    fontSize: 18,
    color: "white",
  },
});
