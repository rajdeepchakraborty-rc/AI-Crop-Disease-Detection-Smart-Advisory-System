import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Image, Alert, StatusBar, Switch, Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../constants/theme';
import { analyzeCrop } from '../services/api';

const LANGUAGES   = ['english', 'hindi', 'bengali'];
const TREATMENTS  = ['organic', 'chemical'];

export default function UploadScreen({ navigation }) {
  const [imageUri,       setImageUri]       = useState(null);
  const [lat,            setLat]            = useState('28.6139');
  const [lon,            setLon]            = useState('77.2090');
  const [treatment,      setTreatment]      = useState('organic');
  const [language,       setLanguage]       = useState('english');
  const [userQuery,      setUserQuery]      = useState('');
  const [gpsLoading,     setGpsLoading]     = useState(false);
  const [useGPS,         setUseGPS]         = useState(false);

  // Auto-fetch GPS when toggle is turned on
  useEffect(() => {
    if (useGPS) fetchGPS();
  }, [useGPS]);

  async function fetchGPS() {
    setGpsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required for weather data.');
        setUseGPS(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setLat(String(loc.coords.latitude.toFixed(4)));
      setLon(String(loc.coords.longitude.toFixed(4)));
    } catch {
      Alert.alert('GPS Error', 'Could not get location. Enter manually.');
      setUseGPS(false);
    } finally {
      setGpsLoading(false);
    }
  }

  async function pickFromGallery() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Gallery access is required.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  }

  async function pickFromCamera() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Camera access is required.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.85,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  }

  async function handleAnalyze() {
    if (!imageUri) {
      Alert.alert('No Image', 'Please select or take a photo of the crop leaf first.');
      return;
    }
    const params = {
      imageUri,
      lat:           parseFloat(lat) || 28.6139,
      lon:           parseFloat(lon) || 77.2090,
      treatmentType: treatment,
      userQuery,
      language,
    };
    navigation.navigate('Loading', { params });
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Analyze Crop</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Image picker */}
        <View style={styles.section}>
          <Text style={styles.label}>📷  Crop Leaf Image</Text>
          <TouchableOpacity
            style={[styles.imagePicker, imageUri && styles.imagePickerFilled]}
            onPress={pickFromGallery}
            activeOpacity={0.8}
          >
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.previewImg} />
            ) : (
              <View style={styles.placeholderContent}>
                <Text style={styles.placeholderEmoji}>🌿</Text>
                <Text style={styles.placeholderText}>Tap to select from gallery</Text>
                <Text style={styles.placeholderSub}>Best results: clear leaf photo, good lighting</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.pickerBtnRow}>
            <TouchableOpacity style={styles.pickerBtn} onPress={pickFromGallery} activeOpacity={0.8}>
              <Text style={styles.pickerBtnText}>🖼  Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.pickerBtn, styles.pickerBtnAlt]} onPress={pickFromCamera} activeOpacity={0.8}>
              <Text style={[styles.pickerBtnText, { color: COLORS.accent }]}>📷  Camera</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>📍  Location</Text>
            <View style={styles.gpsRow}>
              <Text style={styles.gpsLabel}>{gpsLoading ? 'Getting GPS...' : 'Use GPS'}</Text>
              <Switch
                value={useGPS}
                onValueChange={setUseGPS}
                trackColor={{ false: COLORS.bgCardAlt, true: COLORS.primary }}
                thumbColor={useGPS ? COLORS.accent : '#555'}
              />
            </View>
          </View>
          <View style={styles.coordRow}>
            <View style={styles.coordField}>
              <Text style={styles.coordLabel}>Latitude</Text>
              <TextInput
                style={styles.input}
                value={lat} onChangeText={setLat}
                keyboardType="numeric" placeholderTextColor={COLORS.textMuted}
                placeholder="28.6139" editable={!useGPS}
              />
            </View>
            <View style={styles.coordField}>
              <Text style={styles.coordLabel}>Longitude</Text>
              <TextInput
                style={styles.input}
                value={lon} onChangeText={setLon}
                keyboardType="numeric" placeholderTextColor={COLORS.textMuted}
                placeholder="77.2090" editable={!useGPS}
              />
            </View>
          </View>
        </View>

        {/* Treatment type */}
        <View style={styles.section}>
          <Text style={styles.label}>🌱  Treatment Type</Text>
          <View style={styles.toggleRow}>
            {TREATMENTS.map(t => (
              <TouchableOpacity
                key={t} activeOpacity={0.8}
                style={[styles.toggleBtn, treatment === t && styles.toggleBtnActive]}
                onPress={() => setTreatment(t)}
              >
                <Text style={[styles.toggleText, treatment === t && styles.toggleTextActive]}>
                  {t === 'organic' ? '🌿  Organic' : '🧪  Chemical'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Language */}
        <View style={styles.section}>
          <Text style={styles.label}>🌐  Advisory Language</Text>
          <View style={styles.toggleRow}>
            {LANGUAGES.map(l => (
              <TouchableOpacity
                key={l} activeOpacity={0.8}
                style={[styles.langBtn, language === l && styles.langBtnActive]}
                onPress={() => setLanguage(l)}
              >
                <Text style={[styles.toggleText, language === l && styles.toggleTextActive]}>
                  {l === 'english' ? '🇬🇧 EN' : l === 'hindi' ? '🇮🇳 HI' : '🇧🇩 BN'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* What-If scenario */}
        <View style={styles.section}>
          <Text style={styles.label}>💡  What-If Scenario (optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={userQuery}
            onChangeText={setUserQuery}
            placeholder="e.g. What if it rains heavily tomorrow?"
            placeholderTextColor={COLORS.textMuted}
            multiline numberOfLines={3}
          />
        </View>

        {/* Analyze button */}
        <TouchableOpacity style={styles.analyzeBtn} onPress={handleAnalyze} activeOpacity={0.85}>
          <Text style={styles.analyzeBtnText}>🔍  Analyze with 14 AI Agents</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingBottom: 20 },

  topBar: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: Platform.OS === 'ios' ? 56 : 44,
    paddingBottom: SPACING.md,
  },
  backBtn:     { width: 40, height: 40, alignItems: 'flex-start', justifyContent: 'center' },
  backIcon:    { fontSize: 24, color: COLORS.accent },
  screenTitle: { fontFamily: FONTS.bold, fontSize: 18, color: COLORS.textPrimary },

  section: { marginHorizontal: SPACING.md, marginBottom: SPACING.lg },
  label:   { fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.textSecondary, marginBottom: SPACING.sm },

  /* Image picker */
  imagePicker: {
    height: 200, borderRadius: RADIUS.lg,
    borderWidth: 1.5, borderColor: COLORS.border,
    borderStyle: 'dashed',
    backgroundColor: COLORS.bgCard,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', marginBottom: SPACING.sm,
  },
  imagePickerFilled: { borderStyle: 'solid', borderColor: COLORS.borderBright },
  previewImg:  { width: '100%', height: '100%', borderRadius: RADIUS.lg },
  placeholderContent: { alignItems: 'center' },
  placeholderEmoji:   { fontSize: 42, marginBottom: 8 },
  placeholderText:    { fontFamily: FONTS.medium,  fontSize: 14, color: COLORS.textSecondary },
  placeholderSub:     { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textMuted, marginTop: 4, textAlign: 'center', paddingHorizontal: 20 },

  pickerBtnRow: { flexDirection: 'row', gap: SPACING.sm },
  pickerBtn: {
    flex: 1, backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border,
    paddingVertical: 12, alignItems: 'center',
  },
  pickerBtnAlt:  { backgroundColor: COLORS.accentSoft, borderColor: COLORS.borderBright },
  pickerBtnText: { fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.textSecondary },

  /* Location */
  labelRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  gpsRow:     { flexDirection: 'row', alignItems: 'center', gap: 8 },
  gpsLabel:   { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textMuted },
  coordRow:   { flexDirection: 'row', gap: SPACING.sm },
  coordField: { flex: 1 },
  coordLabel: { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textMuted, marginBottom: 4 },

  input: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14, paddingVertical: 12,
    fontFamily: FONTS.regular, fontSize: 14,
    color: COLORS.textPrimary,
  },
  textArea: { height: 80, textAlignVertical: 'top' },

  /* Toggles */
  toggleRow: { flexDirection: 'row', gap: SPACING.sm },
  toggleBtn: {
    flex: 1, backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border,
    paddingVertical: 12, alignItems: 'center',
  },
  toggleBtnActive: { backgroundColor: COLORS.primaryGlow, borderColor: COLORS.borderBright },
  langBtn: {
    flex: 1, backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border,
    paddingVertical: 12, alignItems: 'center',
  },
  langBtnActive: { backgroundColor: COLORS.primaryGlow, borderColor: COLORS.borderBright },
  toggleText:       { fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.textMuted },
  toggleTextActive: { color: COLORS.accent },

  analyzeBtn: {
    marginHorizontal: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    paddingVertical: 16,
    alignItems: 'center',
    ...SHADOW.glow,
  },
  analyzeBtnText: { fontFamily: FONTS.bold, fontSize: 16, color: '#000' },
});
