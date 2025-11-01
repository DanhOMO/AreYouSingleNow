import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import Swiper from "react-native-deck-swiper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { useUserSuggestions } from "@hooks/useApi";
import type { User } from "src/types/User";
import api from "src/lib/api";
import Loading from "@components/Loading";
import SwipeCard from "@components/SwipeCard";
const Home = () => {
  const [index, setIndex] = useState(0);
  const swipeDirection = useRef(new Animated.Value(0)).current;
  const swiperRef = useRef<Swiper<User>>(null);

  const { suggestions, isLoading, isError } = useUserSuggestions();

  const handleLike = (cardIndex: number) => {
    const user = suggestions?.[cardIndex];
    if (!user) return;

    console.log("LIKE user:", user._id);
    api.post("/swipes/like", { targetUserId: user._id });
  };

  const handleDislike = (cardIndex: number) => {
    const user = suggestions?.[cardIndex];
    if (!user) return;

    console.log("DISLIKE user:", user._id);
    api.post("/swipes/dislike", { targetUserId: user._id });
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <SafeAreaView style={[style.container, { justifyContent: "center" }]}>
        <Text style={{ color: "red" }}>
          Lỗi khi tải dữ liệu. Vui lòng thử lại.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={style.container}>
        <View style={{ backgroundColor: "white", height: "100%" }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={style.cardContainer}>
              <Swiper
                ref={swiperRef}
                cards={suggestions || []}
                cardIndex={index}
                renderCard={(user: User) => (
                  <SwipeCard
                    user={user}
                    onLike={() => handleLike(index)}
                    onDislike={() => handleDislike(index)}
                  />
                )}
                stackSize={2}
                backgroundColor={"transparent"}
                onSwiped={() => swipeDirection.setValue(0)}
                onSwiping={(x) => swipeDirection.setValue(x)}
                onSwipedAll={() => console.log("Hết rồi!!")}
                verticalSwipe={false}
                animateCardOpacity
                onSwipedLeft={(i) => handleDislike(i)}
                onSwipedRight={(i) => handleLike(i)}
                infinite
                disableBottomSwipe
                disableTopSwipe
                stackSeparation={2}
                swipeAnimationDuration={200}
                cardStyle={{
                  width: "100%",
                  height: "100%",
                  marginBottom: 90,
                  borderRadius: 10,
                }}
                containerStyle={{
                  width: "100%",
                  height: Dimensions.get("window").height * 0.75,
                  marginBottom: 60,
                }}
                cardHorizontalMargin={0}
                cardVerticalMargin={10}
              />
            </View>
          </ScrollView>

          <Animated.View
            style={[
              style.sideLabel,
              {
                left: 10,
                opacity: swipeDirection.interpolate({
                  inputRange: [-150, -50],
                  outputRange: [1, 0],
                  extrapolate: "clamp",
                }),
              },
            ]}
          >
            <Text style={[style.labelText, { color: "black" }]}>X</Text>
          </Animated.View>
          <Animated.View
            style={[
              style.sideLabel,
              {
                right: 10,
                opacity: swipeDirection.interpolate({
                  inputRange: [50, 150],
                  outputRange: [0, 1],
                  extrapolate: "clamp",
                }),
              },
            ]}
          >
            <Text style={[style.labelText, { color: "black" }]}>✓</Text>
          </Animated.View>
        </View>
{/* 
        <View style={style.buttonNav}>
          <TouchableOpacity
            style={style.button}
            onPress={() => swiperRef.current?.swipeLeft()}
          >
            <Ionicons name="close" size={32} color="#FF4F81" />
          </TouchableOpacity>
          <TouchableOpacity
            style={style.button}
            onPress={() => swiperRef.current?.swipeRight()}
          >
            <Ionicons name="heart" size={30} color="#FF6B9A" />
          </TouchableOpacity>
        </View> */}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignContent: "center",
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: "#e5e7eb",
    width: "100%",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#FF4F81",
    width: "50%",
  },
  cardContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 80,
    width: "100%",
    alignSelf: "stretch",
  },
  card: {
    width: "95%",
    margin: "auto",
    // height: Dimensions.get("window").height * 1.2,
    backgroundColor: "white",
  },
  imageBackground: {
    width: "100%",
    height: 650,
    borderRadius: 30,
    overflow: "hidden",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  profileInfo: {
    position: "absolute",
    left: 20,
    bottom: 20,
    justifyContent: "flex-start",
  },
  profileName: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  badge: {
    backgroundColor: "#bae6fd",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 6,
  },
  badgeText: {
    color: "#0284c7",
    fontSize: 12,
  },
  jobText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    marginTop: 8,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
  },
  sideLabel: {
    position: "absolute",
    top: "45%",
    zIndex: 100,
  },
  labelText: {
    fontSize: 32,
    fontWeight: "bold",
    backgroundColor: "rgb(243, 243, 243)",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 40,
  },
  barContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: 90,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#FF6B9A",
    paddingBottom: 20,
  },
  iconButton: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  iconLabel: {
    color: "#FF6B9A",
    fontSize: 12,
    marginTop: 4,
  },
  // SỬA 17: Thêm style cho các nút bấm
  buttonNav: {
    position: "absolute",
    bottom: 90, // Nằm ngay trên Tab Bar
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10,
    zIndex: 100,
  },
  button: {
    backgroundColor: "white",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default Home;
