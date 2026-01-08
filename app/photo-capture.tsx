import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

/**
 * Temporary local services definition
 * (we will centralize later once routing is stable)
 */
const SERVICES = [
  { id: "air_seal", name: "Air Seal" },
  { id: "alarm_photo", name: "Alarm Photo" },
  { id: "attic", name: "Attic Section" },
  { id: "crawlspace", name: "Crawlspace Section" },
  { id: "walls", name: "Wall Section" },
  { id: "duct_mastic", name: "Duct Mastic" },
  { id: "duct_sealing", name: "Duct Sealing" },
];

export default function PhotoCapture() {
  const router = useRouter();
  const { serviceId, photoType } = useLocalSearchParams<{
    serviceId?: string;
    photoType?: string;
  }>();

  const service = SERVICES.find((s) => s.id === serviceId);

  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const [photos, setPhotos] = useState<string[]>([]);

  if (!service) {
    router.back();
    return null;
  }

  const isRulerPhotos = photoType === "ruler";
  const requiredPhotos = isRulerPhotos ? 3 : 5;
  const remainingPhotos = requiredPhotos - photos.length;

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionMessage}>
          We need access to your camera to capture service photos.
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync();
      const updatedPhotos = [...photos, photo.uri];
      setPhotos(updatedPhotos);

      if (updatedPhotos.length >= requiredPhotos) {
        router.push({
          pathname: "/photo-review",
          params: {
            serviceId: service.id,
            photoType: isRulerPhotos ? "ruler" : "main",
            photos: JSON.stringify(updatedPhotos),
          },
        });
      }
    } catch {
      Alert.alert("Error", "Failed to capture photo. Please try again.");
    }
  };

  const sectionTitle = isRulerPhotos ? "Ruler Photos" : "Main Photos";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{service.name}</Text>
          <Text style={styles.headerSubtitle}>{sectionTitle}</Text>
        </View>
        <View style={styles.photoCounter}>
          <Text style={styles.photoCounterText}>
            {photos.length}/{requiredPhotos}
          </Text>
        </View>
      </View>

      <View style={styles.instructionBanner}>
        <Text style={styles.instructionText}>
          Capture {remainingPhotos} more photo
          {remainingPhotos !== 1 ? "s" : ""}
        </Text>
      </View>

      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <View style={styles.cameraControls}>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={toggleCameraFacing}
          >
            <Text style={styles.flipText}>Flip</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomControls}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePicture}
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 60,
    backgroundColor: "#1e293b",
  },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#fff" },
  headerSubtitle: { fontSize: 14, color: "#94a3b8", marginTop: 2 },

  photoCounter: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  photoCounterText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  instructionBanner: {
    backgroundColor: "#fbbf24",
    padding: 12,
    alignItems: "center",
  },
  instructionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#78350f",
  },

  camera: { flex: 1 },

  cameraControls: {
    flex: 1,
    padding: 20,
    alignItems: "flex-end",
  },
  flipButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 12,
    borderRadius: 12,
  },
  flipText: { color: "#fff", fontWeight: "600" },

  bottomControls: {
    padding: 20,
    alignItems: "center",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
  },

  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f8fafc",
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  permissionMessage: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
