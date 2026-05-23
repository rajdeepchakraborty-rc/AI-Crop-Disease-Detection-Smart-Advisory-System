import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Platform,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../constants/theme';

const WEATHER_ICONS = {
  rain: '🌧️',
  hot:  '🌡️',
  cold: '❄️',
  humid:'💧',
  good: '☀️',
  warn: '⚠️',
};

function getDayLabel(dateStr, index) {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

function getRiskColor(humidity, rain, temp) {
  if (rain > 5 || humidity > 85) return COLORS.danger;
  if (rain > 2 || humidity > 70) return COLORS.warning;
  if (temp > 35) return COLORS.warning;
  return COLORS.success;
}

function getRiskLabel(humidity, rain, temp) {
  if (rain > 5 || humidity > 85) return 'High Risk 🔴';
  if (rain > 2 || humidity > 70) return 'Medium Risk 🟡';
  if (temp > 35) return 'Heat Risk 🟡';
  return 'Low Risk 🟢';
}

function getRainIcon(rain) {
  if (rain > 5) return '⛈️';
  if (rain > 1) return '🌦️';
  return '☀️';
}

function ForecastCard({ day, dateStr, temp, humidity, rain, index, diseaseName }) {
  const riskColor = getRiskColor(humidity, rain, temp);
  const riskLabel = getRiskLabel(humidity, rain, temp);
  const isToday   = index === 0;

  return (
    <View style={[fc.card, isToday && fc.todayCard, { borderLeftColor: riskColor }]}>
      {isToday && <View style={fc.todayBadge}><Text style={fc.todayBadgeText}>TODAY</Text></View>}

      <View style={fc.topRow}>
        <View>
          <Text style={fc.dayLabel}>{day}</Text>
          <Text style={fc.dateLabel}>{dateStr}</Text>
        </View>
        <Text style={fc.rainIcon}>{getRainIcon(rain)}</Text>
      </View>

      <View style={fc.metricsRow}>
        <View style={fc.metric}>
          <Text style={fc.metricEmoji}>🌡️</Text>
          <Text style={fc.metricVal}>{temp}°C</Text>
          <Text style={fc.metricLabel}>Temp</Text>
        </View>
        <View style={[fc.metric, fc.metricBorder]}>
          <Text style={fc.metricEmoji}>💧</Text>
          <Text style={fc.metricVal}>{humidity}%</Text>
          <Text style={fc.metricLabel}>Humidity</Text>
        </View>
        <View style={fc.metric}>
          <Text style={fc.metricEmoji}>🌧️</Text>
          <Text style={fc.metricVal}>{rain} mm</Text>
          <Text style={fc.metricLabel}>Rainfall</Text>
        </View>
      </View>

      <View style={[fc.riskTag, { backgroundColor: riskColor + '22', borderColor: riskColor }]}>
        <Text style={[fc.riskText, { color: riskColor }]}>{riskLabel}</Text>
      </View>
    </View>
  );
}

const fc = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.md, marginTop: SPACING.md,
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border,
    borderLeftWidth: 4,
    padding: SPACING.md, ...SHADOW.card,
  },
  todayCard: { borderColor: COLORS.accent + '55' },
  todayBadge: {
    position: 'absolute', top: 10, right: 10,
    backgroundColor: COLORS.accent + '22', borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 2,
    borderWidth: 1, borderColor: COLORS.accent,
  },
  todayBadgeText: { fontFamily: FONTS.bold, fontSize: 9, color: COLORS.accent, letterSpacing: 1 },

  topRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  dayLabel:  { fontFamily: FONTS.bold, fontSize: 16, color: COLORS.textPrimary },
  dateLabel: { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  rainIcon:  { fontSize: 32 },

  metricsRow: { flexDirection: 'row', marginBottom: 12 },
  metric:     { flex: 1, alignItems: 'center', gap: 3 },
  metricBorder: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: COLORS.border },
  metricEmoji: { fontSize: 18 },
  metricVal:   { fontFamily: FONTS.bold, fontSize: 17, color: COLORS.textPrimary },
  metricLabel: { fontFamily: FONTS.regular, fontSize: 10, color: COLORS.textMuted },

  riskTag:  { borderRadius: RADIUS.sm, borderWidth: 1, paddingVertical: 4, paddingHorizontal: 10, alignSelf: 'flex-start' },
  riskText: { fontFamily: FONTS.semiBold, fontSize: 12 },
});


