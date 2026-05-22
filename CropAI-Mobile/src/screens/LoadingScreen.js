import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Animated, StatusBar, Alert,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import { analyzeCrop } from '../services/api';

const AGENTS = [
  { emoji: '🖼️', name: 'Image Processing Agent',      desc: 'Normalizing & resizing crop image' },
  { emoji: '🔬', name: 'Disease Detection Agent',     desc: 'Running MobileNetV2 inference (38 classes)' },
  { emoji: '📊', name: 'Severity Analysis Agent',     desc: 'Calculating damage ratio & bounding box' },
  { emoji: '🧠', name: 'XAI Explainability Agent',   desc: 'Generating Grad-CAM heatmap' },
  { emoji: '🌿', name: 'Leaf Signature Agent',        desc: 'Extracting unique leaf embeddings' },
  { emoji: '📋', name: 'Farm Memory Agent',           desc: 'Retrieving historical health records' },
  { emoji: '🌤️', name: 'Weather Intelligence Agent', desc: 'Fetching hyper-local climate data' },
  { emoji: '📡', name: 'Microclimate Forecast Agent',desc: 'Analyzing 5-day weather forecast' },
  { emoji: '🗺️', name: 'Supply Chain Agent',          desc: 'Finding nearest suppliers (50km)' },
  { emoji: '🤖', name: 'Advisory LLM Agent',          desc: 'Groq Llama 3 generating treatment plan' },
  { emoji: '💭', name: 'What-If Simulation Agent',   desc: 'Predicting alternative scenarios' },
  { emoji: '🎙️', name: 'Voice Generator Agent',      desc: 'Synthesizing multilingual audio advisory' },
  { emoji: '📄', name: 'Report Generator Agent',     desc: 'Compiling diagnostic report' },
  { emoji: '📦', name: 'Response Builder Agent',     desc: 'Packaging all results for display' },
];

export default function LoadingScreen({ navigation, route }) {
  const { params } = route.params;
  const [currentAgent, setCurrentAgent]   = useState(0);
  const [done,         setDone]           = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const spinAnim     = useRef(new Animated.Value(0)).current;
  const fadeAnim     = useRef(new Animated.Value(1)).current;

  // Spinning animation
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, { toValue: 1, duration: 1200, useNativeDriver: true })
    ).start();
  }, []);

  // Advance agent indicator every ~1.2s (just for UI — actual call is async)
  useEffect(() => {
    if (done) return;
    const interval = setInterval(() => {
      setCurrentAgent(prev => {
        const next = prev + 1;
        if (next >= AGENTS.length) { clearInterval(interval); return prev; }
        return next;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [done]);

  // Sync progress bar with currentAgent
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentAgent + 1) / AGENTS.length,
      duration: 600, useNativeDriver: false,
    }).start();
  }, [currentAgent]);

  // Run actual API call
  useEffect(() => {
    (async () => {
      try {
        const result = await analyzeCrop(params);
        setDone(true);
        navigation.replace('Result', { result });
      } catch (err) {
        Alert.alert(
          'Analysis Failed',
          err?.response?.data?.detail || err.message || 'Backend unreachable. Is the server running?',
          [{ text: 'Go Back', onPress: () => navigation.goBack() }]
        );
      }
    })();
  }, []);

  const spin = spinAnim.interpolate({ inputRange: [0,1], outputRange: ['0deg','360deg'] });
  const progressWidth = progressAnim.interpolate({ inputRange:[0,1], outputRange:['0%','100%'] });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <View style={styles.bgGlow} />

      {/* Spinner */}
      <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]}>
        <Text style={styles.spinnerEmoji}>🌿</Text>
      </Animated.View>

      <Text style={styles.title}>AI Pipeline Running</Text>
      <Text style={styles.subtitle}>14 specialized agents are processing your crop</Text>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
      </View>
      <Text style={styles.progressText}>{currentAgent + 1} / {AGENTS.length} agents</Text>

      {/* Current agent */}
      <View style={styles.agentCard}>
        <Text style={styles.agentEmoji}>{AGENTS[currentAgent]?.emoji}</Text>
        <View style={styles.agentInfo}>
          <Text style={styles.agentName}>{AGENTS[currentAgent]?.name}</Text>
          <Text style={styles.agentDesc}>{AGENTS[currentAgent]?.desc}</Text>
        </View>
        <View style={styles.activeDot} />
      </View>

      {/* Agent list (last 4 completed) */}
      <View style={styles.agentList}>
        {AGENTS.slice(Math.max(0, currentAgent - 3), currentAgent).map((a, i) => (
          <View key={i} style={styles.doneAgent}>
            <Text style={styles.checkEmoji}>✅</Text>
            <Text style={styles.doneAgentName}>{a.name}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.hint}>Please wait — this may take 30–60 seconds</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1, backgroundColor: COLORS.bg,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  bgGlow: {
    position: 'absolute', width: 300, height: 300, borderRadius: 150,
    backgroundColor: COLORS.primaryGlow, opacity: 0.5,
  },

  spinner: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: COLORS.bgCard,
    borderWidth: 2.5, borderColor: COLORS.borderBright,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  spinnerEmoji: { fontSize: 38 },

  title:    { fontFamily: FONTS.bold,    fontSize: 22, color: COLORS.textPrimary, textAlign: 'center' },
  subtitle: { fontFamily: FONTS.regular, fontSize: 13, color: COLORS.textMuted,   textAlign: 'center', marginTop: 6, marginBottom: SPACING.lg },

  progressBar: {
    width: '100%', height: 6, backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.full, overflow: 'hidden', marginBottom: 8,
  },
  progressFill: {
    height: '100%', backgroundColor: COLORS.primary, borderRadius: RADIUS.full,
  },
  progressText: { fontFamily: FONTS.medium, fontSize: 12, color: COLORS.textSecondary, marginBottom: SPACING.lg },

  agentCard: {
    width: '100%', flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.borderBright,
    padding: SPACING.md, gap: SPACING.sm, marginBottom: SPACING.sm,
  },
  agentEmoji: { fontSize: 24 },
  agentInfo:  { flex: 1 },
  agentName:  { fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.accent },
  agentDesc:  { fontFamily: FONTS.regular,  fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  activeDot:  { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary },

  agentList: { width: '100%', gap: 6, marginBottom: SPACING.lg },
  doneAgent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkEmoji:    { fontSize: 14 },
  doneAgentName: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textMuted },

  hint: { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textMuted, textAlign: 'center', position: 'absolute', bottom: 36 },
});
