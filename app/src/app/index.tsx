import { useState } from 'react';
import {
  View, Text, TextInput, Pressable, ScrollView,
  ActivityIndicator, Switch, StyleSheet,
} from 'react-native';
import RiskResult from '../components/RiskResult';
import { scoreMessage, scorePayee, scoreTransaction } from '../api';
import { ScoreResult } from '../types';

type Mode = 'message' | 'payee' | 'transaction';

export default function Home() {
  const [mode, setMode] = useState<Mode>('message');
  const [text, setText] = useState('');
  const [upi, setUpi] = useState('');
  const [name, setName] = useState('');
  const [requestType, setRequestType] = useState<'pay' | 'collect'>('pay');
  const [amount, setAmount] = useState('');
  const [newPayee, setNewPayee] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScoreResult | null>(null);

  function switchMode(m: Mode) {
    setMode(m);
    setResult(null);
    setError(null);
  }

  async function onCheck() {
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      let r: ScoreResult;
      if (mode === 'message') {
        if (!text.trim()) throw new Error('Paste a message first');
        r = await scoreMessage(text.trim());
      } else if (mode === 'payee') {
        if (!upi.trim()) throw new Error('Enter a UPI ID');
        r = await scorePayee(upi.trim(), name.trim(), requestType);
      } else {
        const n = Number(amount);
        if (!n || n <= 0) throw new Error('Enter a valid amount');
        r = await scoreTransaction(n, new Date().getHours(), newPayee, upi.trim());
      }
      setResult(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Scam Shield</Text>
      <Text style={styles.subtitle}>Check before you pay</Text>

      <View style={styles.tabs}>
        {(['message', 'payee', 'transaction'] as Mode[]).map((m) => (
          <Pressable
            key={m}
            onPress={() => switchMode(m)}
            style={[styles.tab, mode === m && styles.tabActive]}
          >
            <Text style={[styles.tabText, mode === m && styles.tabTextActive]}>
              {m[0].toUpperCase() + m.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      {mode === 'message' && (
        <TextInput
          style={[styles.input, { height: 130, textAlignVertical: 'top' }]}
          placeholder="Paste the SMS, WhatsApp message or link here"
          multiline
          value={text}
          onChangeText={setText}
        />
      )}

      {mode === 'payee' && (
        <>
          <TextInput style={styles.input} placeholder="UPI ID (name@bank)"
            autoCapitalize="none" value={upi} onChangeText={setUpi} />
          <TextInput style={styles.input} placeholder="Payee name (optional)"
            value={name} onChangeText={setName} />
          <View style={styles.row}>
            {(['pay', 'collect'] as const).map((t) => (
              <Pressable key={t} onPress={() => setRequestType(t)}
                style={[styles.chip, requestType === t && styles.chipActive]}>
                <Text style={requestType === t ? styles.chipTextActive : styles.chipText}>
                  {t === 'pay' ? 'I am paying' : 'Collect request'}
                </Text>
              </Pressable>
            ))}
          </View>
        </>
      )}

      {mode === 'transaction' && (
        <>
          <TextInput style={styles.input} placeholder="Amount in rupees"
            keyboardType="numeric" value={amount} onChangeText={setAmount} />
          <TextInput style={styles.input} placeholder="Payee UPI ID"
            autoCapitalize="none" value={upi} onChangeText={setUpi} />
          <View style={styles.row}>
            <Text style={styles.switchLabel}>New payee (never paid before)</Text>
            <Switch value={newPayee} onValueChange={setNewPayee} />
          </View>
        </>
      )}

      <Pressable style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={onCheck} disabled={loading}>
        <Text style={styles.buttonText}>Check risk</Text>
      </Pressable>

      {loading && <ActivityIndicator style={{ marginTop: 20 }} size="large" />}
      {error && <Text style={styles.error}>{error}</Text>}
      {result && <RiskResult result={result} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 60, backgroundColor: '#f4f6f8', flexGrow: 1 },
  title: { fontSize: 30, fontWeight: '800', color: '#1f3a5f' },
  subtitle: { fontSize: 15, color: '#666', marginBottom: 20 },
  tabs: { flexDirection: 'row', backgroundColor: '#e6e8eb', borderRadius: 12, padding: 4, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  tabActive: { backgroundColor: '#fff' },
  tabText: { color: '#666', fontWeight: '600' },
  tabTextActive: { color: '#1f3a5f' },
  input: { backgroundColor: '#fff', borderRadius: 12, padding: 14, fontSize: 16, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, gap: 8 },
  chip: { flex: 1, padding: 12, borderRadius: 10, backgroundColor: '#e6e8eb', alignItems: 'center' },
  chipActive: { backgroundColor: '#1f3a5f' },
  chipText: { color: '#333' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  switchLabel: { fontSize: 15, flex: 1 },
  button: { backgroundColor: '#1f3a5f', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 4 },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  error: { color: '#d93025', marginTop: 16, fontSize: 15 },
});