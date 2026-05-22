import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, Dimensions,
} from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const pulse      = useRef(new Animated.Value(0.8)).current;
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;
  const ring1      = useRef(new Animated.Value(0)).current;
  const ring2      = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in title
    Animated.parallel([
      Animated.timing(opacity,    { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();

    // Pulse logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.93, duration: 900, useNativeDriver: true }),
      ])
    ).start();

    // Ripple rings
    const ripple = (ref, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(ref, { toValue: 1, duration: 1800, useNativeDriver: true }),
          Animated.timing(ref, { toValue: 0, duration: 0,    useNativeDriver: true }),
        ])
      ).start();
    ripple(ring1, 0);
    ripple(ring2, 900);

    // Navigate to Home after 2.8s
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  const ringStyle = (ref) => ({
    position: 'absolute',
    width:  120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: COLORS.primary,
    opacity: ref.interpolate({ inputRange: [0,1], outputRange: [0.6, 0] }),
    transform: [{ scale: ref.interpolate({ inputRange: [0,1], outputRange: [1, 2.5] }) }],
  });

  return (
    <View style={styles.container}>
      {/* Background glow */}
      <View style={styles.bgGlow} />

      {/* Ripple rings */}
      <Animated.View style={ringStyle(ring1)} />
      <Animated.View style={ringStyle(ring2)} />

      {/* Leaf icon */}
      <Animated.View style={[styles.logoWrap, { transform: [{ scale: pulse }] }]}>
        <Text style={styles.leafEmoji}>🌿</Text>
      </Animated.View>

      {/* Title */}
      <Animated.View style={{ opacity, transform: [{ translateY }] }}>
        <Text style={styles.title}>CropAI</Text>
        <Text style={styles.subtitle}>Intelligent Disease Detection</Text>
        <View style={styles.badgeRow}>
          <View style={styles.badge}><Text style={styles.badgeText}>14 AI Agents</Text></View>
          <View style={styles.badge}><Text style={styles.badgeText}>Real-time</Text></View>
          <View style={styles.badge}><Text style={styles.badgeText}>Multilingual</Text></View>
        </View>
      </Animated.View>

      <Text style={styles.poweredBy}>Powered by MobileNetV2 + Groq Llama 3</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgGlow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: COLORS.primaryGlow,
    top: height * 0.25,
    alignSelf: 'center',
  },
  logoWrap: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: COLORS.bgCard,
    borderWidth: 2,
    borderColor: COLORS.borderBright,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  leafEmoji: {
    fontSize: 52,
  },
  title: {
    fontFamily: FONTS.extraBold,
    fontSize: 42,
    color: COLORS.accent,
    textAlign: 'center',
    letterSpacing: 2,
  },
  subtitle: {
    fontFamily: FONTS.medium,
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    letterSpacing: 0.5,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: SPACING.md,
  },
  badge: {
    backgroundColor: COLORS.accentSoft,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    color: COLORS.accent,
  },
  poweredBy: {
    position: 'absolute',
    bottom: 36,
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.textMuted,
    letterSpacing: 0.3,
  },
});
