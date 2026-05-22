import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, StatusBar, Platform, Dimensions,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../constants/theme';
import DiseaseCard   from '../components/DiseaseCard';
import WeatherCard   from '../components/WeatherCard';
import HeatmapViewer from '../components/HeatmapViewer';
import AudioPlayer   from '../components/AudioPlayer';
import SeverityMeter from '../components/SeverityMeter';
import { staticUrl } from '../services/api';

const { width } = Dimensions.get('window');

export default function ResultScreen({ navigation, route }) {
  const { result } = route.params;
  const scrollRef  = useRef(null);

  // Extract fields from orchestrator response
  const disease    = result?.disease_info          ?? {};
  const severity   = result?.severity              ?? {};
  const weather    = result?.weather               ?? {};
  const forecast   = result?.forecast              ?? {};
  const advisory   = result?.advisory              ?? {};
  const whatif     = result?.whatif_simulation     ?? {};
  const supply     = result?.supply_chain          ?? {};
  const heatmapUrl = staticUrl(result?.heatmap_url ?? result?.xai?.heatmap_url);
  const audioUrl   = staticUrl(result?.audio_url   ?? result?.voice?.audio_url);

  const confidence = disease?.confidence ?? 0;
  const leafId     = result?.leaf_id ?? 'leaf';

  // Severity color
  const sevPct   = severity?.damage_ratio ? Math.round(severity.damage_ratio * 100) : null;
  const sevColor = sevPct == null ? COLORS.textMuted : sevPct < 30 ? COLORS.success : sevPct < 60 ? COLORS.warning : COLORS.danger;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      {/* Fixed header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Diagnosis Report</Text>
        <TouchableOpacity onPress={() => navigation.navigate('History')} style={styles.histBtn}>
          <Text style={styles.histIcon}>📋</Text>
        </TouchableOpacity>
      </View>

      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── 1. Disease Card ── */}
        <DiseaseCard disease={disease} confidence={confidence} />

        {/* ── 2. Severity Meter ── */}
        {sevPct != null && <SeverityMeter value={sevPct} color={sevColor} />}

        {/* ── 3. Heatmap ── */}
        {heatmapUrl && <HeatmapViewer url={heatmapUrl} />}

        {/* ── 4. Voice Advisory ── */}
        {audioUrl && <AudioPlayer url={audioUrl} language={result?.language ?? 'english'} />}

        {/* ── 5. LLM Advisory ── */}
        {(advisory?.recommendation || advisory?.organic_treatment || advisory?.chemical_treatment) && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🤖  AI Treatment Advisory</Text>
            {advisory.recommendation && (
              <Text style={styles.advisoryText}>{advisory.recommendation}</Text>
            )}
            {advisory.organic_treatment && (
              <View style={styles.treatmentBlock}>
                <Text style={styles.treatLabel}>🌿 Organic</Text>
                <Text style={styles.treatText}>{advisory.organic_treatment}</Text>
              </View>
            )}
            {advisory.chemical_treatment && (
              <View style={styles.treatmentBlock}>
                <Text style={styles.treatLabel}>🧪 Chemical</Text>
                <Text style={styles.treatText}>{advisory.chemical_treatment}</Text>
              </View>
            )}
          </View>
        )}

        {/* ── 6. Weather ── */}
        {weather?.temperature != null && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🌤️  Weather Intelligence</Text>
            <View style={styles.weatherGrid}>
              <WeatherCard emoji="🌡️" label="Temperature" value={`${weather.temperature}°C`} color={COLORS.warning} />
              <WeatherCard emoji="💧" label="Humidity"    value={`${weather.humidity}%`}      color={COLORS.info} />
              {weather.rain_risk != null && (
                <WeatherCard emoji="🌧️" label="Rain Risk" value={`${Math.round(weather.rain_risk * 100)}%`} color={COLORS.info} />
              )}
              {weather.wind_speed != null && (
                <WeatherCard emoji="💨" label="Wind"      value={`${weather.wind_speed} m/s`} color={COLORS.textSecondary} />
              )}
            </View>
          </View>
        )}

        {/* ── 7. What-If ── */}
        {whatif?.simulation_result && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>💭  What-If Simulation</Text>
            <Text style={styles.advisoryText}>{whatif.simulation_result}</Text>
          </View>
        )}

        {/* ── 8. Supply Chain ── */}
        {supply?.nearest_suppliers?.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🗺️  Nearest Agri-Suppliers</Text>
            {supply.nearest_suppliers.slice(0, 3).map((s, i) => (
              <View key={i} style={styles.supplierRow}>
                <Text style={styles.supplierNum}>{i + 1}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.supplierName}>{s.name ?? 'Agri Store'}</Text>
                  {s.distance_km != null && (
                    <Text style={styles.supplierDist}>{s.distance_km.toFixed(1)} km away</Text>
                  )}
                </View>
                <Text style={styles.supplierTag}>🏪</Text>
              </View>
            ))}
          </View>
        )}

        {/* ── 9. Leaf ID ── */}
        <View style={styles.leafIdCard}>
          <Text style={styles.leafIdLabel}>Leaf ID</Text>
          <Text style={styles.leafIdValue}>{leafId}</Text>
        </View>

        {/* Analyze again */}
        <TouchableOpacity style={styles.analyzeAgainBtn} onPress={() => navigation.navigate('Upload')} activeOpacity={0.85}>
          <Text style={styles.analyzeAgainText}>📷  Analyze Another Crop</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
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
  backBtn:     { width: 40, height: 40, alignItems: 'flex-start', justifyContent: 'center' },
  backIcon:    { fontSize: 24, color: COLORS.accent },
  screenTitle: { fontFamily: FONTS.bold, fontSize: 17, color: COLORS.textPrimary },
  histBtn:     { width: 40, height: 40, alignItems: 'flex-end', justifyContent: 'center' },
  histIcon:    { fontSize: 20 },

  card: {
    marginHorizontal: SPACING.md, marginTop: SPACING.md,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border,
    padding: SPACING.md, ...SHADOW.card,
  },
  cardTitle: { fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.accent, marginBottom: SPACING.sm },

  advisoryText: { fontFamily: FONTS.regular, fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },

  treatmentBlock: {
    marginTop: SPACING.sm, backgroundColor: COLORS.accentSoft,
    borderRadius: RADIUS.md, padding: SPACING.sm,
    borderWidth: 1, borderColor: COLORS.border,
  },
  treatLabel: { fontFamily: FONTS.semiBold, fontSize: 12, color: COLORS.accent, marginBottom: 4 },
  treatText:  { fontFamily: FONTS.regular,  fontSize: 12, color: COLORS.textSecondary, lineHeight: 18 },

  weatherGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },

  supplierRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  supplierNum:  { fontFamily: FONTS.bold,    fontSize: 16, color: COLORS.textMuted, width: 20 },
  supplierName: { fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.textPrimary },
  supplierDist: { fontFamily: FONTS.regular,  fontSize: 11, color: COLORS.textMuted },
  supplierTag:  { fontSize: 18 },

  leafIdCard: {
    marginHorizontal: SPACING.md, marginTop: SPACING.md,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.bgCardAlt, borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md, paddingVertical: 10,
    borderWidth: 1, borderColor: COLORS.border,
  },
  leafIdLabel: { fontFamily: FONTS.regular,  fontSize: 12, color: COLORS.textMuted },
  leafIdValue: { fontFamily: FONTS.semiBold, fontSize: 12, color: COLORS.textSecondary },

  analyzeAgainBtn: {
    marginHorizontal: SPACING.md, marginTop: SPACING.lg,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.full, borderWidth: 1.5, borderColor: COLORS.borderBright,
    paddingVertical: 14, alignItems: 'center',
  },
  analyzeAgainText: { fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.accent },
});
