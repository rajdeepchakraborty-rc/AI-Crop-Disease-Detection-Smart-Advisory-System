import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Platform, Switch, Alert,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../constants/theme';
import DiseaseCard   from '../components/DiseaseCard';
import SeverityMeter from '../components/SeverityMeter';
import { staticUrl } from '../services/api';

// ─── Tappable feature card ────────────────────────────────────────
function FeatureCard({ emoji, title, subtitle, onPress, accent }) {
  return (
    <TouchableOpacity style={[fc.card, { borderColor: accent ?? COLORS.border }]} onPress={onPress} activeOpacity={0.78}>
      <View style={[fc.iconWrap, { backgroundColor: (accent ?? COLORS.accent) + '1A' }]}>
        <Text style={fc.icon}>{emoji}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[fc.title, { color: accent ?? COLORS.accent }]}>{title}</Text>
        {subtitle ? <Text style={fc.sub} numberOfLines={2}>{subtitle}</Text> : null}
      </View>
      <Text style={[fc.arrow, { color: accent ?? COLORS.accent }]}>›</Text>
    </TouchableOpacity>
  );
}
const fc = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.md, marginTop: SPACING.sm,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg,
    borderWidth: 1, padding: 14, ...SHADOW.card,
  },
  iconWrap: { width: 46, height: 46, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center' },
  icon:  { fontSize: 22 },
  title: { fontFamily: FONTS.semiBold, fontSize: 14, marginBottom: 2 },
  sub:   { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textMuted, lineHeight: 16 },
  arrow: { fontFamily: FONTS.bold, fontSize: 22, paddingRight: 4 },
});

// ─── Section divider ──────────────────────────────────────────────
function Divider({ label }) {
  return (
    <View style={dv.row}>
      <View style={dv.line} />
      <Text style={dv.label}>{label}</Text>
      <View style={dv.line} />
    </View>
  );
}
const dv = StyleSheet.create({
  row:   { flexDirection: 'row', alignItems: 'center', marginHorizontal: SPACING.md, marginTop: SPACING.md, gap: 8 },
  line:  { flex: 1, height: 1, backgroundColor: COLORS.border },
  label: { fontFamily: FONTS.regular, fontSize: 10, color: COLORS.textMuted, letterSpacing: 0.8 },
});

