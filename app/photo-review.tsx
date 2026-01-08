import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SERVICES, useApp } from '../context/AppContext'; // adjust path if needed

const SCREEN_WIDTH = Dimensions.get('window').width;
const PHOTO_SIZE = (SCREEN_WIDTH - 48) / 2;

export default function PhotoReviewScreen() {
  const router = useRouter();
  const { serviceId, photoType } = useLocalSearchParams<{
    serviceId: string;
    photoType?: string;
  }>();
  const { getServicePhotos, clearServicePhotos, addCompletedService } = useApp();

  const service = SERVICES.find((s) => s.id === serviceId);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<number>>(new Set());

  if (!service) {
    router.back();
    return null;
  }

  const isRulerPhotos = photoType === 'ruler';
  const allPhotos = getServicePhotos(service.id);
  const photos = isRulerPhotos ? allPhotos.slice(5) : allPhotos.slice(0, 5);

  const handlePhotoSelect = (index: number) => {
    setSelectedPhotos((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleRemoveSelected = () => {
    if (selectedPhotos.size === 0) {
      Alert.alert('No Photos Selected', 'Please select photos to remove.');
      return;
    }

    Alert.alert(
      'Remove Photos',
      `Are you sure you want to remove ${selectedPhotos.size} photo(s) and retake?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove & Retake',
          style: 'destructive',
          onPress: () => {
            clearServicePhotos(service.id);
            setSelectedPhotos(new Set());
            router.replace(
              `/photo-capture?serviceId=${service.id}&photoType=${
                isRulerPhotos ? 'ruler' : 'main'
              }`
            );
          },
        },
      ]
    );
  };

  const handleApprove = () => {
    if (selectedPhotos.size === 0) {
      Alert.alert('No Photos Approved', 'Please mark at least one photo as good.');
      return;
    }

    if (isRulerPhotos) {
      addCompletedService(service.id);
      Alert.alert('Service Complete', `${service.name} has been completed!`, [
        {
          text: 'OK',
          onPress: () => {
            router.replace('/job-entry');
          },
        },
      ]);
    } else {
      Alert.alert('Main Photos Approved', 'Now capture the ruler photos.', [
        {
          text: 'Continue',
          onPress: () => {
            setSelectedPhotos(new Set());
            router.push(
              `/photo-capture?serviceId=${service.id}&photoType=ruler`
            );
          },
        },
      ]);
    }
  };

  const handleGoBack = () => {
    Alert.alert('Discard Photos', 'Are you sure you want to retake these photos?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Retake',
        style: 'destructive',
        onPress: () => {
          clearServicePhotos(service.id);
          router.replace(
            `/photo-capture?serviceId=${service.id}&photoType=${
              isRulerPhotos ? 'ruler' : 'main'
            }`
          );
        },
      },
    ]);
  };

  const sectionTitle = isRulerPhotos ? 'Ruler Photos' : 'Main Photos';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={{ color: '#2563eb' }}>Back</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{service.name}</Text>
          <Text style={styles.headerSubtitle}>{sectionTitle}</Text>
        </View>
        <View style={styles.spacing} />
      </View>

      <View style={styles.instructionContainer}>
        <Text style={styles.instructionTitle}>Review Your Photos</Text>
        <Text style={styles.instructionText}>
          Mark the photos that look clear and good. You can deselect and retake if needed.
        </Text>
      </View>

      <ScrollView style={styles.photosContainer}>
        <View style={styles.photosGrid}>
          {photos.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={{ color: '#94a3b8' }}>No photos captured yet</Text>
            </View>
          ) : (
            photos.map((photo, index) => (
              <TouchableOpacity
                key={index}
                style={styles.photoContainer}
                onPress={() => handlePhotoSelect(index)}
              >
                <Image source={{ uri: photo.uri }} style={styles.photo} />
                {selectedPhotos.has(index) && (
                  <View style={styles.photoOverlay}>
                    <Text style={{ color: '#10b981', fontWeight: 'bold' }}>✔</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.statsText}>
          {selectedPhotos.size} of {photos.length} approved
        </Text>

        <View style={styles.footerButtons}>
          <TouchableOpacity
            style={[styles.removeButton, selectedPhotos.size === 0 && styles.removeButtonDisabled]}
            onPress={handleRemoveSelected}
            disabled={selectedPhotos.size === 0}
          >
            <Text style={{ color: '#dc2626', marginRight: 8 }}>✖</Text>
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.approveButton, selectedPhotos.size === 0 && styles.approveButtonDisabled]}
            onPress={handleApprove}
            disabled={selectedPhotos.size === 0}
          >
            <Text style={{ color: '#ffffff', marginRight: 8 }}>✔</Text>
            <Text style={styles.approveButtonText}>Approve & Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, paddingTop: 60, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  backButton: { padding: 8 },
  headerContent: { flex: 1, marginLeft: 12 },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  headerSubtitle: { fontSize: 12, color: '#64748b', marginTop: 2 },
  spacing: { width: 40 },
  instructionContainer: { padding: 16, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  instructionTitle: { fontSize: 16, fontWeight: '600', color: '#1e293b', marginBottom: 4 },
  instructionText: { fontSize: 14, color: '#64748b', lineHeight: 20 },
  photosContainer: { flex: 1, padding: 16 },
  photosGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16 },
  photoContainer: { width: PHOTO_SIZE, height: PHOTO_SIZE, borderRadius: 12, overflow: 'hidden', backgroundColor: '#e2e8f0' },
  photo: { width: '100%', height: '100%' },
  photoOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: 300 },
  footer: { backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingHorizontal: 16, paddingVertical: 16 },
  statsText: { fontSize: 14, color: '#64748b', fontWeight: '500', marginBottom: 12 },
  footerButtons: { flexDirection: 'row', gap: 12 },
  removeButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fee2e2', paddingVertical: 12, borderRadius: 8 },
  removeButtonDisabled: { backgroundColor: '#f1f5f9' },
  removeButtonText: { marginLeft: 8, color: '#dc2626', fontWeight: '600', fontSize: 14 },
  approveButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#10b981', paddingVertical: 12, borderRadius: 8 },
  approveButtonDisabled: { backgroundColor: '#cbd5e1' },
  approveButtonText: { marginLeft: 8, color: '#ffffff', fontWeight: '600', fontSize: 14 },
});
