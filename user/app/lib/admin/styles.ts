import { StyleSheet } from 'react-native';
import { COLORS } from './colors';

export const styles = StyleSheet.create({
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
