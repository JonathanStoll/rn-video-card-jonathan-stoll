import { useEffect, useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { usePlaybackProgress } from '../hooks/usePlaybackProgress';

/**
 * Props for {@link VideoPlayerCard}.
 */
export interface VideoPlayerCardProps {
  /** Channel name shown beside the logo, e.g. `"ESPN"`. */
  channelName: string;
  /** Title of the currently playing program. */
  programTitle: string;
  /** Program synopsis — rendered with a 2-line clamp when expanded. */
  description: string;
  /** Total program duration in minutes. */
  durationMinutes: number;
  /** How many minutes of the program have elapsed. */
  elapsedMinutes: number;
  /**
   * Background colour for the channel logo placeholder.
   * Any CSS-compatible colour string works, e.g. `"#E8000D"` or `"royalblue"`.
   */
  logoColor: string;
  /** 1–4 character string rendered inside the logo placeholder, e.g. `"ESPN"`. */
  logoInitials: string;
}

const FILL_MS = 900;
const EXPAND_MS = 300;
const ACCENT = '#0057FF';

/**
 * "Now playing" card with two Reanimated animations:
 * - Progress bar fills from 0 → its target value on mount.
 * - Tapping expands/collapses the description and time-remaining label.
 *
 * Collapsed state shows only the channel branding and progress bar.
 */
export function VideoPlayerCard({
  channelName,
  programTitle,
  description,
  durationMinutes,
  elapsedMinutes,
  logoColor,
  logoInitials,
}: VideoPlayerCardProps) {
  const { progressPercent, timeRemainingLabel } = usePlaybackProgress(
    durationMinutes,
    elapsedMinutes,
  );

  // ── Animation 1: progress bar fill ───────────────────────────────────────
  // fillWidth starts at 0 and animates to progressPercent on mount.
  const fillWidth = useSharedValue(0);

  useEffect(() => {
    fillWidth.value = withTiming(progressPercent, {
      duration: FILL_MS,
      easing: Easing.out(Easing.cubic),
    });
  }, [fillWidth, progressPercent]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${fillWidth.value}%`,
  }));

  // ── Animation 2: expand / collapse ───────────────────────────────────────
  // expandProgress is a 0→1 scalar. Multiplying by the measured inner height
  // gives the animated container height without needing to target different
  // pixel values on each toggle.
  const [isExpanded, setIsExpanded] = useState(false);
  const expandProgress = useSharedValue(0);
  const collapsibleHeight = useSharedValue(0);

  // Capture the natural height of the collapsible content on first layout so
  // the animated container knows its target height.
  const onCollapsibleLayout = (e: LayoutChangeEvent) => {
    collapsibleHeight.value = e.nativeEvent.layout.height;
  };

  const handlePress = () => {
    const next = !isExpanded;
    setIsExpanded(next);
    expandProgress.value = withTiming(next ? 1 : 0, {
      duration: EXPAND_MS,
      // Material Design standard easing: fast out of rest, slow into target.
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  };

  const collapsibleStyle = useAnimatedStyle(() => ({
    height: expandProgress.value * collapsibleHeight.value,
  }));

  return (
    <Pressable onPress={handlePress}>
      <View style={styles.card}>

        {/* ── Always visible: header + progress bar ── */}
        <View style={styles.header}>
          <View style={[styles.logo, { backgroundColor: logoColor }]}>
            <Text style={styles.logoInitials} numberOfLines={1}>
              {logoInitials}
            </Text>
          </View>

          <View style={styles.titleBlock}>
            <Text style={styles.channelName} numberOfLines={1}>
              {channelName}
            </Text>
            <Text style={styles.programTitle} numberOfLines={1}>
              {programTitle}
            </Text>
          </View>
        </View>

        <View style={styles.track}>
          <Animated.View style={[styles.fill, fillStyle]} />
        </View>

        {/* ── Collapsible: description + time remaining ── */}
        {/* overflow:hidden clips the inner content as height animates 0→full. */}
        <Animated.View style={[styles.collapsibleOuter, collapsibleStyle]}>
          {/* onLayout fires even while the outer is height:0 because React Native
              computes layout independently of overflow clipping. */}
          <View onLayout={onCollapsibleLayout} style={styles.collapsibleInner}>
            <Text style={styles.description} numberOfLines={2}>
              {description}
            </Text>
            <Text style={styles.timeRemaining}>{timeRemainingLabel}</Text>
          </View>
        </Animated.View>

      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // No `gap` on the card — spacing is managed per-child so the 0-height
  // collapsible view leaves no trailing gap when collapsed.
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },

  /* Header row */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  logo: {
    width: 52,
    height: 52,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  logoInitials: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  titleBlock: {
    flex: 1,
    gap: 2,
  },
  channelName: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  programTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },

  /* Progress bar */
  track: {
    height: 4,
    backgroundColor: '#3A3A3C',
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: ACCENT,
    borderRadius: 2,
  },

  /* Collapsible */
  collapsibleOuter: {
    overflow: 'hidden',
  },
  // paddingTop creates the gap between the bar and the text. It's included in
  // the measured height so the gap itself animates in rather than popping.
  collapsibleInner: {
    paddingTop: 12,
    gap: 8,
  },

  /* Description */
  description: {
    color: '#AEAEB2',
    fontSize: 13,
    lineHeight: 19,
  },

  /* Time remaining */
  timeRemaining: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '500',
  },
});
