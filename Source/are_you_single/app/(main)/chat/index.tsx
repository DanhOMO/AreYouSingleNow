import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Box from "@components/Box";
import { useMatches } from "@hooks/useApi";
import Loading from "@components/Loading";
import type { Match } from "src/types/Match";
import { LinearGradient } from "expo-linear-gradient";

const ListMatch = () => {
  const { matches, isLoading, isError } = useMatches();

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center" }]}>
        <Text style={{ color: "red" }}>
          Lỗi khi tải dữ liệu. Vui lòng thử lại.
        </Text>
      </SafeAreaView>
    );
  }
 
  if (!matches || matches.length === 0) {
     return (
        <LinearGradient
          colors={["#FF6B9A", "#FFC0CB", "#E91E63"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.centerScreen}
        >
          <Text style={styles.emptyText}>Chưa có cuộc trò chuyện 😢</Text>
        </LinearGradient>
      );
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <FlatList
        data={matches}
        keyExtractor={(item) => item._id}
        renderItem={({ item }: { item: Match }) => <Box item={item} />}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

export default ListMatch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 0,
  },
  listContent: {
    paddingBottom: 100,
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
