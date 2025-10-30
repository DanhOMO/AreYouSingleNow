import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Box from "@components/Box";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Match } from "src/types/Match";
import api from "@lib/api";
import { useMatches } from "@hooks/useApi";
import Loading from "@components/Loading";
const ListMatch = () => {
  const { matches, isLoading, isError } = useMatches();
  
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center" }]}>
        <Text style={{ color: "red" }}>Lỗi khi tải dữ liệu. Vui lòng thử lại.</Text>
      </SafeAreaView>
    );
  }
  


  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={matches}
          keyExtractor={(item) => item.id}
          renderItem={({ item }: { item: Match }) => (
            <Box item={item} />
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ListMatch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginLeft: 20,
    marginVertical: 10,
    color: "#FF6B9A",
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  chatInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  lastMessage: {
    fontSize: 14,
    color: "#777",
    marginTop: 2,
  },
});

