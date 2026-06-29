import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { VideoPlayerCard } from './src/components/VideoPlayerCard';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.screen}>
        <View style={styles.content}>
          <VideoPlayerCard
            channelName="ESPN"
            programTitle="SportsCenter"
            programDescription="The latest scores, highlights, and analysis from across the world of sports, with live updates on every major game in progress tonight."
            durationMinutes={132}
            elapsedMinutes={49}
            channelColor="#CC0000"
            channelInitials="ESPN"
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    padding: 20,
  },
});
