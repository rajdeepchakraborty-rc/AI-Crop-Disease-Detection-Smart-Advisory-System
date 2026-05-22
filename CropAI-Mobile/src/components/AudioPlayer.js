import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../constants/theme';

const LANG_FLAGS = { english: '🇬🇧', hindi: '🇮🇳', bengali: '🇧🇩' };

export default function AudioPlayer({ url, language }) {
  const player = useAudioPlayer(url);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoop = useRef(null);

  useEffect(() => {
    if (player.playing) {
      pulseLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1.0,  duration: 500, useNativeDriver: true }),
        ])
      );
      pulseLoop.current.start();
    } else {
      pulseLoop.current?.stop();
      Animated.timing(pulseAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    }
  }, [player.playing]);

  function togglePlay() {
    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  }

  function replay() {
    player.seekTo(0);
    player.play();
  }

  // expo-audio uses seconds or ms depending on platform/settings, let's treat it generically
  // the hook provides player.currentTime and player.duration natively in seconds (or ms), we'll format as standard time
  const position = player.currentTime || 0;
  const duration = player.duration || 0;
  const pct = duration > 0 ? (position / duration) * 100 : 0;
  
  // Format as mm:ss assuming it's in seconds. If it's in ms, we divide by 1000. 
  // expo-audio actually uses seconds.
  const fmt = (val) => {
    // Determine if it's ms or sec dynamically just in case
    const sec = val > 1000 ? val / 1000 : val;
    const s = Math.floor(sec);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  };

  const flag = LANG_FLAGS[language?.toLowerCase()] ?? '🎙️';

  return (
    <View style={styles.card}>
      <Text style={styles.title}>🎙️  Voice Advisory</Text>
      <Text style={styles.lang}>{flag}  {language?.toUpperCase()} audio</Text>

      <View style={styles.controls}>
        {/* Play / Pause */}
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity style={styles.playBtn} onPress={togglePlay} activeOpacity={0.8}>
            <Text style={styles.playIcon}>{player.playing ? '⏸' : '▶'}</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Progress */}
        <View style={styles.progressWrap}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${pct}%` }]} />
          </View>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{fmt(position)}</Text>
            <Text style={styles.timeText}>{fmt(duration)}</Text>
          </View>
        </View>

        {/* Replay */}
        <TouchableOpacity onPress={replay} style={styles.replayBtn} activeOpacity={0.8}>
          <Text style={styles.replayIcon}>↺</Text>
        </TouchableOpacity>
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
  title: { fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.accent, marginBottom: 4 },
  lang:  { fontFamily: FONTS.regular,  fontSize: 12, color: COLORS.textMuted, marginBottom: SPACING.md },

  controls: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },

  playBtn: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
    ...SHADOW.glow,
  },
  playIcon: { fontSize: 20, color: '#000' },

  progressWrap: { flex: 1 },
  progressBar: {
    height: 5, backgroundColor: COLORS.bgCardAlt,
    borderRadius: 3, overflow: 'hidden', marginBottom: 6,
  },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 3 },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  timeText: { fontFamily: FONTS.regular, fontSize: 10, color: COLORS.textMuted },

  replayBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.bgCardAlt,
    borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  replayIcon: { fontSize: 18, color: COLORS.textSecondary },
});
