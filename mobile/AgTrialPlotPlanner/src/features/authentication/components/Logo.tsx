import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Logo = ({ size = 100 }) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={styles.iconContainer}>
        <Ionicons name="leaf" size={size * 0.5} color="#FFFFFF" />
      </View>
      <View style={styles.gridContainer}>
        <View style={styles.gridRow}>
          <View style={[styles.gridCell, styles.gridCell1]} />
          <View style={[styles.gridCell, styles.gridCell2]} />
        </View>
        <View style={styles.gridRow}>
          <View style={[styles.gridCell, styles.gridCell3]} />
          <View style={[styles.gridCell, styles.gridCell4]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  iconContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  gridContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'column',
    opacity: 0.3,
  },
  gridRow: {
    flex: 1,
    flexDirection: 'row',
  },
  gridCell: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  gridCell1: {
    backgroundColor: '#8BC34A',
  },
  gridCell2: {
    backgroundColor: '#689F38',
  },
  gridCell3: {
    backgroundColor: '#558B2F',
  },
  gridCell4: {
    backgroundColor: '#33691E',
  },
});

export default Logo;