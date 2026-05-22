import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, Alert, StatusBar, Platform, RefreshControl,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../constants/theme';
import { getFarmHistory } from '../services/api';
import HistoryCard from '../components/HistoryCard';

const SAMPLE_IDS = ['tomato', 'potato', 'apple', 'corn', 'leaf'];

export default function HistoryScreen({ navigation }) {
  const [leafId,    setLeafId]    = useState('tomato');
  const [history,   setHistory]   = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [refreshing,setRefreshing]= useState(false);

  useEffect(() => { loadHistory(); }, [leafId]);

  async function loadHistory(isRefresh = false) {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    try {
      const data = await getFarmHistory(leafId);
      setHistory(data?.history ?? []);
    } catch (err) {
      Alert.alert('Error', 'Could not load farm history. Is the backend running?');
      setHistory([]);
    } finally {
      setLoading(false); setRefreshing(false);
    }
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Farm Memory</Text>
        <TouchableOpacity onPress={() => loadHistory()} style={styles.refreshBtn}>
          <Text style={styles.refreshIcon}>↻</Text>
        </TouchableOpacity>
      </View>

      {/* Leaf ID filter chips */}
      <View style={styles.chipScroll}>
        {SAMPLE_IDS.map(id => (
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
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading history...</Text>
        </View>
      ) : history.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyEmoji}>📭</Text>
          <Text style={styles.emptyTitle}>No Records Found</Text>
          <Text style={styles.emptyDesc}>
            Analyze a crop first and it will appear here.
          </Text>
          <TouchableOpacity style={styles.goAnalyzeBtn} onPress={() => navigation.navigate('Upload')} activeOpacity={0.8}>
            <Text style={styles.goAnalyzeText}>Go Analyze a Crop →</Text>
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
          ListFooterComponent={<View style={{ height: 40 }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: COLORS.bg },

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
  refreshBtn:  { width: 40, height: 40, alignItems: 'flex-end', justifyContent: 'center' },
  refreshIcon: { fontSize: 22, color: COLORS.accent },

  chipScroll: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, gap: 8,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  chip: {
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.full,
    borderWidth: 1, borderColor: COLORS.border,
    paddingHorizontal: 14, paddingVertical: 6,
  },
  chipActive:     { backgroundColor: COLORS.primaryGlow, borderColor: COLORS.borderBright },
  chipText:       { fontFamily: FONTS.medium, fontSize: 12, color: COLORS.textMuted },
  chipTextActive: { color: COLORS.accent },

  list:  { padding: SPACING.md, gap: SPACING.sm },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },

  loadingText: { fontFamily: FONTS.regular, fontSize: 13, color: COLORS.textMuted, marginTop: SPACING.sm },

  emptyEmoji: { fontSize: 52, marginBottom: SPACING.sm },
  emptyTitle: { fontFamily: FONTS.semiBold, fontSize: 18, color: COLORS.textPrimary, marginBottom: 6 },
  emptyDesc:  { fontFamily: FONTS.regular,  fontSize: 13, color: COLORS.textMuted, textAlign: 'center', lineHeight: 20 },
  goAnalyzeBtn: {
    marginTop: SPACING.lg, backgroundColor: COLORS.primaryGlow,
    borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.borderBright,
    paddingHorizontal: 24, paddingVertical: 12,
  },
  goAnalyzeText: { fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.accent },
});
