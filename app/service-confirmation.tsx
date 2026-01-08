import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SERVICES, useApp } from '../context/AppContext'; // adjust path if needed

export default function ServiceConfirmationScreen() {
  const router = useRouter();
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
  const { clearServicePhotos } = useApp();

  const service = SERVICES.find((s) => s.id === serviceId);

  if (!service) {
    router.back();
    return null;
  }

  const handleCancel = () => {
    router.back();
  };

  const handleTakePictures = () => {
    clearServicePhotos(service.id);
    router.push(
      `/photo-capture?serviceId=${service.id}&photoType=main`
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>✔</Text>
        </View>

        <Text style={styles.title}>Confirm Service</Text>

        <View style={styles.serviceCard}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <Text style={styles.serviceBadge}>
            {service.required ? 'Required' : 'Optional'}
          </Text>
        </View>

        <Text style={styles.instruction}>
          Ready to capture photos for this service?
        </Text>

        {service.id === 'attic-section' ? (
          <View style={styles.noteCard}>
            <Text style={styles.noteTitle}>Note:</Text>
            <Text style={styles.noteText}>
              This service requires two sets of photos: 5 main photos and ruler photos.
            </Text>
          </View>
        ) : (
          <View style={styles.noteCard}>
            <Text style={styles.noteTitle}>Note:</Text>
            <Text style={styles.noteText}>
              Please capture 5 clear photos from different angles.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancel}
        >
          <Text style={styles.cancelIcon}>✖</Text>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.takePicturesButton}
          onPress={handleTakePictures}
        >
          <Text style={styles.cameraIcon}>📷</Text>
          <Text style={styles.takePicturesButtonText}>Take Pictures</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  icon: {
    fontSize: 48,
    color: '#2563eb',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 32,
  },
  serviceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    marginBottom: 24,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  serviceBadge: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  instruction: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  noteCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: '#fcd34d',
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 4,
  },
  noteText: {
    fontSize: 14,
    color: '#78350f',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  cancelIcon: {
    color: '#64748b',
    marginRight: 8,
    fontSize: 16,
  },
  cancelButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
  takePicturesButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
  },
  cameraIcon: {
    color: '#ffffff',
    marginRight: 8,
    fontSize: 16,
  },
  takePicturesButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
