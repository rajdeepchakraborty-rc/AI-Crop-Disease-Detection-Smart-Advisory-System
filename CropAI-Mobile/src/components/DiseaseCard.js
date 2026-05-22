import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../constants/theme';

// Maps disease class name to readable format and emoji
function formatDisease(raw) {
  if (!raw) return { name: 'Unknown', plant: '', emoji: '🌿' };
  const parts  = raw.split('___');
  const plant   = parts[0]?.replace(/_/g, ' ') ?? '';
  const disease = parts[1]?.replace(/_/g, ' ') ?? '';
  const isHealthy = disease.toLowerCase() === 'healthy';
  const emoji = isHealthy ? '✅' : '🦠';
  return { name: isHealthy ? 'Healthy' : disease, plant, emoji, isHealthy };
}

export default function DiseaseCard({ disease, confidence }) {
  const raw    = disease?.predicted_class ?? disease?.class_name ?? disease?.disease;
  const parsed = formatDisease(raw);
  const pct    = confidence != null ? Math.round(Number(confidence) * 100) : null;
  const conf   = pct ?? (disease?.confidence_pct != null ? Math.round(disease.confidence_pct) : null);

  const borderColor = parsed.isHealthy ? COLORS.success : COLORS.danger;
  const bgColor     = parsed.isHealthy ? 'rgba(34,197,94,0.10)' : 'rgba(239,68,68,0.10)';

  return (
    <View style={[styles.card, { borderColor, backgroundColor: bgColor }]}>
      {/* Glow line at top */}
      <View style={[styles.topLine, { backgroundColor: borderColor }]} />

      <View style={styles.row}>
        <View style={[styles.emojiWrap, { backgroundColor: borderColor + '22' }]}>
          <Text style={styles.emoji}>{parsed.emoji}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.plant}>{parsed.plant || 'Plant'}</Text>
          <Text style={[styles.disease, { color: parsed.isHealthy ? COLORS.success : COLORS.danger }]}>
            {parsed.name}
          </Text>
          {raw && (
            <Text style={styles.rawClass}>{raw.replace(/___/g, ' — ').replace(/_/g, ' ')}</Text>
          )}
        </View>
        {conf != null && (
          <View style={styles.confBadge}>
            <Text style={styles.confValue}>{conf}%</Text>
            <Text style={styles.confLabel}>confidence</Text>
          </View>
        )}
      </View>

      {/* Status tag */}
      <View style={[styles.statusTag, { borderColor, backgroundColor: borderColor + '18' }]}>
        <Text style={[styles.statusText, { color: borderColor }]}>
          {parsed.isHealthy ? '✅  Plant is Healthy' : '⚠️  Disease Detected'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.md, marginTop: SPACING.md,
    borderRadius: RADIUS.lg, borderWidth: 1.5,
    padding: SPACING.md, overflow: 'hidden',
    ...SHADOW.card,
  },
  topLine: { position: 'absolute', top: 0, left: 0, right: 0, height: 3 },

  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },

  emojiWrap: {
    width: 56, height: 56, borderRadius: RADIUS.md,
    alignItems: 'center', justifyContent: 'center',
  },
  emoji: { fontSize: 28 },

  info: { flex: 1 },
  plant: {
    fontFamily: FONTS.medium, fontSize: 11,
    color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1,
  },
  disease: {
    fontFamily: FONTS.extraBold, fontSize: 20, marginTop: 2,
  },
  rawClass: {
    fontFamily: FONTS.regular, fontSize: 10,
    color: COLORS.textMuted, marginTop: 3,
  },

  confBadge: { alignItems: 'center' },
  confValue: { fontFamily: FONTS.extraBold, fontSize: 22, color: COLORS.textPrimary },
  confLabel: { fontFamily: FONTS.regular,   fontSize: 10, color: COLORS.textMuted },

  statusTag: {
    borderWidth: 1, borderRadius: RADIUS.full,
    paddingVertical: 6, paddingHorizontal: 14, alignSelf: 'flex-start',
  },
  statusText: { fontFamily: FONTS.semiBold, fontSize: 12 },
});
