import React, { useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-deck-swiper";
import { ScrollView } from "react-native-gesture-handler";

import SwipeCard from "@components/SwipeCard";
import { useWhoLikedMe, useHandleDisLike, useCreateMatch, CreateMatchArgs } from "@hooks/useApi";
import type { User } from "src/types/User";
import MatchSuccess from "@components/MatchSuccess";


const LikeYou = () => {
  const { likedUsers, isLoading, isError, mutateLikedUsers } = useWhoLikedMe();
  const [refreshing, setRefreshing] = useState(false);
  const [matchSuccessInfo, setMatchSuccessInfo] = useState<any | null>(null);

  const { triggerDisLike, isMutating: isDisliking } = useHandleDisLike();
  const {triggerCreateMatch,isCreatingMatch , matchResponse } =  useCreateMatch();
  const onRefresh = async () => {
    setRefreshing(true);
    await mutateLikedUsers();
    setRefreshing(false);
  };

  const handleDisLike = async (index: number) => {
    const user = likedUsers?.[index];
    if (user && !isDisliking) { 
      try {
        console.log("👎 Bỏ qua:", user.profile.name);
        
        const result = await triggerDisLike({ targetUserId: user._id });

        if (result.success) {
          mutateLikedUsers(); 
        }

      } catch (e) {
        console.error("Lỗi khi dislike:", e);
      }
    }
  };

  const handleLike = async (index: number) => {
    const user = likedUsers?.[index];
    if (user && !isCreatingMatch) { 
      try {
        console.log("💖 Like lại (Tạo Match):", user.profile.name);


        const result = await triggerCreateMatch({ targetUserId: user._id } as CreateMatchArgs);

        if (result.success) {
         setMatchSuccessInfo(result.match);
          
          mutateLikedUsers();
        }
      } catch (e) {
        console.error("Lỗi khi tạo match:", e);
      }
    }
  };
  if (isLoading) {
    return (
      <View style={styles.centerScreen}>
        <ActivityIndicator size="large" color="#FF4F81" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerScreen}>
        <Text style={styles.errorText}>Không thể tải danh sách. Vui lòng thử lại.</Text>
      </View>
    );
  }

  if (!likedUsers || likedUsers.length === 0) {
    return (
      <View style={styles.centerScreen}>
        <Text style={styles.emptyText}>Chưa có ai thích bạn 😢</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF4F81" />
          }
        >
          <Text style={styles.title}>Những người thích bạn 💘</Text>

          <View style={styles.swiperContainer}>
            <Swiper
              cards={likedUsers}
              renderCard={(item: User) => <SwipeCard user={item} />}
              stackSize={3}
              stackSeparation={15}
              backgroundColor="transparent"
              animateCardOpacity
              onSwipedLeft={handleDisLike}
              onSwipedRight={handleLike}
              cardIndex={0}
              verticalSwipe={false} 
              overlayLabels={{
                left: {
                  title: "NOPE",
                  style: { label: styles.overlayLeft, wrapper: styles.overlayWrapper },
                },
                right: {
                  title: "LIKE",
                  style: { label: styles.overlayRight, wrapper: styles.overlayWrapper },
                },
              }}
            />
          </View>
        </ScrollView>
        <MatchSuccess
          isVisible={matchSuccessInfo !== null}
          match={matchSuccessInfo}
          onClose={() => setMatchSuccessInfo(null)}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default LikeYou;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF4F81",
    textAlign: "center",
    marginVertical: 15,
  },
  swiperContainer: {
    flex: 1,
    height: 700,
    alignItems: "center",
    justifyContent: "center",
  },
  overlayWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  overlayLeft: {
    backgroundColor: "#FF4F81",
    borderColor: "#FF4F81",
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    borderWidth: 3,
    padding: 10,
    borderRadius: 10,
  },
  overlayRight: {
    backgroundColor: "#00C851",
    borderColor: "#00C851",
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    borderWidth: 3,
    padding: 10,
    borderRadius: 10,
  },
  centerScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
    fontStyle: "italic",
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
});