// ═══════════════════════════════════════════════════════════════════
//  WEATHER FORECAST SCREEN
// ═══════════════════════════════════════════════════════════════════
export default function WeatherForecastScreen({ navigation, route }) {
  const { forecastData, alert, diseaseName } = route.params;
  const days = forecastData ?? [];

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <View style={s.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={s.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={s.title}>5-Day Forecast</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={s.heroBadge}>
          <Text style={s.heroEmoji}>🌤️</Text>
          <Text style={s.heroTitle}>Microclimate Forecast</Text>
          <Text style={s.heroSub}>AI-powered disease risk over 5 days</Text>
          {diseaseName && <Text style={s.heroDisease}>Monitoring: {diseaseName}</Text>}
        </View>

        {/* Alert */}
        {alert && (
          <View style={[s.alertCard, alert.includes('🚨') && s.alertDanger, alert.includes('✅') && s.alertSafe]}>
            <Text style={[s.alertText, alert.includes('🚨') && { color: COLORS.danger }, alert.includes('✅') && { color: COLORS.success }]}>
              {alert}
            </Text>
          </View>
        )}

        {/* Day cards */}
        {days.length === 0 ? (
          <View style={s.emptyCard}>
            <Text style={s.emptyEmoji}>📡</Text>
            <Text style={s.emptyTitle}>No Forecast Available</Text>
            <Text style={s.emptyText}>
              Weather forecast data was not available for this analysis.
              Make sure your OPENWEATHER_API_KEY is set in the backend .env file.
            </Text>
          </View>
        ) : (
          days.map((day, i) => (
            <ForecastCard
              key={i}
              index={i}
              day={getDayLabel(day.date, i)}
              dateStr={day.date}
              temp={day.temp}
              humidity={day.humidity}
              rain={day.rain}
              diseaseName={diseaseName}
            />
          ))
        )}

        {/* Legend */}
        <View style={s.legendCard}>
          <Text style={s.legendTitle}>📖  Risk Level Guide</Text>
          <View style={s.legendRow}>
            <Text style={[s.legendDot, { color: COLORS.success }]}>●</Text>
            <Text style={s.legendText}>Low Risk — Safe to apply treatment, favorable conditions</Text>
          </View>
          <View style={s.legendRow}>
            <Text style={[s.legendDot, { color: COLORS.warning }]}>●</Text>
            <Text style={s.legendText}>Medium Risk — Monitor closely, moderate disease pressure</Text>
          </View>
          <View style={s.legendRow}>
            <Text style={[s.legendDot, { color: COLORS.danger }]}>●</Text>
            <Text style={s.legendText}>High Risk — Immediate action needed, disease may spread rapidly</Text>
          </View>
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
  heroDisease: { fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.accent, marginTop: 8,
                 paddingHorizontal: 16, paddingVertical: 5, backgroundColor: COLORS.accent + '18',
                 borderRadius: 20, borderWidth: 1, borderColor: COLORS.accent },

  alertCard: {
    marginHorizontal: SPACING.md, marginTop: SPACING.md,
    padding: SPACING.md, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border,
    backgroundColor: COLORS.bgCard,
  },
  alertDanger: { backgroundColor: COLORS.danger + '12', borderColor: COLORS.danger + '44' },
  alertSafe:   { backgroundColor: COLORS.success + '12', borderColor: COLORS.success + '44' },
  alertText:   { fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },

  emptyCard: {
    margin: SPACING.md, padding: SPACING.lg,
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border, alignItems: 'center',
  },
  emptyEmoji: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { fontFamily: FONTS.semiBold, fontSize: 16, color: COLORS.textPrimary, marginBottom: 8 },
  emptyText:  { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 19 },

  legendCard: {
    marginHorizontal: SPACING.md, marginTop: SPACING.lg,
    padding: SPACING.md, backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border,
  },
  legendTitle: { fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.accent, marginBottom: 10 },
  legendRow:   { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
  legendDot:   { fontSize: 16, marginTop: 1 },
  legendText:  { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textSecondary, lineHeight: 19, flex: 1 },
});
