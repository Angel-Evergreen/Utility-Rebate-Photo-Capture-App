import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Screen name="job-entry" options={{ title: "Select Service" }} />
        <Stack.Screen
          name="service-confirmation"
          options={{ title: "Confirm Service" }}
        />
        <Stack.Screen name="photo-capture" options={{ title: "Take Photo" }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
