import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function Page({ route }) {
  const router = useRouter();
  const crewName = route?.params?.crewName || "";
  const [projectAddress, setProjectAddress] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello {crewName}</Text>
      <Text style={styles.subtitle}>Enter Project Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Project Address"
        value={projectAddress}
        onChangeText={setProjectAddress}
      />
      <Button
        title="Next: Take Photos"
        onPress={() => {
          if (projectAddress.trim() !== "") {
            router.push({
              pathname: "/photo-capture",
              params: { crewName, projectAddress },
            });
          }
        }}
      />
      <View style={{ height: 10 }} />
      <Button title="Back" onPress={() => router.push("/")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 20, marginBottom: 20 },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});
