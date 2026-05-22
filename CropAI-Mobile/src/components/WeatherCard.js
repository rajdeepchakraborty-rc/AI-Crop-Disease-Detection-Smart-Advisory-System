import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';

export default function WeatherCard({ emoji, label, value, color }) {
  return (
    <View style={[styles.card, { borderColor: color + '44' }]}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 80, backgroundColor: COLORS.bgCardAlt,
    borderRadius: RADIUS.md, borderWidth: 1,
    padding: SPACING.sm, alignItems: 'center', gap: 4,
  },
  emoji: { fontSize: 20 },
  value: { fontFamily: FONTS.bold,    fontSize: 15 },
  label: { fontFamily: FONTS.regular, fontSize: 10, color: COLORS.textMuted, textAlign: 'center' },
});
