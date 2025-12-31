import { useRouter } from "expo-router";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function Page({ route }) {
  const router = useRouter();
  const crewName = route?.params?.crewName || "";
  const projectAddress = route?.params?.projectAddress || "";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Photo Capture</Text>
      <Text style={styles.subtitle}>Crew: {crewName}</Text>
      <Text style={styles.subtitle}>Project: {projectAddress}</Text>

      <View style={{ height: 20 }} />
      <Button title="Back to Address" onPress={() => router.push("/job-entry", { crewName })} />
      <View style={{ height: 10 }} />
      <Button title="Back Home" onPress={() => router.push("/")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 18, marginBottom: 5 },
});
