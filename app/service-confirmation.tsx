import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function ServiceConfirmation() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const services =
    typeof params.services === "string"
      ? JSON.parse(params.services)
      : [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ready to Take Photos?</Text>

      <Text style={styles.subtitle}>
        You selected the following services:
      </Text>

      {services.map((service: string) => (
        <Text key={service} style={styles.serviceItem}>
          • {service}
        </Text>
      ))}

      <View style={styles.buttonRow}>
        <Pressable
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>

        <Pressable
          style={styles.primaryButton}
          onPress={() =>
            router.push({
              pathname: "/photo-capture",
              params: { services: JSON.stringify(services) },
            })
          }
        >
          <Ionicons name="camera" size={20} color="#fff" />
          <Text style={styles.primaryText}>Take Pictures</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 16,
  },
  serviceItem: {
    fontSize: 16,
    marginBottom: 6,
  },
  buttonRow: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cancelButton: {
    padding: 14,
  },
  cancelText: {
    fontSize: 16,
    color: "#666",
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3366ff",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  primaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
