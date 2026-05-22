import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';

export default function HistoryCard({ record, index }) {
  const disease  = record?.disease ?? record?.predicted_class ?? 'Unknown';
  const severity = record?.severity ?? record?.damage_pct;
  const date     = record?.timestamp ?? record?.date ?? record?.created_at;
  const treatment= record?.treatment_type ?? record?.treatment;

  const formatted = disease.replace(/___/g, ' — ').replace(/_/g, ' ');
  const isHealthy = formatted.toLowerCase().includes('healthy');

  const dateStr = date
    ? new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'No date';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.numBadge, isHealthy && styles.numBadgeGreen]}>
          <Text style={styles.numText}>#{index + 1}</Text>
        </View>
        <Text style={[styles.disease, { color: isHealthy ? COLORS.success : COLORS.danger }]} numberOfLines={2}>
          {formatted}
        </Text>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Text style={styles.metaIcon}>📅</Text>
          <Text style={styles.metaText}>{dateStr}</Text>
        </View>
        {severity != null && (
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>📊</Text>
            <Text style={styles.metaText}>{Math.round(Number(severity))}% severity</Text>
          </View>
        )}
        {treatment && (
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>{treatment === 'organic' ? '🌿' : '🧪'}</Text>
            <Text style={styles.metaText}>{treatment}</Text>
          </View>
        )}
      </View>

      {record?.advisory_summary && (
        <Text style={styles.summary} numberOfLines={2}>
          {record.advisory_summary}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.border,
    padding: SPACING.md,
  },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: SPACING.sm },
  numBadge: {
    minWidth: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(239,68,68,0.18)', borderWidth: 1, borderColor: COLORS.danger + '55',
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6,
  },
  numBadgeGreen: { backgroundColor: 'rgba(34,197,94,0.18)', borderColor: COLORS.success + '55' },
  numText:  { fontFamily: FONTS.bold, fontSize: 11, color: COLORS.textSecondary },
  disease:  { fontFamily: FONTS.semiBold, fontSize: 14, flex: 1, lineHeight: 20 },

  metaRow:  { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaIcon: { fontSize: 12 },
  metaText: { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textMuted },

  summary: {
    marginTop: SPACING.sm, fontFamily: FONTS.regular,
    fontSize: 11, color: COLORS.textMuted, lineHeight: 16,
  },
});
