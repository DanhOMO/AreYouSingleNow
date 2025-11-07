type UserProfile = {
  name?: string;
  dob?: Date;
  aboutMe?: string;
  photos?: string[];
};

type UserDetail = {
  interested?: string[];
  education?: string;
  height?: number;
};

type User = {
  profile?: UserProfile;
  detail?: UserDetail;
};

type SwipeCardProps = {
  user: User;
  onLike?: () => void;
  onDislike?: () => void;
};

import { Ionicons } from "@expo/vector-icons";
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

const { width, height } = Dimensions.get("window");

const ACCENT_COLOR = "#1A1A1A";
const SOFT_GRAY = "#EEEEEE";
const LIGHT_GRAY_BORDER = "#FF6B9A";
const WHITE = "#FFFFFF";

const InfoSection = ({
  title,
  children,
  style,
}: {
  title: string;
  children: React.ReactNode;
  style?: object;
}) => (
  <View style={[styles.infoSection, style]}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={{ marginTop: 10 }}>{children}</View>
  </View>
);

const SwipeCard: React.FC<SwipeCardProps> = ({ user, onLike, onDislike }) => {
  const photo =
    user?.profile?.photos?.[0] ??
    "https://placehold.co/400x600/C8C8C8/1A1A1A?text=Minimal+Image";
    const userName = user.profile?.name ?? "Người dùng ẩn danh";

    let userAge: number | null = null;
    const dob = user.profile?.dob;

    if (dob) { 
  const birthDate = new Date(dob);
  if (!isNaN(birthDate.getTime())) { 
    const today = new Date();
    userAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      userAge--;
    }
  }
}
  const infoSectionMarginStyle = {
    marginHorizontal: 0,
    marginVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: LIGHT_GRAY_BORDER,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  };

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
            style={styles.imageBackground}
          >
            <View style={styles.overlay} />
            <View style={styles.profileInfo}>
              <Text
                style={styles.profileName}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {userName}
              </Text>
              {userAge && userAge > 0 && <Text style={styles.profileAge}>{userAge} tuổi</Text>}
            </View>
          </ImageBackground>
          <TouchableOpacity style={styles.heartIcon}>
            <Ionicons name="heart" size={60} color={LIGHT_GRAY_BORDER} />
          </TouchableOpacity>

          <InfoSection title="My bio" style={infoSectionMarginStyle}>
            <Text style={styles.text}>
              {user.profile?.aboutMe ?? "Chưa có mô tả."}
            </Text>
          </InfoSection>

          {user.detail?.interested?.length > 0 && (
            <InfoSection title="Sở thích" style={infoSectionMarginStyle}>
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
            <InfoSection title="Giáo dục" style={infoSectionMarginStyle}>
              <View style={styles.singleTag}>
                <Text style={styles.tagText}>🎓 {user.detail.education}</Text>
              </View>
            </InfoSection>
          )}

          {user.detail?.height && (
            <InfoSection title="Chiều cao" style={infoSectionMarginStyle}>
              <View style={styles.singleTag}>
                <Text style={styles.tagText}>📏 {user.detail.height} cm</Text>
              </View>
            </InfoSection>
          )}

          {user.profile?.photos?.slice(1).map((p, i) => (
            <Image
              key={i}
              source={{ uri: p }}
              style={[
                styles.extraImage,
                {
                  width: width - width * 0.02 * 2 - 48,
                  marginHorizontal: 10,
                  alignSelf: "center",
                  marginBottom: 10,
                },
              ]}
            />
          ))}
        </View>
      </ScrollView>

      {(onLike || onDislike) && (
        <View style={styles.actionButtons}>
          {onDislike && (
            <TouchableOpacity
              onPress={onDislike}
              style={styles.btnLeftMinimal}
              activeOpacity={0.7}
            >
              <Text style={[styles.btnIconMinimal, { fontSize: 24 }]}>❌</Text>
            </TouchableOpacity>
          )}
          {onLike && (
            <TouchableOpacity
              onPress={onLike}
              style={styles.btnRightMinimal}
              activeOpacity={0.7}
            >
              <Text style={[styles.btnIconMinimal, { fontSize: 32 }]}>♥</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default SwipeCard;

const styles = StyleSheet.create({
  wrapper: {
    width: width,
    paddingHorizontal: width * 0.04,
    maxHeight: height * 0.9,
    backgroundColor: WHITE,
    overflow: "hidden",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  card: {
    position: "relative",
    backgroundColor: WHITE,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
    paddingBottom: 10,
  },
  imageBackground: {
    width: "100%",
    height: height * 0.55,
    justifyContent: "flex-end",
    marginBottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 250,
    overflow: "hidden",
  },
  heartIcon: {
    position: "absolute",
    top: height * 0.43,
    right: 20,
    backgroundColor: "white",
    borderRadius: 60,
    borderWidth: 1,
    borderColor: LIGHT_GRAY_BORDER,
    padding: 8,
    zIndex: 2,
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  profileInfo: {
    padding: 20,
    zIndex: 1,
    flexShrink: 1,
    width: width - 150,
  },
  profileName: {
    color: "white",
    fontSize: 32,
    fontWeight: "600",
  },
  profileAge: {
    color: "white",
    fontSize: 18,
    marginTop: 4,
    fontWeight: "400",
  },
  infoSection: {
    backgroundColor: WHITE,
    padding: 20,
  },
  sectionTitle: {
    fontWeight: "600",
    color: ACCENT_COLOR,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: LIGHT_GRAY_BORDER,
    alignSelf: "flex-start",
    paddingBottom: 4,
  },
  text: {
    fontSize: 16,
    color: ACCENT_COLOR,
    lineHeight: 24,
    fontWeight: "300",
  },
  interestContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
  },
  interestItem: {
    backgroundColor: SOFT_GRAY,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    margin: 5,
  },
  interestText: {
    fontWeight: "500",
    color: ACCENT_COLOR,
    fontSize: 14,
  },
  singleTag: {
    backgroundColor: SOFT_GRAY,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignSelf: "flex-start",
  },
  tagText: {
    fontWeight: "500",
    color: ACCENT_COLOR,
    fontSize: 14,
  },
  extraImage: {
    height: 350,
    borderRadius: 12,
    marginTop: 15,
  },
  actionButtons: {
    position: "absolute",
    bottom: 0,
    width: width,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: width * 0.04,
    zIndex: 10,
    backgroundColor: WHITE,
  },
  btnLeftMinimal: {
    backgroundColor: WHITE,
    borderRadius: 40,
    padding: 15,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: LIGHT_GRAY_BORDER,
  },
  btnRightMinimal: {
    backgroundColor: WHITE,
    borderRadius: 40,
    padding: 15,
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: ACCENT_COLOR,
  },
  // Icon Minimalist
  btnIconMinimal: {
    fontWeight: "normal",
    color: ACCENT_COLOR,
  },
});
