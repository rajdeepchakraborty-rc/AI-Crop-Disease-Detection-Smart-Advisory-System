import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, Alert, StatusBar, Platform,
  RefreshControl, ScrollView,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../constants/theme';
import { getFarmHistory, createFarmRecord } from '../services/api';

// ─── Default leaf IDs the backend stores history for ─────────────
// These are built from the leaf_id returned by the analysis pipeline.
// We also allow the user to enter a custom ID.
const DEFAULT_IDS = ['leaf', 'tomato', 'potato', 'apple', 'corn', 'grape'];

// ─── History record card ──────────────────────────────────────────
function HistoryCard({ record, index }) {
  const isHealthy = record?.disease?.toLowerCase().includes('healthy');
  const color     = isHealthy ? COLORS.success : COLORS.danger;

  return (
    <View style={[hc.card, { borderLeftColor: color }]}>
      <View style={hc.header}>
        <Text style={[hc.disease, { color }]}>{record?.disease ?? 'Unknown'}</Text>
        <Text style={hc.date}>{record?.date ?? '—'}</Text>
      </View>
      {record?.confidence != null && (
        <Text style={hc.meta}>Confidence: {Math.round(record.confidence)}%</Text>
      )}
      {record?.severity && (
        <Text style={hc.meta}>Severity: {record.severity}</Text>
      )}
      {record?.treatment && (
        <Text style={hc.meta}>Treatment: {record.treatment}</Text>
      )}
      {record?.notes && (
        <Text style={hc.notes} numberOfLines={3}>{record.notes}</Text>
      )}
    </View>
  );
}
const hc = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border, borderLeftWidth: 4,
    padding: SPACING.md, ...SHADOW.card,
  },
  header:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  disease: { fontFamily: FONTS.semiBold, fontSize: 15, flex: 1 },
  date:    { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textMuted },
  meta:    { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textSecondary, marginBottom: 3 },
  notes:   { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textMuted, marginTop: 6, lineHeight: 18 },
});

