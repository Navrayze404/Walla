import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import WalletScreen from './src/screens/WalletScreen';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <WalletScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B132B',
  },
});