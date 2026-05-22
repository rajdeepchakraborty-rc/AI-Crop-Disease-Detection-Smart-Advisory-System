import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../constants/theme';

export default function HeatmapViewer({ url }) {
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>🧠  Grad-CAM XAI Heatmap</Text>
      <Text style={styles.subtitle}>Highlighted regions show where the AI detected disease</Text>

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setExpanded(!expanded)}
        style={[styles.imgWrap, expanded && styles.imgWrapExpanded]}
      >
        {loading && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loaderText}>Loading heatmap...</Text>
          </View>
        )}
        {error ? (
          <View style={styles.loader}>
            <Text style={styles.errorEmoji}>⚠️</Text>
            <Text style={styles.errorText}>Heatmap unavailable</Text>
          </View>
        ) : (
          <Image
            source={{ uri: url }}
            style={[styles.img, expanded && styles.imgExpanded, loading && { opacity: 0 }]}
            resizeMode="contain"
            onLoad={() => setLoading(false)}
            onError={() => { setLoading(false); setError(true); }}
          />
        )}
      </TouchableOpacity>
      <Text style={styles.tapHint}>{expanded ? 'Tap to collapse' : 'Tap to expand'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.md, marginTop: SPACING.md,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border,
    padding: SPACING.md, ...SHADOW.card,
  },
  title:    { fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.accent, marginBottom: 4 },
  subtitle: { fontFamily: FONTS.regular,  fontSize: 11, color: COLORS.textMuted, marginBottom: SPACING.sm },

  imgWrap: {
    height: 200, backgroundColor: COLORS.bgCardAlt,
    borderRadius: RADIUS.md, overflow: 'hidden', alignItems: 'center', justifyContent: 'center',
  },
  imgWrapExpanded: { height: 340 },
  img:             { width: '100%', height: '100%' },
  imgExpanded:     { height: 340 },

  loader: { alignItems: 'center', gap: 8 },
  loaderText: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textMuted },
  errorEmoji: { fontSize: 30 },
  errorText:  { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.danger },

  tapHint: {
    fontFamily: FONTS.regular, fontSize: 10, color: COLORS.textMuted,
    textAlign: 'center', marginTop: 6,
  },
});
