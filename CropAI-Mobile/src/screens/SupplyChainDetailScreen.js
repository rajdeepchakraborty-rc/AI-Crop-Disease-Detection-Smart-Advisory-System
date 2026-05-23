import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Platform, Linking,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../constants/theme';

export default function SupplyChainDetailScreen({ navigation, route }) {
  const { shops, diseaseName, location } = route.params;

  function openMap(shop) {
    if (shop?.lat && shop?.lon) {
      const url = `https://maps.google.com/?q=${shop.lat},${shop.lon}`;
      Linking.openURL(url);
    }
  }

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <View style={s.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={s.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={s.title}>Nearest Suppliers</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={s.heroBadge}>
          <Text style={s.heroEmoji}>🗺️</Text>
          <Text style={s.heroTitle}>Agri-Suppliers Near You</Text>
          <Text style={s.heroSub}>Showing {shops?.length ?? 0} shops within 50 km</Text>
          {diseaseName && <Text style={s.heroDisease}>For: {diseaseName}</Text>}
        </View>

        {/* Empty state */}
        {(!shops || shops.length === 0) && (
          <View style={s.emptyCard}>
            <Text style={s.emptyEmoji}>🔍</Text>
            <Text style={s.emptyTitle}>No Suppliers Found</Text>
            <Text style={s.emptyText}>
              No agricultural suppliers were found within 50 km of your location via OpenStreetMap.
              Try searching manually on Google Maps for "fertilizer shop" or "agricultural store" near you.
            </Text>
            <TouchableOpacity
              style={s.mapBtn}
              onPress={() => Linking.openURL('https://maps.google.com/?q=fertilizer+shop+near+me')}
            >
              <Text style={s.mapBtnText}>🗺️  Search Google Maps</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Shops */}
        {shops?.map((shop, i) => (
          <TouchableOpacity key={i} style={s.shopCard} onPress={() => openMap(shop)} activeOpacity={0.75}>
            {/* Rank indicator */}
            <View style={s.shopRank}>
              <Text style={s.shopRankText}>{i + 1}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.shopName} numberOfLines={2}>{shop.name ?? 'Agri Store'}</Text>
              {shop.distance_km != null && (
                <Text style={s.shopDist}>📍 {shop.distance_km.toFixed(2)} km away</Text>
              )}
              {shop.stocks?.length > 0 && (
                <View style={s.stockRow}>
                  {shop.stocks.map((st, j) => (
                    <View key={j} style={s.stockTag}>
                      <Text style={s.stockText}>{st === 'organic' ? '🌿 Organic' : '🧪 Chemical'}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
            <View style={s.tapHint}>
              <Text style={s.tapHintText}>Open{'\n'}Maps</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* OpenStreetMap credit */}
        <View style={s.creditCard}>
          <Text style={s.creditText}>
            📡  Location data provided by OpenStreetMap via Nominatim API.
            Tap any shop to open it in Google Maps.
          </Text>
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
  heroDisease: { fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.accent, marginTop: 6 },

  emptyCard: {
    margin: SPACING.md, padding: SPACING.lg,
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center',
  },
  emptyEmoji: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { fontFamily: FONTS.semiBold, fontSize: 16, color: COLORS.textPrimary, marginBottom: 8 },
  emptyText:  { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 19, marginBottom: 16 },
  mapBtn:     { paddingHorizontal: 20, paddingVertical: 10, backgroundColor: COLORS.accent + '18', borderRadius: 20, borderWidth: 1, borderColor: COLORS.accent },
  mapBtnText: { fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.accent },

  shopCard: {
    marginHorizontal: SPACING.md, marginTop: SPACING.md,
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border,
    padding: SPACING.md, flexDirection: 'row', alignItems: 'center', gap: 12,
    ...SHADOW.card,
  },
  shopRank:     { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.accent + '18', alignItems: 'center', justifyContent: 'center' },
  shopRankText: { fontFamily: FONTS.bold, fontSize: 16, color: COLORS.accent },
  shopName:     { fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.textPrimary, marginBottom: 4 },
  shopDist:     { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textMuted, marginBottom: 6 },
  stockRow:     { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  stockTag:     { paddingHorizontal: 8, paddingVertical: 2, backgroundColor: COLORS.bgCardAlt, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border },
  stockText:    { fontFamily: FONTS.regular, fontSize: 10, color: COLORS.textSecondary },
  tapHint:      { padding: 8, backgroundColor: COLORS.accent + '18', borderRadius: RADIUS.sm, alignItems: 'center' },
  tapHintText:  { fontFamily: FONTS.semiBold, fontSize: 10, color: COLORS.accent, textAlign: 'center' },

  creditCard: {
    margin: SPACING.md, padding: SPACING.sm,
    backgroundColor: COLORS.bgCardAlt, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.border,
  },
  creditText: { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textMuted, textAlign: 'center', lineHeight: 17 },
});