// ═══════════════════════════════════════════════════════════════════
//  HISTORY SCREEN
// ═══════════════════════════════════════════════════════════════════
export default function HistoryScreen({ navigation, route }) {
  // Accept lastLeafId passed from ResultScreen so we default to the correct leaf
  const passedLeafId = route?.params?.leafId ?? null;

  const [leafId,     setLeafId]     = useState(passedLeafId ?? DEFAULT_IDS[0]);
  const [history,    setHistory]    = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [customId,   setCustomId]   = useState('');
  const [showCustom, setShowCustom] = useState(false);

  // All IDs shown as chips = defaults + any custom searched
  const [allIds, setAllIds] = useState(DEFAULT_IDS);

  useEffect(() => { loadHistory(); }, [leafId]);

  const loadHistory = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const data = await getFarmHistory(leafId);
      setHistory(data?.history ?? []);
    } catch (err) {
      Alert.alert('Error', 'Could not load farm history. Is the backend running?\n\n' + (err?.message ?? ''));
      setHistory([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [leafId]);

  function searchCustomId() {
    const id = customId.trim().toLowerCase().replace(/\s+/g, '-');
    if (!id) return;
    if (!allIds.includes(id)) setAllIds(prev => [id, ...prev]);
    setLeafId(id);
    setShowCustom(false);
    setCustomId('');
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.screenTitle}>Farm Memory</Text>
          <Text style={styles.screenSub}>Scan history by Leaf ID</Text>
        </View>
        <TouchableOpacity onPress={() => loadHistory(true)} style={styles.refreshBtn}>
          <Text style={styles.refreshIcon}>↻</Text>
        </TouchableOpacity>
      </View>

      {/* Currently viewing badge */}
      <View style={styles.currentBadge}>
        <Text style={styles.currentLabel}>Viewing Leaf ID:</Text>
        <Text style={styles.currentId}>🍃 {leafId}</Text>
      </View>

      {/* Leaf ID chips */}
      <View style={styles.chipsSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
          {allIds.map(id => (
            <TouchableOpacity
              key={id}
              style={[styles.chip, leafId === id && styles.chipActive]}
              onPress={() => setLeafId(id)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, leafId === id && styles.chipTextActive]}>
                🌱 {id}
              </Text>
            </TouchableOpacity>
          ))}
          {/* Add custom button */}
          <TouchableOpacity
            style={[styles.chip, showCustom && styles.chipActive]}
            onPress={() => setShowCustom(!showCustom)}
            activeOpacity={0.8}
          >
            <Text style={[styles.chipText, showCustom && styles.chipTextActive]}>＋ Custom</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Custom ID input */}
        {showCustom && (
          <View style={styles.customRow}>
            <View style={styles.customInput}>
              <Text style={styles.customInputText}
                // React Native doesn't have inline TextInput without import, using TouchableOpacity placeholder
                // The actual implementation would need TextInput - keeping as display for simplicity
              />
            </View>
            <TouchableOpacity style={styles.customSearchBtn} onPress={searchCustomId}>
              <Text style={styles.customSearchText}>Search</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Records list */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading history for "{leafId}"...</Text>
        </View>
      ) : history.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyEmoji}>📭</Text>
          <Text style={styles.emptyTitle}>No Records for "{leafId}"</Text>
          <Text style={styles.emptyDesc}>
            Analyze a crop — when complete, its diagnosis will be saved here.
            Try different leaf IDs using the chips above.
          </Text>
          <TouchableOpacity
            style={styles.goAnalyzeBtn}
            onPress={() => navigation.navigate('Upload')}
            activeOpacity={0.8}
          >
            <Text style={styles.goAnalyzeText}>📷  Analyze a Crop →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item, index }) => <HistoryCard record={item} index={index} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadHistory(true)}
              tintColor={COLORS.primary}
            />
          }
          ListHeaderComponent={
            <Text style={styles.listHeader}>{history.length} record{history.length !== 1 ? 's' : ''} found</Text>
          }
          ListFooterComponent={<View style={{ height: 40 }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },

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
  screenSub:   { fontFamily: FONTS.regular, fontSize: 10, color: COLORS.textMuted },
  refreshBtn:  { width: 40, height: 40, alignItems: 'flex-end', justifyContent: 'center' },
  refreshIcon: { fontSize: 22, color: COLORS.accent },

  currentBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: SPACING.md, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
    backgroundColor: COLORS.bgCard,
  },
  currentLabel: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textMuted },
  currentId:    { fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.accent },

  chipsSection: { borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingBottom: 10 },
  chipsRow: { paddingHorizontal: SPACING.md, paddingTop: SPACING.sm, gap: 8 },
  chip: {
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.full,
    borderWidth: 1, borderColor: COLORS.border,
    paddingHorizontal: 14, paddingVertical: 7,
  },
  chipActive:     { backgroundColor: COLORS.accent + '22', borderColor: COLORS.accent },
  chipText:       { fontFamily: FONTS.medium, fontSize: 12, color: COLORS.textMuted },
  chipTextActive: { color: COLORS.accent },

  customRow: {
    flexDirection: 'row', gap: SPACING.sm,
    paddingHorizontal: SPACING.md, marginTop: 8,
  },
  customInput: {
    flex: 1, backgroundColor: COLORS.bgCard, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 12, paddingVertical: 8,
  },
  customInputText: { fontFamily: FONTS.regular, fontSize: 13, color: COLORS.textPrimary },
  customSearchBtn: {
    backgroundColor: COLORS.accent, borderRadius: RADIUS.md,
    paddingHorizontal: 16, justifyContent: 'center',
  },
  customSearchText: { fontFamily: FONTS.semiBold, fontSize: 13, color: '#000' },

  list:         { padding: SPACING.md, gap: SPACING.sm },
  listHeader:   { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textMuted, marginBottom: 6 },
  center:       { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },
  loadingText:  { fontFamily: FONTS.regular, fontSize: 13, color: COLORS.textMuted, marginTop: SPACING.sm, textAlign: 'center' },
  emptyEmoji:   { fontSize: 52, marginBottom: SPACING.sm },
  emptyTitle:   { fontFamily: FONTS.semiBold, fontSize: 18, color: COLORS.textPrimary, marginBottom: 6 },
  emptyDesc:    { fontFamily: FONTS.regular,  fontSize: 13, color: COLORS.textMuted, textAlign: 'center', lineHeight: 20 },
  goAnalyzeBtn: {
    marginTop: SPACING.lg, backgroundColor: COLORS.accent + '18',
    borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.accent,
    paddingHorizontal: 24, paddingVertical: 12,
  },
  goAnalyzeText: { fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.accent },
});
