import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, Dimensions, StatusBar,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../constants/theme';

const { width } = Dimensions.get('window');

const FEATURES = [
  { emoji: '🔬', title: 'Disease AI',     desc: '38 crop disease classes detected instantly',   color: '#22C55E' },
  { emoji: '🌡️', title: 'Weather Intel',  desc: 'Real-time micro-climate risk forecasting',     color: '#38BDF8' },
  { emoji: '🗺️', title: 'Supply Chain',   desc: 'Nearest agri-store within 50 km radius',       color: '#A78BFA' },
  { emoji: '🎙️', title: 'Voice Advisory', desc: 'Multilingual audio treatment guide',           color: '#F59E0B' },
  { emoji: '🧠', title: 'XAI Heatmap',    desc: 'Grad-CAM visual explanation of predictions',   color: '#F87171' },
  { emoji: '📋', title: 'Farm Memory',    desc: 'Persistent crop health history tracking',      color: '#34D399' },
];

export default function HomeScreen({ navigation }) {
  const fadeAnims = FEATURES.map(() => useRef(new Animated.Value(0)).current);
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerAnim, { toValue: 1, duration: 700, useNativeDriver: true }).start();
    FEATURES.forEach((_, i) => {
      Animated.timing(fadeAnims[i], {
        toValue: 1, duration: 500, delay: 300 + i * 100, useNativeDriver: true,
      }).start();
    });
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <Animated.View style={[styles.header, { opacity: headerAnim }]}>
          <View style={styles.logoRow}>
            <View style={styles.logoCircle}><Text style={styles.logoEmoji}>🌿</Text></View>
            <View>
              <Text style={styles.appName}>CropAI</Text>
              <Text style={styles.appTagline}>14-Agent Agricultural Intelligence</Text>
            </View>
          </View>

          {/* Hero banner */}
          <View style={styles.heroBanner}>
            <View style={styles.heroBgGlow} />
            <Text style={styles.heroTitle}>Smart Crop{'\n'}Disease Detection</Text>
            <Text style={styles.heroSub}>
              Upload a leaf photo and let 14 specialized AI agents diagnose, advise, and protect your harvest.
            </Text>
            <TouchableOpacity
              style={styles.analyzeBtn}
              activeOpacity={0.82}
              onPress={() => navigation.navigate('Upload')}
            >
              <Text style={styles.analyzeBtnText}>🔍  Analyze a Crop</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Stats bar */}
        <View style={styles.statsRow}>
          {[['38', 'Classes'], ['14', 'Agents'], ['3', 'Languages'], ['50km', 'Supply Radius']].map(([val, lbl]) => (
            <View key={lbl} style={styles.statItem}>
              <Text style={styles.statValue}>{val}</Text>
              <Text style={styles.statLabel}>{lbl}</Text>
            </View>
          ))}
        </View>

        {/* Feature grid */}
        <Text style={styles.sectionTitle}>Features</Text>
        <View style={styles.featureGrid}>
          {FEATURES.map((f, i) => (
            <Animated.View
              key={f.title}
              style={[styles.featureCard, { opacity: fadeAnims[i], transform: [{ translateY: fadeAnims[i].interpolate({ inputRange:[0,1], outputRange:[24,0] }) }] }]}
            >
              <View style={[styles.featureIconWrap, { backgroundColor: f.color + '20' }]}>
                <Text style={styles.featureEmoji}>{f.emoji}</Text>
              </View>
              <Text style={[styles.featureTitle, { color: f.color }]}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </Animated.View>
          ))}
        </View>

        {/* Secondary CTA */}
        <TouchableOpacity
          style={styles.historyBtn}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('History')}
        >
          <Text style={styles.historyBtnText}>📋  View Farm History</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>PlantVillage + MobileNetV2 + Groq Llama 3</Text>
      </ScrollView>
    </View>
  );
}

const CARD_W = (width - SPACING.md * 2 - SPACING.sm) / 2;

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingBottom: 40 },

  /* Header */
  header: { paddingHorizontal: SPACING.md, paddingTop: 56 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: SPACING.lg },
  logoCircle: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1.5, borderColor: COLORS.borderBright,
    alignItems: 'center', justifyContent: 'center',
  },
  logoEmoji:   { fontSize: 22 },
  appName:     { fontFamily: FONTS.bold, fontSize: 22, color: COLORS.accent },
  appTagline:  { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textMuted },

  /* Hero */
  heroBanner: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    borderWidth: 1, borderColor: COLORS.border,
    padding: SPACING.lg,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
    ...SHADOW.glow,
  },
  heroBgGlow: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: COLORS.primaryGlow, right: -60, top: -60,
  },
  heroTitle:    { fontFamily: FONTS.extraBold, fontSize: 28, color: COLORS.textPrimary, lineHeight: 34, marginBottom: 10 },
  heroSub:      { fontFamily: FONTS.regular, fontSize: 13, color: COLORS.textSecondary, lineHeight: 20, marginBottom: SPACING.lg },
  analyzeBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.full,
    paddingVertical: 14, alignItems: 'center', ...SHADOW.glow,
  },
  analyzeBtnText: { fontFamily: FONTS.bold, fontSize: 15, color: '#000' },

  /* Stats */
  statsRow: {
    flexDirection: 'row', justifyContent: 'space-around',
    marginHorizontal: SPACING.md, marginBottom: SPACING.lg,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md, padding: SPACING.md,
    borderWidth: 1, borderColor: COLORS.border,
  },
  statItem:  { alignItems: 'center' },
  statValue: { fontFamily: FONTS.extraBold, fontSize: 22, color: COLORS.accent },
  statLabel: { fontFamily: FONTS.regular,  fontSize: 10, color: COLORS.textMuted, marginTop: 2 },

  /* Features */
  sectionTitle: {
    fontFamily: FONTS.semiBold, fontSize: 16, color: COLORS.textPrimary,
    marginHorizontal: SPACING.md, marginBottom: SPACING.sm,
  },
  featureGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: SPACING.md, gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  featureCard: {
    width: CARD_W, backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border,
    padding: SPACING.md, ...SHADOW.card,
  },
  featureIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  featureEmoji:    { fontSize: 20 },
  featureTitle:    { fontFamily: FONTS.semiBold, fontSize: 13, marginBottom: 4 },
  featureDesc:     { fontFamily: FONTS.regular,  fontSize: 11, color: COLORS.textMuted, lineHeight: 16 },

  /* History btn */
  historyBtn: {
    marginHorizontal: SPACING.md, borderRadius: RADIUS.full,
    borderWidth: 1.5, borderColor: COLORS.border,
    paddingVertical: 14, alignItems: 'center', marginBottom: SPACING.md,
  },
  historyBtnText: { fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.textSecondary },

  footer: {
    textAlign: 'center', fontFamily: FONTS.regular,
    fontSize: 10, color: COLORS.textMuted, marginTop: 4,
  },
});
