# RN Video Player Card

A small React Native (Expo) component built for the DIRECTV take-home exercise — a mock "now playing"
card that displays program information, with an animated progress bar and a tap-to-expand layout.

## How to run

**Prerequisites**

- Node.js 20 or newer
- The **Expo Go** app on a phone (iOS or Android), or an emulator/simulator

**Steps**

1. Clone the repo and install dependencies:
   ```
   git clone https://github.com/JonathanStoll/rn-video-card-jonathan-stoll.git
   cd rn-video-card-jonathan-stoll
   npm install
   ```
2. (Optional) Make sure your Expo tooling is current:
   ```
   npx expo install expo
   ```
   This project targets **Expo SDK 54**, which the App Store / Play Store version of Expo Go supports, so
   it runs the same way on both Android and iOS — install Expo Go, scan the QR code, and you're set, with
   no platform-specific setup.
3. Start the development server:
   ```
   npx expo start
   ```
   Then scan the QR code with Expo Go (Android: from inside the Expo Go app; iOS: with the Camera app).
4. Run the checks:
   ```
   npm test          # unit tests (Jest)
   npm run lint      # ESLint
   npm run typecheck # TypeScript (tsc --noEmit)
   ```

## Approach

Rather than jumping straight into code, I started by turning the brief into a plan. I gave the exercise
description to an AI assistant and asked it to expand the requirements and break them down into a clear,
step-by-step action plan with a checklist of every deliverable. That gave me a sensible order to work in
and a way to make sure nothing the brief asked for slipped through.

From there, the idea is to build in small, verifiable increments — getting each piece working and checked
before moving on — with a CI pipeline in place from early on, so every commit is automatically linted,
type-checked, and tested.

The structure I'm building toward keeps logic separate from presentation: the playback calculations live
in a custom hook so they can be tested on their own, the card stays presentational and is driven entirely
by props, and the animations are handled with `react-native-reanimated`.

## Tradeoffs & decisions

**Expo SDK 54 instead of 56.** I first scaffolded the project on the latest SDK (56), but changed course
to SDK 54 once I realized 56 isn't yet available in the App Store version of Expo Go. On 56, the project
would have needed different run steps depending on the platform — a development build or the simulator on
iOS — whereas 54 runs identically on both Android and iOS through the standard Expo Go app. The only cost
is not being on the newest SDK, which makes no practical difference for an exercise this size.

**`react-native-reanimated` over the built-in Animated API.** I went with Reanimated for the animations
because it runs on the UI thread for smoother motion and is the more common choice in production apps. The
tradeoff is an extra dependency and a little Babel configuration; the built-in Animated API would avoid
that, but tends to be less smooth for this kind of animation.

## How I used AI

**What I prompted it to do.** I gave the AI the exercise brief and asked it to expand the requirements and
turn them into a detailed, step-by-step action plan with a checklist of every deliverable, so I could work
through the challenge in a sensible order without missing anything.

**I prompted it to write the `usePlaybackProgress` hook and its Jest tests.** The output was solid, but I
caught one thing worth fixing: it had wrapped the body in `useMemo`, which made no sense for a calculation
this small — two arithmetic operations don't need memoisation, and the overhead of the cache lookup would
have outweighed any benefit. I pointed that out and it agreed and removed it.

**I also prompted it to build the `VideoPlayerCard` component and both Reanimated animations** — the
progress bar filling on mount and the tap-to-expand layout. This time I didn't need to change anything.
The design and styling came out exactly how I would have wanted it, and the animation behaviour worked
correctly first time. I was pleased with the result and merged it as-is.
