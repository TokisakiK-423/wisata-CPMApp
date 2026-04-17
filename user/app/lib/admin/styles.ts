import { StyleSheet } from 'react-native';
import { COLORS } from './colors';

export const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  tabBar: {
    backgroundColor: COLORS.white,
    borderTopWidth: 0,
    height: 65,
    paddingBottom: 8,
  },

  headerRight: {
    marginRight: 16,
  },
});
