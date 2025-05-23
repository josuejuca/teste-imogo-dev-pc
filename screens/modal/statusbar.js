import React from 'react';
import { View, StatusBar, StyleSheet, SafeAreaView, Platform } from 'react-native';

const CustomStatusBar = ({ backgroundColor, barStyle }) => (
  <SafeAreaView style={{ backgroundColor }}>
    <StatusBar barStyle={barStyle} />
    {Platform.OS === 'ios' && (
      <View style={[styles.statusBar, { backgroundColor }]} />
    )}
  </SafeAreaView>
);

const styles = StyleSheet.create({
  statusBar: {
    height: Platform.OS === 'ios' ? 20 : 0, // Altura da barra de status no iOS
  },
});

export default CustomStatusBar;
