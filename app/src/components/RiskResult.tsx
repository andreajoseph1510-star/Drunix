import { View, Text, StyleSheet } from 'react-native';
import { ScoreResult } from '../types';

const COLORS = { low: '#2e9e5b', medium: '#e0a100', high: '#d93025' };

export default function RiskResult({ result }: { result: ScoreResult }) {
  const color = COLORS[result.level];
  return (
    <View style={styles.card}>
      <Text style={[styles.level, { color }]}>{result.level.toUpperCase()} RISK</Text>
      <Text style={styles.score}>{result.risk_score}/100</Text>
      <View style={styles.track}>
        <View
          style={[styles.fill, { width: `${result.risk_score}%`, backgroundColor: color }]}
        />
      </View>
      <Text style={styles.heading}>Why this result</Text>
      {result.reasons.map((r) => (
        <Text key={r.code} style={styles.reason}>
          • {r.text}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginTop: 20, elevation: 2 },
  level: { fontSize: 20, fontWeight: '700' },
  score: { fontSize: 36, fontWeight: '800', marginVertical: 6 },
  track: { height: 12, backgroundColor: '#e6e8eb', borderRadius: 6, overflow: 'hidden' },
  fill: { height: 12, borderRadius: 6 },
  heading: { marginTop: 16, fontWeight: '700', fontSize: 15 },
  reason: { marginTop: 6, fontSize: 15, lineHeight: 21 },
});