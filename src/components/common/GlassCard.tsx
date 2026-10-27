import { BlurView } from 'expo-blur';
import {
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, radius } from '../../theme';

type GlassCardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function GlassCard({
  children,
  style,
}: GlassCardProps) {
  return (
    <BlurView
      intensity={35}
      tint="dark"
      style={[
        styles.container,
        style,
      ]}
    >
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: 'rgba(28, 37, 65, 0.55)',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
  },
});
