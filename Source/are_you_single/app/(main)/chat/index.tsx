import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Box from "@components/Box";
import { useMatches } from "@hooks/useApi";
import Loading from "@components/Loading";
import type { Match } from "src/types/Match";

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
});
