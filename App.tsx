import { useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { WalletScreen } from './src/screens/WalletScreen';
import { SendScreen } from './src/screens/SendScreen';
import { SendReviewScreen } from './src/screens/SendReviewScreen';
import { ManageWalletScreen } from './src/screens/ManageWalletScreen';
import { ImportWalletScreen } from './src/screens/ImportWalletScreen';
import { CreateWalletScreen } from './src/screens/CreateWalletScreen';
import { TokenManagementScreen } from './src/screens/TokenManagementScreen';
import { EditWalletIconScreen } from './src/screens/EditWalletIconScreen';
import { ManageAccountScreen } from './src/screens/ManageAccountScreen';
import { ChatScreen } from './src/screens/ChatScreen';
import { CallScreen } from './src/screens/CallScreen';
import { StatusScreen } from './src/screens/StatusScreen';

import { WalletBottomNav } from './src/components/wallet';

import type { TokenBalance } from './src/types/token';

import {
  updateWalletIcon,
  getStoredWallets,
} from './src/services/wallet';

type Screen =
  | 'wallet'
  | 'chat'
  | 'activity'
  | 'calls'
  | 'send'
  | 'send-review'
  | 'manage-wallet'
  | 'manage-account'
  | 'import'
  | 'create'
  | 'tokens'
  | 'edit-wallet-icon';

export default function App() {
  const [screen, setScreen] =
    useState<Screen>('wallet');

  const [tokens, setTokens] =
    useState<TokenBalance[]>([]);

  const [sendRecipient, setSendRecipient] =
    useState('');

  const [sendTokenSymbol, setSendTokenSymbol] =
    useState('');

  const [sendAmount, setSendAmount] =
    useState('');

  const [sendNetwork, setSendNetwork] =
    useState('');

  const [managingWalletId, setManagingWalletId] =
    useState<string | null>(null);

  const [managingWalletName, setManagingWalletName] =
    useState('');

  const [walletIcon, setWalletIcon] = useState<
    | 'wallet'
    | 'user'
    | 'shield'
    | 'gem'
    | 'star'
    | 'heart'
    | 'hexagon'
    | 'photo'
  >('wallet');

  const [editingWalletId, setEditingWalletId] =
    useState<string | null>(null);

  const pageTranslateX = useState(
    new Animated.Value(0),
  )[0];

  const navigateTo = (
    nextScreen: Screen,
    direction: 'left' | 'right' = 'left',
  ) => {
    if (nextScreen === screen) return;

    const exitX =
      direction === 'left'
        ? -360
        : 360;

    const enterX =
      direction === 'left'
        ? 360
        : -360;

    Animated.timing(pageTranslateX, {
      toValue: exitX,
      duration: 220,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setScreen(nextScreen);

      pageTranslateX.setValue(enterX);

      Animated.timing(pageTranslateX, {
        toValue: 0,
        duration: 220,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    });
  };

  const handleWalletNameChanged = (
    name: string,
  ) => {
    setManagingWalletName(name);
  };

  const handleManageAccount = async (
    walletId: string,
    walletName: string,
  ) => {
    try {
      const wallets = await getStoredWallets();

      const wallet = wallets.find(
        (item) => item.id === walletId,
      );

      setManagingWalletId(walletId);
      setManagingWalletName(walletName);
      setWalletIcon(wallet?.icon ?? 'wallet');

      navigateTo('manage-account');
    } catch (error) {
      console.error(
        'Failed to load wallet icon:',
        error,
      );
    }
  };

  const handleWalletCreated = () => {
    setTokens([]);
    navigateTo('wallet', 'right');
  };

  const handleWalletImported = () => {
    setTokens([]);
    navigateTo('wallet', 'right');
  };

  const handleSaveWalletIcon = async (
    icon:
      | 'wallet'
      | 'user'
      | 'shield'
      | 'gem'
      | 'star'
      | 'heart'
      | 'hexagon'
      | 'photo',
  ) => {
    if (!editingWalletId) return;

    try {
      await updateWalletIcon(
        editingWalletId,
        icon,
      );

      setWalletIcon(icon);
      setEditingWalletId(null);

      navigateTo(
        'manage-account',
        'right',
      );
    } catch (error) {
      console.error(
        'Failed to update wallet icon:',
        error,
      );
    }
  };

  const handleOpenSend = () => {
    setSendRecipient('');
    setSendTokenSymbol('');
    setSendAmount('');
    setSendNetwork('');

    navigateTo('send');
  };

  const handleOpenSendReview = ({
    recipient,
    tokenSymbol,
    amount,
    network,
  }: {
    recipient: string;
    tokenSymbol: string;
    amount: string;
    network: string;
  }) => {
    setSendRecipient(recipient);
    setSendTokenSymbol(tokenSymbol);
    setSendAmount(amount);
    setSendNetwork(network);

    navigateTo('send-review');
  };

  const showBottomNav =
    screen === 'wallet' ||
    screen === 'chat' ||
    screen === 'activity' ||
    screen === 'calls';

  const activeTab =
    screen === 'wallet'
      ? 'home'
      : screen === 'chat'
        ? 'chat'
        : screen === 'activity'
          ? 'activity'
          : 'calls';

  return (
    <Animated.View style={styles.container}>
      <StatusBar style="light" />

      <Animated.View
        style={[
          styles.page,
          {
            transform: [
              {
                translateX: pageTranslateX,
              },
            ],
          },
        ]}
      >
        {screen === 'wallet' ? (
          <WalletScreen
            tokens={tokens}
            onTokensChange={setTokens}
            onImportWallet={() =>
              navigateTo('manage-wallet')
            }
            onManageTokens={() =>
              navigateTo('tokens')
            }
            onSend={handleOpenSend}
            onChatPress={() =>
              navigateTo('chat', 'left')
            }
            onActivityPress={() =>
              navigateTo(
                'activity',
                'left',
              )
            }
            onCallsPress={() =>
              navigateTo(
                'calls',
                'left',
              )
            }
          />
        ) : screen === 'chat' ? (
          <ChatScreen
            onBackToWallet={() =>
              navigateTo(
                'wallet',
                'right',
              )
            }
          />
        ) : screen === 'activity' ? (
          <StatusScreen
            onCreateStatus={() => {}}
            onOpenStatus={() => {}}
            onBack={() =>
              navigateTo(
                'wallet',
                'right',
              )
            }
          />
        ) : screen === 'calls' ? (
          <CallScreen
            onBackToWallet={() =>
              navigateTo(
                'wallet',
                'right',
              )
            }
          />
        ) : screen === 'send' ? (
          <SendScreen
            tokens={tokens}
            onBack={() =>
              navigateTo(
                'wallet',
                'right',
              )
            }
            onContinue={
              handleOpenSendReview
            }
          />
        ) : screen === 'send-review' ? (
          <SendReviewScreen
            recipient={sendRecipient}
            tokenSymbol={sendTokenSymbol}
            amount={sendAmount}
            network={sendNetwork}
            onBack={() =>
              navigateTo(
                'send',
                'right',
              )
            }
            onConfirm={() => {
              // Transaksi on-chain akan disambungkan
              // pada tahap berikutnya.
            }}
          />
        ) : screen === 'manage-wallet' ? (
          <ManageWalletScreen
            onClose={() =>
              navigateTo(
                'wallet',
                'right',
              )
            }
            onAddWallet={() =>
              navigateTo('import')
            }
            onCreateWallet={() =>
              navigateTo('create')
            }
            onManageAccount={
              handleManageAccount
            }
          />
        ) : screen === 'manage-account' ? (
          <ManageAccountScreen
            walletId={managingWalletId!}
            walletName={managingWalletName}
            walletIcon={walletIcon}
            onBack={() => {
              setManagingWalletId(null);
              setManagingWalletName('');

              navigateTo(
                'manage-wallet',
                'right',
              );
            }}
            onEditIcon={() => {
              if (!managingWalletId) return;

              setEditingWalletId(
                managingWalletId,
              );

              navigateTo(
                'edit-wallet-icon',
              );
            }}
            onNameChanged={
              handleWalletNameChanged
            }
          />
        ) : screen === 'import' ? (
          <ImportWalletScreen
            onImported={
              handleWalletImported
            }
            onBack={() =>
              navigateTo(
                'manage-wallet',
                'right',
              )
            }
          />
        ) : screen === 'create' ? (
          <CreateWalletScreen
            onCreated={
              handleWalletCreated
            }
            onBack={() =>
              navigateTo(
                'manage-wallet',
                'right',
              )
            }
          />
        ) : screen === 'tokens' ? (
          <TokenManagementScreen
            tokens={tokens}
            onBack={() =>
              navigateTo(
                'wallet',
                'right',
              )
            }
            onVisibilityChange={
              setTokens
            }
          />
        ) : (
          <EditWalletIconScreen
            onBack={() => {
              setEditingWalletId(null);

              navigateTo(
                'manage-account',
                'right',
              );
            }}
            onSave={
              handleSaveWalletIcon
            }
            onUploadPhoto={() => {}}
          />
        )}
      </Animated.View>

      {showBottomNav && (
        <WalletBottomNav
          activeTab={activeTab}
          onHomePress={() =>
            navigateTo(
              'wallet',
              'right',
            )
          }
          onChatPress={() =>
            navigateTo(
              'chat',
              'left',
            )
          }
          onActivityPress={() =>
            navigateTo(
              'activity',
              'left',
            )
          }
          onCallsPress={() =>
            navigateTo(
              'calls',
              'left',
            )
          }
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    overflow: 'hidden',
  },

  page: {
    flex: 1,
    backgroundColor: '#000000',
  },
});