// ═══════════════════════════════════════════════════════════════════
//  RESULT SCREEN — summary hub, each card navigates to detail screen
// ═══════════════════════════════════════════════════════════════════
export default function ResultScreen({ navigation, route }) {
  const { result } = route.params;
  const scrollRef  = useRef(null);
  const [remindersEnabled, setRemindersEnabled] = useState(false);

  // ── Disease ──────────────────────────────────────────────────────
  const diseaseClass  = result?.disease_class ?? null;
  const diseaseName   = result?.disease       ?? 'Unknown';
  const rawConf       = result?.confidence    ?? 0;
  const confidenceVal = rawConf > 1 ? rawConf : rawConf * 100;
  const disease = { predicted_class: diseaseClass, disease: diseaseName, confidence: confidenceVal };

  // ── Severity ─────────────────────────────────────────────────────
  const sevLevel = result?.severity_level ?? null;
  const sevNote  = result?.risk_note      ?? null;
  const sevObj   = result?.severity       ?? {};
  const sevDmg   = sevObj?.damage_ratio   ?? null;
  const sevPct   = sevDmg != null ? Math.round(sevDmg * 100) : null;
  const sevColor = sevPct == null ? COLORS.textMuted
                 : sevPct < 30   ? COLORS.success
                 : sevPct < 60   ? COLORS.warning
                 : COLORS.danger;

  // ── Treatment advisory ───────────────────────────────────────────
  const advice      = result?.advice          ?? {};
  const steps       = advice?.treatment_steps ?? result?.treatment_steps ?? [];
  const precautions = advice?.precautions     ?? result?.precautions     ?? [];
  const prevention  = advice?.prevention      ?? result?.prevention      ?? [];

  // ── XAI ─────────────────────────────────────────────────────────
  const heatmapUrl  = staticUrl(result?.heatmap_url ?? null);
  const explanation = result?.explanation         ?? null;
  const heatmapDesc = result?.heatmap_description ?? null;

  // ── Weather ──────────────────────────────────────────────────────
  const weather = result?.weather ?? {};

  // ── 5-day microclimate forecast ──────────────────────────────────
  const microclimate  = result?.microclimate_forecast ?? {};
  const forecastData  = microclimate?.forecast        ?? [];
  const forecastAlert = microclimate?.alert           ?? null;

  // ── Supply chain ─────────────────────────────────────────────────
  const supply = result?.supply_chain ?? {};
  const shops  = supply?.shops        ?? supply?.nearest_suppliers ?? [];

  // ── What-If ──────────────────────────────────────────────────────
  const whatif     = result?.what_if_analysis ?? {};
  const whatifText = whatif?.simulation_result ?? whatif?.result ?? null;

  const leafId   = result?.leaf_id  ?? '—';
  const location = result?.location ?? null;

  // ── Reminder ─────────────────────────────────────────────────────
  function toggleReminders(val) {
    setRemindersEnabled(val);
    if (val) {
      Alert.alert('✅ Reminder Set!', 'You will receive a treatment reminder in 10 seconds.');
      setTimeout(() => {
        Alert.alert('🌱 CropAI Reminder', `Time to treat your ${diseaseName}! Apply your plan now.`);
      }, 10000);
    }
  }

  // ── Navigation ───────────────────────────────────────────────────
  const goXai = () => navigation.navigate('XaiDetail', {
    result: { heatmapUrl, explanation, heatmapDesc, diseaseName, confidence: confidenceVal },
  });
  const goTreatment = () => navigation.navigate('TreatmentDetail', {
    diseaseName, steps, precautions, prevention,
    treatmentType: result?.treatment_type ?? 'organic',
    severity: sevLevel,
  });
  const goSupply = () => navigation.navigate('SupplyChainDetail', {
    shops, diseaseName, location,
  });
  const goForecast = () => navigation.navigate('WeatherForecast', {
    forecastData, alert: forecastAlert, diseaseName,
  });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      {/* ── Header ── */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.screenTitle}>Diagnosis Report</Text>
          <Text style={styles.screenSub}>AI-Powered Analysis</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('History', { leafId })} style={styles.histBtn}>
          <Text style={styles.histIcon}>📋</Text>
        </TouchableOpacity>
      </View>

      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── 1. DISEASE CARD ── */}
        <DiseaseCard disease={disease} confidence={confidenceVal} />

        {/* ── 2. SEVERITY ── */}
        {(sevLevel || sevNote || sevPct != null) && (
          <View style={styles.sevCard}>
            <View style={styles.sevRow}>
              <Text style={styles.sevEmoji}>⚠️</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.sevTitle}>Severity Analysis</Text>
                {sevLevel && <Text style={[styles.sevLevel, { color: sevColor }]}>{sevLevel}</Text>}
                {sevNote  && <Text style={styles.sevNote} numberOfLines={3}>{sevNote}</Text>}
              </View>
            </View>
            {sevPct != null && <SeverityMeter value={sevPct} color={sevColor} />}
          </View>
        )}

        <Divider label="DETAILED REPORTS" />

        {/* ── 3. XAI → XaiDetailScreen ── */}
        <FeatureCard
          emoji="🧠"
          title="Explainable AI (Grad-CAM)"
          subtitle={heatmapDesc ?? explanation ?? 'View heatmap and model attention analysis'}
          onPress={goXai}
          accent="#a78bfa"
        />

        {/* ── 4. TREATMENT → TreatmentDetailScreen ── */}
        <FeatureCard
          emoji="🤖"
          title="AI Treatment Advisory"
          subtitle={steps.length > 0
            ? `${steps.length} treatment steps · ${precautions.length} precautions · ${prevention.length} prevention tips`
            : 'Treatment plan not available'}
          onPress={goTreatment}
          accent={COLORS.accent}
        />

        {/* ── 5. SUPPLY CHAIN → SupplyChainDetailScreen ── */}
        <FeatureCard
          emoji="🗺️"
          title="Nearest Agri-Suppliers"
          subtitle={shops.length > 0
            ? `${shops.length} shop${shops.length > 1 ? 's' : ''} found near you — tap to open in Maps`
            : 'No suppliers found within 50 km'}
          onPress={goSupply}
          accent="#fb923c"
        />

        {/* ── 6. WEATHER FORECAST → WeatherForecastScreen ── */}
        <FeatureCard
          emoji="⛅"
          title="5-Day Weather Forecast"
          subtitle={forecastAlert
            ? forecastAlert.substring(0, 90)
            : forecastData.length > 0
              ? `${forecastData.length}-day microclimate disease risk analysis`
              : 'Forecast data not available'}
          onPress={goForecast}
          accent="#38bdf8"
        />

        <Divider label="SIMULATION & ENVIRONMENT" />

        {/* ── 7. WHAT-IF inline ── */}
        {whatifText && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>💭  What-If Simulation Result</Text>
            <Text style={styles.cardBody}>{whatifText}</Text>
          </View>
        )}

        {/* ── 8. WEATHER inline summary ── */}
        {(weather?.temperature != null || weather?.humidity != null) && (
          <View style={styles.weatherCard}>
            <Text style={styles.weatherTitle}>🌤️  Current Weather</Text>
            {weather.city && <Text style={styles.weatherCity}>📍 {weather.city}</Text>}
            <View style={styles.weatherRow}>
              {weather.temperature != null && (
                <View style={styles.weatherCell}>
                  <Text style={styles.weatherEmoji}>🌡️</Text>
                  <Text style={styles.weatherVal}>{weather.temperature}°C</Text>
                  <Text style={styles.weatherLabel}>Temp</Text>
                </View>
              )}
              {weather.humidity != null && (
                <View style={styles.weatherCell}>
                  <Text style={styles.weatherEmoji}>💧</Text>
                  <Text style={styles.weatherVal}>{weather.humidity}%</Text>
                  <Text style={styles.weatherLabel}>Humidity</Text>
                </View>
              )}
              {weather.rainfall != null && (
                <View style={styles.weatherCell}>
                  <Text style={styles.weatherEmoji}>🌧️</Text>
                  <Text style={styles.weatherVal}>{weather.rainfall} mm</Text>
                  <Text style={styles.weatherLabel}>Rainfall</Text>
                </View>
              )}
            </View>
            {weather.impact && <Text style={styles.weatherImpact}>{weather.impact}</Text>}
          </View>
        )}

        <Divider label="MANAGEMENT" />

        {/* ── 9. DAILY REMINDERS ── */}
        <View style={styles.card}>
          <View style={styles.remRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>🔔  Daily Treatment Reminders</Text>
              <Text style={styles.cardBody}>Get automated alerts to apply your treatment plan on time.</Text>
            </View>
            <Switch
              value={remindersEnabled}
              onValueChange={toggleReminders}
              trackColor={{ false: COLORS.bgCardAlt, true: COLORS.primary }}
              thumbColor={remindersEnabled ? COLORS.accent : '#555'}
            />
          </View>
        </View>

        {/* ── 10. LEAF ID ── */}
        <View style={styles.leafIdRow}>
          <Text style={styles.leafIdLabel}>🍃 Leaf ID</Text>
          <Text style={styles.leafIdValue}>{leafId}</Text>
        </View>

        {/* ── CTA ── */}
        <TouchableOpacity style={styles.ctaBtn} onPress={() => navigation.navigate('Upload')} activeOpacity={0.85}>
          <Text style={styles.ctaText}>📷  Analyze Another Crop</Text>
        </TouchableOpacity>

        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingBottom: 20 },

  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: Platform.OS === 'ios' ? 56 : 44,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  backBtn:     { width: 40, height: 40, justifyContent: 'center' },
  backIcon:    { fontSize: 24, color: COLORS.accent },
  screenTitle: { fontFamily: FONTS.bold, fontSize: 17, color: COLORS.textPrimary },
  screenSub:   { fontFamily: FONTS.regular, fontSize: 10, color: COLORS.textMuted, letterSpacing: 0.5 },
  histBtn:     { width: 40, height: 40, alignItems: 'flex-end', justifyContent: 'center' },
  histIcon:    { fontSize: 20 },

  sevCard: {
    marginHorizontal: SPACING.md, marginTop: SPACING.md,
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, ...SHADOW.card,
  },
  sevRow:    { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  sevEmoji:  { fontSize: 22, marginTop: 2 },
  sevTitle:  { fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.accent, marginBottom: 2 },
  sevLevel:  { fontFamily: FONTS.bold, fontSize: 14, marginBottom: 2 },
  sevNote:   { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textSecondary, lineHeight: 17 },

  card: {
    marginHorizontal: SPACING.md, marginTop: SPACING.md,
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, ...SHADOW.card,
  },
  cardTitle: { fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.accent, marginBottom: 8 },
  cardBody:  { fontFamily: FONTS.regular,  fontSize: 12, color: COLORS.textSecondary, lineHeight: 19 },
  remRow:    { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },

  weatherCard: {
    marginHorizontal: SPACING.md, marginTop: SPACING.md,
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, ...SHADOW.card,
  },
  weatherTitle:  { fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.accent, marginBottom: 4 },
  weatherCity:   { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textMuted, marginBottom: 10 },
  weatherRow:    { flexDirection: 'row', justifyContent: 'space-around' },
  weatherCell:   { alignItems: 'center', gap: 3 },
  weatherEmoji:  { fontSize: 22 },
  weatherVal:    { fontFamily: FONTS.bold, fontSize: 16, color: COLORS.textPrimary },
  weatherLabel:  { fontFamily: FONTS.regular, fontSize: 10, color: COLORS.textMuted },
  weatherImpact: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textSecondary, marginTop: 10, lineHeight: 18 },

  leafIdRow: {
    marginHorizontal: SPACING.md, marginTop: SPACING.md,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.bgCardAlt, borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md, paddingVertical: 12,
    borderWidth: 1, borderColor: COLORS.border,
  },
  leafIdLabel: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textMuted },
  leafIdValue: { fontFamily: FONTS.semiBold, fontSize: 12, color: COLORS.textSecondary },

  ctaBtn: {
    marginHorizontal: SPACING.md, marginTop: SPACING.lg,
    backgroundColor: COLORS.accent + '18', borderRadius: RADIUS.full,
    borderWidth: 1.5, borderColor: COLORS.accent,
    paddingVertical: 15, alignItems: 'center',
  },
  ctaText: { fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.accent },
});
