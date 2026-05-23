import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Platform,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../constants/theme';

function Step({ num, text }) {
  return (
    <View style={s.stepRow}>
      <View style={s.stepBubble}><Text style={s.stepNum}>{num}</Text></View>
      <Text style={s.stepText}>{text}</Text>
    </View>
  );
}

function Bullet({ icon = '•', text }) {
  return (
    <View style={s.bulletRow}>
      <Text style={s.bulletIcon}>{icon}</Text>
      <Text style={s.bulletText}>{text}</Text>
    </View>
  );
}

export default function TreatmentDetailScreen({ navigation, route }) {
  const { diseaseName, steps, precautions, prevention, treatmentType, severity } = route.params;

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <View style={s.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={s.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={s.title}>Treatment Advisory</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={s.heroBadge}>
          <Text style={s.heroEmoji}>🤖</Text>
          <Text style={s.heroTitle}>AI Treatment Plan</Text>
          <Text style={s.heroDisease}>{diseaseName ?? 'Disease'}</Text>
          <View style={s.tagRow}>
            {treatmentType && (
              <View style={s.tag}>
                <Text style={s.tagText}>{treatmentType === 'organic' ? '🌿 Organic' : '🧪 Chemical'}</Text>
              </View>
            )}
            {severity && (
              <View style={[s.tag, s.tagRed]}>
                <Text style={[s.tagText, { color: COLORS.danger }]}>{severity}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Treatment Steps */}
        {steps?.length > 0 && (
          <View style={s.card}>
            <Text style={s.cardTitle}>🩺  Treatment Steps</Text>
            <Text style={s.cardSubtitle}>Follow these steps in order for best results</Text>
            {steps.map((step, i) => <Step key={i} num={i + 1} text={step} />)}
          </View>
        )}

        {/* Precautions */}
        {precautions?.length > 0 && (
          <View style={s.card}>
            <Text style={s.cardTitle}>⚠️  Precautions</Text>
            <Text style={s.cardSubtitle}>Safety measures while applying treatment</Text>
            {precautions.map((p, i) => <Bullet key={i} icon="⚠" text={p} />)}
          </View>
        )}

        {/* Prevention */}
        {prevention?.length > 0 && (
          <View style={s.card}>
            <Text style={s.cardTitle}>🛡️  Prevention Tips</Text>
            <Text style={s.cardSubtitle}>Stop this disease from returning next season</Text>
            {prevention.map((p, i) => <Bullet key={i} icon="✓" text={p} />)}
          </View>
        )}

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
  heroTitle:   { fontFamily: FONTS.bold, fontSize: 20, color: COLORS.textPrimary, marginBottom: 6 },
  heroDisease: { fontFamily: FONTS.extraBold, fontSize: 18, color: COLORS.accent, marginBottom: 12 },
  tagRow:      { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },
  tag:         { paddingHorizontal: 12, paddingVertical: 4, backgroundColor: COLORS.accent + '18', borderRadius: 20, borderWidth: 1, borderColor: COLORS.accent },
  tagRed:      { backgroundColor: COLORS.danger + '18', borderColor: COLORS.danger },
  tagText:     { fontFamily: FONTS.semiBold, fontSize: 12, color: COLORS.accent },

  card: {
    marginHorizontal: SPACING.md, marginTop: SPACING.md,
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border,
    padding: SPACING.md, ...SHADOW.card,
  },
  cardTitle:    { fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.accent, marginBottom: 4 },
  cardSubtitle: { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textMuted, marginBottom: 12 },

  stepRow:    { flexDirection: 'row', gap: 10, marginBottom: 12, alignItems: 'flex-start' },
  stepBubble: { width: 26, height: 26, borderRadius: 13, backgroundColor: COLORS.accent + '22', alignItems: 'center', justifyContent: 'center' },
  stepNum:    { fontFamily: FONTS.bold, fontSize: 12, color: COLORS.accent },
  stepText:   { fontFamily: FONTS.regular, fontSize: 13, color: COLORS.textSecondary, lineHeight: 20, flex: 1 },

  bulletRow:  { flexDirection: 'row', gap: 10, marginBottom: 8, alignItems: 'flex-start' },
  bulletIcon: { color: COLORS.accent, fontSize: 14, marginTop: 2 },
  bulletText: { fontFamily: FONTS.regular, fontSize: 13, color: COLORS.textSecondary, lineHeight: 20, flex: 1 },
});
