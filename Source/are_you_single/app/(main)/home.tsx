// import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";
import Swiper from "react-native-deck-swiper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import {
  useUserSuggestions,
  useHandleLike,
  useHandleDisLike,
} from "@hooks/useApi";
import type { User } from "src/types/User";
import Loading from "@components/Loading";
import SwipeCard from "@components/SwipeCard";
import { useFilterStore } from "@store/useAuthStore";

const { width, height } = Dimensions.get("window");

const Home = () => {
  const [index, setIndex] = useState(0);
  const swipeDirection = useRef(new Animated.Value(0)).current;
  const swiperRef = useRef<Swiper<User>>(null);
  const filter = useFilterStore((state) => state);

  const { suggestions, isLoading, isError, mutateSuggestions } =
    useUserSuggestions();
  const { triggerLike } = useHandleLike();
  const { triggerDisLike } = useHandleDisLike();

  const handleLike = async (cardIndex: number) => {
    const user = suggestions?.[cardIndex];
    if (!user) return;
    try {
      const result = await triggerLike({ targetUserId: user._id });
      if (result.success) mutateSuggestions();
    } catch (e) {
      console.error("Lỗi khi like:", e);
    }
  };

  const handleDislike = async (cardIndex: number) => {
    const user = suggestions?.[cardIndex];
    if (!user) return;
    try {
      const result = await triggerDisLike({ targetUserId: user._id });
      if (result.success) mutateSuggestions();
    } catch (e) {
      console.error("Lỗi khi dislike:", e);
    }
  };

  const filteredSuggestions =
    suggestions?.filter((user) => {
      if (!user || !user.profile) return false;
      const { gender, minAge, maxAge } = filter;
      if (gender && user.profile.gender !== gender) return false;
      if (minAge || maxAge) {
        const dob = new Date(user.profile.dob);
        const age = new Date().getFullYear() - dob.getFullYear();
        if (minAge && age < minAge) return false;
        if (maxAge && age > maxAge) return false;
      }
      return true;
    }) || [];

  if (
    !filteredSuggestions ||
    filteredSuggestions.length === 0 ||
    index >= filteredSuggestions.length
  ) {
    return (
      <LinearGradient
        colors={["#FF6B9A", "#FFC0CB", "#E91E63"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.centerScreen}
      >
        <Text style={styles.emptyText}>Không còn người dùng phù hợp 😌</Text>
      </LinearGradient>
    );
  }

  if (isLoading) return <Loading />;

  if (isError)
    return (
      <LinearGradient
        colors={["#FF6B9A", "#FFC0CB", "#E91E63"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.container, { justifyContent: "center" }]}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Đã xảy ra lỗi, vui lòng thử lại sau.
        </Text>
      </LinearGradient>
    );

  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={["#FF6B9A", "#FFC0CB", "#E91E63"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.swiperContainer}>
          <Swiper
            ref={swiperRef}
            cards={filteredSuggestions}
            cardIndex={index}
            renderCard={(user: User) =>
              user ? (
                <SwipeCard
                  key={user._id}
                  user={user}
                  onLike={() => handleLike(index)}
                  onDislike={() => handleDislike(index)}
                />
              ) : null
            }
            stackSize={3}
            stackSeparation={10}
            verticalSwipe={false}
            animateCardOpacity
            onSwiped={(i) => setIndex(i)}
            onSwiping={(x) => swipeDirection.setValue(x)}
            onSwipedLeft={(i) => handleDislike(i)}
            onSwipedRight={(i) => handleLike(i)}
            disableBottomSwipe
            disableTopSwipe
            backgroundColor="transparent"
            cardHorizontalMargin={0}
            cardVerticalMargin={0}
            containerStyle={styles.swiperDeck}
          />

          {/* Swipe Labels */}
          <Animated.View
            style={[
              styles.sideLabel,
              { left: 25 },
              {
                opacity: swipeDirection.interpolate({
                  inputRange: [-150, -50],
                  outputRange: [1, 0],
                  extrapolate: "clamp",
                }),
              },
            ]}
          >
            <Text style={[styles.labelText, { color: "#B0A8A8" }]}>X</Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.sideLabel,
              { right: 25 },
              {
                opacity: swipeDirection.interpolate({
                  inputRange: [50, 150],
                  outputRange: [0, 1],
                  extrapolate: "clamp",
                }),
              },
            ]}
          >
            <Text style={[styles.labelText, { color: "#FF6B9A" }]}>✓</Text>
          </Animated.View>
        </View>
      </LinearGradient>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  swiperContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  swiperDeck: {
    width: width,
    height: height * 0.78,
  },
  sideLabel: {
    position: "absolute",
    top: height * 0.35,
    zIndex: 10,
  },
  labelText: {
    fontSize: 36,
    fontWeight: "600",
    backgroundColor: "rgba(255,255,255,0.85)",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
  },
  centerScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "white",
    fontStyle: "italic",
  },
});

export default Home;
