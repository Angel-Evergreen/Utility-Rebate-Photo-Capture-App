import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function Page() {
  const router = useRouter();
  const [crewName, setCrewName] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Crew Member Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Crew Member Name"
        value={crewName}
        onChangeText={setCrewName}
      />
      <Button
        title="Next"
        onPress={() => {
          if (crewName.trim() !== "") {
            router.push({
              pathname: "/job-entry",
              params: { crewName }, // pass param here
            });
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
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
