import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../constants/theme';

export default function SeverityMeter({ value, color }) {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: value, duration: 900, useNativeDriver: false,
    }).start();
  }, [value]);

  const barWidth = widthAnim.interpolate({
    inputRange: [0, 100], outputRange: ['0%', '100%'],
  });

  const label = value < 30 ? 'Low' : value < 60 ? 'Moderate' : value < 80 ? 'High' : 'Critical';

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>📊  Disease Severity</Text>
        <View style={[styles.badge, { backgroundColor: color + '22', borderColor: color }]}>
          <Text style={[styles.badgeText, { color }]}>{label}</Text>
        </View>
      </View>

      <View style={styles.barBg}>
        <Animated.View style={[styles.barFill, { width: barWidth, backgroundColor: color }]} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerLabel}>0%</Text>
        <Text style={[styles.footerValue, { color }]}>{value}% damage</Text>
        <Text style={styles.footerLabel}>100%</Text>
      </View>
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
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.sm },
  title:     { fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.accent },
  badge: {
    borderWidth: 1, borderRadius: RADIUS.full,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  badgeText: { fontFamily: FONTS.semiBold, fontSize: 11 },

  barBg: {
    height: 10, backgroundColor: COLORS.bgCardAlt,
    borderRadius: RADIUS.full, overflow: 'hidden', marginBottom: 8,
  },
  barFill: { height: '100%', borderRadius: RADIUS.full },

  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerLabel: { fontFamily: FONTS.regular, fontSize: 10, color: COLORS.textMuted },
  footerValue: { fontFamily: FONTS.bold,    fontSize: 13 },
});
