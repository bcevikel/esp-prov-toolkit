import { Text, StyleSheet, Animated } from 'react-native';

export type NotificationType = 'error' | 'info' | 'warning' | 'success';

interface NotificationBarProps {
  message: string;
  type: NotificationType;
  visible: boolean;
}

export function NotificationBar({ message, type, visible }: NotificationBarProps) {
  if (!visible) return null;

  const getBackgroundColor = () => {
    switch (type) {
      case 'error':
        return '#ff4444';
      case 'warning':
        return '#ffbb33';
      case 'info':
        return '#33b5e5';
      case 'success':
        return '#00C851';
      default:
        return '#33b5e5';
    }
  };

  return (
    <Animated.View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    margin: 8,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});
