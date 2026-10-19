import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { createWallet } from '../services/wallet';

export default function WalletScreen() {
  const [address, setAddress] = useState<string | null>(null);

  const handleCreateWallet = async () => {
    try {
      const res = await createWallet();
      setAddress(res.address);
    } catch (err) {
      Alert.alert('Error', 'Gagal membuat wallet');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Walla Wallet</Text>
      {address ? (
        <View style={styles.card}>
          <Text style={styles.label}>Address Anda:</Text>
          <Text style={styles.addressText}>{address}</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleCreateWallet}>
          <Text style={styles.buttonText}>Buat Wallet Baru</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B132B',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#1C2541',
    padding: 16,
    borderRadius: 8,
    width: '100%',
  },
  label: {
    color: '#3A506B',
    fontSize: 12,
    marginBottom: 4,
  },
  addressText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: '#3A506B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});