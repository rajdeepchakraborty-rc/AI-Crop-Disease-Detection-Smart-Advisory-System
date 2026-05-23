import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Platform,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../constants/theme';
import HeatmapViewer from '../components/HeatmapViewer';

export default function XaiDetailScreen({ navigation, route }) {
  const { result } = route.params;
  const heatmapUrl     = result?.heatmapUrl     ?? null;
  const explanation    = result?.explanation    ?? 'No XAI explanation available.';
  const heatmapDesc    = result?.heatmapDesc    ?? null;
  const diseaseName    = result?.diseaseName    ?? 'Disease';
  const confidence     = result?.confidence     ?? 0;

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <View style={s.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={s.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={s.title}>Explainable AI</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Header badge */}
        <View style={s.heroBadge}>
          <Text style={s.heroEmoji}>🧠</Text>
          <Text style={s.heroTitle}>Grad-CAM Heatmap</Text>
          <Text style={s.heroSub}>AI attention visualisation for</Text>
          <Text style={s.heroDisease}>{diseaseName}</Text>
          <View style={s.confBadge}>
            <Text style={s.confText}>{Math.round(confidence)}% confidence</Text>
          </View>
        </View>

        {/* Heatmap */}
        {heatmapUrl && (
          <View style={s.card}>
            <Text style={s.cardTitle}>📸  Heatmap Image</Text>
            <HeatmapViewer url={heatmapUrl} />
          </View>
        )}

        {/* Description */}
        {heatmapDesc && (
          <View style={s.card}>
            <Text style={s.cardTitle}>🗺️  Heatmap Description</Text>
            <Text style={s.body}>{heatmapDesc}</Text>
          </View>
        )}

        {/* Explanation */}
        <View style={s.card}>
          <Text style={s.cardTitle}>🔬  Technical Explanation</Text>
          <Text style={s.body}>{explanation}</Text>
        </View>

        {/* What is XAI */}
        <View style={[s.card, s.infoCard]}>
          <Text style={s.cardTitle}>ℹ️  What is Grad-CAM?</Text>
          <Text style={s.body}>
            Gradient-weighted Class Activation Mapping (Grad-CAM) highlights the regions of
            the leaf image that the AI model looked at most when making its prediction.
            Bright (red/yellow) areas are where the disease signature is strongest.
            This makes the AI decision transparent and trustworthy.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingBottom: 24 },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: Platform.OS === 'ios' ? 56 : 44,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  backBtn:  { width: 40, height: 40, justifyContent: 'center' },
  backIcon: { fontSize: 24, color: COLORS.accent },
  title:    { fontFamily: FONTS.bold, fontSize: 17, color: COLORS.textPrimary },

  heroBadge: {
    margin: SPACING.md, padding: SPACING.lg,
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.xl,
    borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', ...SHADOW.card,
  },
  heroEmoji:   { fontSize: 48, marginBottom: 8 },
  heroTitle:   { fontFamily: FONTS.bold, fontSize: 20, color: COLORS.textPrimary, marginBottom: 4 },
  heroSub:     { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textMuted },
  heroDisease: { fontFamily: FONTS.extraBold, fontSize: 18, color: COLORS.accent, marginTop: 4 },
  confBadge:   { marginTop: 10, paddingHorizontal: 16, paddingVertical: 5, backgroundColor: COLORS.accent + '18', borderRadius: 20, borderWidth: 1, borderColor: COLORS.accent },
  confText:    { fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.accent },

  card: {
    marginHorizontal: SPACING.md, marginTop: SPACING.md,
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border,
    padding: SPACING.md, ...SHADOW.card,
  },
  infoCard: { borderColor: COLORS.accent + '33' },
  cardTitle: { fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.accent, marginBottom: 10 },
  body:      { fontFamily: FONTS.regular, fontSize: 13, color: COLORS.textSecondary, lineHeight: 21 },
});
