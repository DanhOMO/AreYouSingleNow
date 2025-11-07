import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  RefreshControl,
  Animated,
  Dimensions,
} from "react-native";
import Swiper from "react-native-deck-swiper";
import { ScrollView } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";

import SwipeCard from "@components/SwipeCard";
import {
  useWhoLikedMe,
  useHandleDisLike,
  useCreateMatch,
  CreateMatchArgs,
} from "@hooks/useApi";
import type { User } from "src/types/User";
import MatchSuccess from "@components/MatchSuccess";

const { height } = Dimensions.get("window");

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const LikeYou = () => {
  const { likedUsers, isLoading, isError, mutateLikedUsers } = useWhoLikedMe();
  const [refreshing, setRefreshing] = useState(false);
  const [matchSuccessInfo, setMatchSuccessInfo] = useState<any | null>(null);
  const [index, setIndex] = useState(0);
  const swipeDirection = useRef(new Animated.Value(0)).current;
  const swiperRef = useRef<Swiper<User>>(null);

  const { triggerDisLike, isMutating: isDisliking } = useHandleDisLike();
  const { triggerCreateMatch, isCreatingMatch } = useCreateMatch();

  const onRefresh = async () => {
    setRefreshing(true);
    await mutateLikedUsers();
    setRefreshing(false);
  };

  const handleDisLike = async (i: number) => {
    const user = likedUsers?.[i];
    if (user && !isDisliking) {
      try {
        const result = await triggerDisLike({ targetUserId: user._id });
        if (result.success) mutateLikedUsers();
      } catch (e) {
        console.error("Error dislike:", e);
      }
    }
  };

  const handleLike = async (i: number) => {
    const user = likedUsers?.[i];
    if (user && !isCreatingMatch) {
      try {
        const result = await triggerCreateMatch({
          targetUserId: user._id,
        } as CreateMatchArgs);

        if (result.success) {
          setMatchSuccessInfo(result.match);

          await delay(200);

          mutateLikedUsers();
        }
      } catch (e) {
        console.error("Error creating match:", e);
      }
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerScreen}>
        <ActivityIndicator size="large" color="#FF6B9A" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerScreen}>
        <Text style={styles.errorText}>
          Không thể tải danh sách. Vui lòng thử lại.
        </Text>
      </View>
    );
  }

  if (!likedUsers || likedUsers.length === 0 || index >= likedUsers.length) {
    return (
      <LinearGradient
        colors={["#FF6B9A", "#FFC0CB", "#E91E63"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.centerScreen}
      >
        <Text style={styles.emptyText}>Chưa có ai thích bạn 😢</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#FF6B9A", "#FFC0CB", "#E91E63"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#fff"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.swiperContainer}>
          <Swiper
            ref={swiperRef}
            cards={likedUsers}
            cardIndex={index}
            renderCard={(user: User) => {
              if (!user) {
                return null;
              }
              return (
                <SwipeCard
                  key={user._id}
                  user={user}
                  onLike={() => handleLike(index)}
                  onDislike={() => handleDisLike(index)}
                />
              );
            }}
            stackSize={3}
            stackSeparation={12}
            verticalSwipe={false}
            animateCardOpacity
            onSwiped={(i) => setIndex(i)}
            onSwiping={(x) => swipeDirection.setValue(x)}
            onSwipedLeft={(i) => handleDisLike(i)}
            onSwipedRight={(i) => handleLike(i)}
            disableBottomSwipe
            disableTopSwipe
            backgroundColor="transparent"
            cardHorizontalMargin={0}
            cardVerticalMargin={0}
            containerStyle={styles.swiperDeck}
          />
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
      </ScrollView>

      <MatchSuccess
        isVisible={matchSuccessInfo !== null}
        match={matchSuccessInfo}
        onClose={() => 
        {
          setMatchSuccessInfo(null)
          mutateLikedUsers();
        }
        }
      />
    </LinearGradient>
  );
};

export default LikeYou;

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
    width: "100%",
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
  errorText: {
    color: "white",
    textAlign: "center",
  },
});
