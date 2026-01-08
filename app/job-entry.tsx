import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

/**
 * Single source of truth for services (for now)
 */
const SERVICES = [
  { id: "air_seal", name: "Air Seal", required: true },
  { id: "alarm_photo", name: "Alarm Photo", required: true },
  { id: "attic", name: "Attic Section", required: false },
  { id: "crawlspace", name: "Crawlspace Section", required: false },
  { id: "walls", name: "Wall Section", required: false },
  { id: "duct_mastic", name: "Duct Mastic", required: false },
  { id: "duct_sealing", name: "Duct Sealing", required: false },
];

export default function JobEntry() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const crewName = (params.crewName as string) || "";

  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [completedServices, setCompletedServices] = useState<string[]>([]);

  const isServiceCompleted = (id: string) =>
    completedServices.includes(id);

  const allRequiredCompleted = () =>
    SERVICES.filter((s) => s.required).every((s) =>
      completedServices.includes(s.id)
    );

  const handleContinue = () => {
    if (!selectedService) return;

    router.push({
      pathname: "/service-confirmation",
      params: {
        serviceId: selectedService,
        crewName,
        completed: JSON.stringify(completedServices),
      },
    });
  };

  const handleFullyComplete = () => {
    Alert.alert(
      "Job Complete",
      `Great work, ${crewName}! All required services are complete.`,
      [
        {
          text: "Start New Job",
          onPress: () => router.replace("/"),
        },
        { text: "Close", style: "cancel" },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome, {crewName}</Text>
        <Text style={styles.subheader}>Select a service</Text>
      </View>

      <ScrollView style={styles.scroll}>
        <Text style={styles.sectionTitle}>Required Services</Text>
        {SERVICES.filter((s) => s.required).map((service) => {
          const completed = isServiceCompleted(service.id);
          const selected = selectedService === service.id;

          return (
            <TouchableOpacity
              key={service.id}
              disabled={completed}
              onPress={() => setSelectedService(service.id)}
              style={[
                styles.card,
                completed && styles.completed,
                selected && styles.selected,
              ]}
            >
              <Text style={styles.cardTitle}>{service.name}</Text>
              <Text style={styles.badge}>Required</Text>
            </TouchableOpacity>
          );
        })}

        <Text style={styles.sectionTitle}>Optional Services</Text>
        {SERVICES.filter((s) => !s.required).map((service) => {
          const completed = isServiceCompleted(service.id);
          const selected = selectedService === service.id;

          return (
            <TouchableOpacity
              key={service.id}
              disabled={completed}
              onPress={() => setSelectedService(service.id)}
              style={[
                styles.card,
                completed && styles.completed,
                selected && styles.selected,
              ]}
            >
              <Text style={styles.cardTitle}>{service.name}</Text>
              <Text style={styles.optional}>Optional</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        {allRequiredCompleted() && (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleFullyComplete}
          >
            <Text style={styles.completeText}>Fully Complete</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedService && styles.disabledButton,
          ]}
          onPress={handleContinue}
          disabled={!selectedService}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  welcome: { fontSize: 24, fontWeight: "700", marginBottom: 4 },
  subheader: { color: "#64748b" },
  scroll: { padding: 16 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 12,
    color: "#475569",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#e2e8f0",
  },
  selected: {
    borderColor: "#2563eb",
    backgroundColor: "#eff6ff",
  },
  completed: {
    backgroundColor: "#f0fdf4",
    borderColor: "#86efac",
  },
  cardTitle: { fontSize: 16, fontWeight: "600" },
  badge: { fontSize: 12, color: "#dc2626", marginTop: 4 },
  optional: { fontSize: 12, color: "#64748b", marginTop: 4 },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    backgroundColor: "#ffffff",
  },
  continueButton: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#cbd5e1",
  },
  continueText: { color: "#ffffff", fontWeight: "600", fontSize: 16 },
  completeButton: {
    backgroundColor: "#10b981",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  completeText: { color: "#ffffff", fontWeight: "600", fontSize: 16 },
});
