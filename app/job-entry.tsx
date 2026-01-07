import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

const SERVICES = [
  "Wall Insulation",
  "Attic Insulation",
  "Floor Insulation",
  "Air Sealing",
  "Vapor Barrier",
];

export default function JobEntry() {
  const router = useRouter();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const canContinue = selectedServices.length > 0;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Step 1: Select Services</Text>
      <Text style={styles.subtitle}>
        Choose all services performed on this job
      </Text>

      {SERVICES.map((service) => {
        const selected = selectedServices.includes(service);

        return (
          <Pressable
            key={service}
            onPress={() => toggleService(service)}
            style={[
              styles.serviceItem,
              selected && styles.serviceItemSelected,
            ]}
          >
            <Text
              style={[
                styles.serviceText,
                selected && styles.serviceTextSelected,
              ]}
            >
              {service}
            </Text>
          </Pressable>
        );
      })}

      <Pressable
        disabled={!canContinue}
        style={[
          styles.nextButton,
          !canContinue && styles.nextButtonDisabled,
        ]}
        onPress={() => {
          router.push({
            pathname: "/service-confirmation",
            params: { services: JSON.stringify(selectedServices) },
          });
        }}
      >
        <Text style={styles.nextButtonText}>Continue</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  serviceItem: {
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
  },
  serviceItemSelected: {
    backgroundColor: "#e6f0ff",
    borderColor: "#3366ff",
  },
  serviceText: {
    fontSize: 16,
  },
  serviceTextSelected: {
    fontWeight: "bold",
    color: "#3366ff",
  },
  nextButton: {
    marginTop: 30,
    padding: 16,
    borderRadius: 10,
    backgroundColor: "#3366ff",
    alignItems: "center",
  },
  nextButtonDisabled: {
    backgroundColor: "#aaa",
  },
  nextButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
