import { StatusBar } from 'expo-status-bar';
import { WalletScreen } from './src/screens/WalletScreen';

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <WalletScreen />
    </>
  );
}