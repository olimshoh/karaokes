const { createApp, ref, computed, onMounted, watch, nextTick } = Vue;

createApp({
  setup() {
    // Audio state
    const audio = ref(null);
    const isPlaying = ref(false);
    const isMuted = ref(false);
    const volume = ref(0.7);
    const playbackRate = ref(1.0);
    const currentTime = ref(0);
    const duration = ref(0);
    const progress = computed(
      () => (currentTime.value / duration.value) * 100 || 0
    );

    // Lyrics state
    const lyrics = ref([
      // Verse 1
      {
        time: 10,
        words: ["They", "say,", "you", "know", "when", "you", "know"],
        activeWords: [],
      },
      {
        time: 16,
        words: [
          "So",
          "let's",
          "face",
          "it,",
          "you",
          "had",
          "me",
          "at",
          "hello",
        ],
        activeWords: [],
      },
      { time: 25, words: ["Hesitation", "never", "helps"], activeWords: [] },
      {
        time: 29,
        words: ["How", "could", "this", "be", "anything,", "anything", "else?"],
        activeWords: [],
      },

      // Chorus 1
      {
        time: 33,
        words: ["When", "all", "I", "dream", "of", "is", "your", "eyes"],
        activeWords: [],
      },
      {
        time: 38,
        words: ["All", "I", "long", "for", "is", "your", "touch"],
        activeWords: [],
      },
      {
        time: 41,
        words: [
          "And,",
          "darling,",
          "something",
          "tells",
          "me",
          "that's",
          "enough,",
          "mmm",
        ],
        activeWords: [],
      },
      {
        time: 49,
        words: ["You", "can", "say", "that", "I'm", "a", "fool"],
        activeWords: [],
      },
      {
        time: 52,
        words: ["And", "I", "don't", "know", "very", "much"],
        activeWords: [],
      },
      {
        time: 55,
        words: ["But", "I", "think", "they", "call", "this", "love"],
        activeWords: [],
      },

      // Verse 2
      {
        time: 65,
        words: [
          "One",
          "smile,",
          "one",
          "kiss,",
          "two",
          "lonely",
          "hearts",
          "is",
          "all",
          "that",
          "it",
          "takes",
        ],
        activeWords: [],
      },
      {
        time: 72,
        words: [
          "Now,",
          "baby,",
          "you're",
          "on",
          "my",
          "mind",
          "every",
          "night,",
          "every",
          "day",
        ],
        activeWords: [],
      },
      {
        time: 80,
        words: ["Good", "vibrations", "getting", "loud"],
        activeWords: [],
      },
      {
        time: 85,
        words: ["How", "could", "this", "be", "anything,", "anything", "else?"],
        activeWords: [],
      },

      // Chorus 2
      {
        time: 88,
        words: ["When", "all", "I", "dream", "of", "is", "your", "eyes"],
        activeWords: [],
      },
      {
        time: 93,
        words: ["All", "I", "long", "for", "is", "your", "touch"],
        activeWords: [],
      },
      {
        time: 97,
        words: [
          "And",
          "darling",
          "something",
          "tells",
          "me",
          "that's",
          "enough,",
          "mmm",
        ],
        activeWords: [],
      },
      {
        time: 102,
        words: ["You", "can", "say", "that", "I'm", "a", "fool"],
        activeWords: [],
      },
      {
        time: 106,
        words: ["And", "I", "don't", "know", "very", "much"],
        activeWords: [],
      },
      {
        time: 110,
        words: ["But", "I", "think", "they", "call", "this", "love"],
        activeWords: [],
      },
      {
        time: 116,
        words: ["Oh,", "I", "think", "they", "call", "this", "love"],
        activeWords: [],
      },
{
 time: 120,
 words: ["ho hoo hooo oo"],
 activeWords:[],
},
      // Bridge
      { time: 135, words: ["What", "could", "this", "be?"], activeWords: [] },
      { time: 138, words: ["Between", "you", "and", "me"], activeWords: [] },

      // Final Chorus
      {
        time: 144,
        words: ["All", "I", "dream", "of", "is", "your", "eyes"],
        activeWords: [],
      },
      {
        time: 148,
        words: ["All", "I", "long", "for", "is", "your", "touch"],
        activeWords: [],
      },
      {
        time: 150,
        words: [
          "And,",
          "darling,",
          "something",
          "tells",
          "me,",
          "tells",
          "me",
          "it's",
          "enough,",
          "mmm",
        ],
        activeWords: [],
      },
      {
        time: 158,
        words: ["You", "could", "say", "that", "I'm", "a", "fool"],
        activeWords: [],
      },
      {
        time: 160,
        words: ["And", "I", "don't", "know", "very", "much"],
        activeWords: [],
      },
      {
        time: 165,
        words: ["But", "I", "think", "they", "call"],
        activeWords: [],
      },
      {
        time: 169,
        words: ["Oh,", "I", "think", "they", "call"],
        activeWords: [],
      },
      {
        time: 172,
        words: ["Yes,", "I", "think", "they", "call", "this", "love"],
        activeWords: [],
      },
      { time: 179, words: ["This", "love"], activeWords: [] },
    ]);

    // UI state
    const currentLine = ref(0);
    const lineProgress = ref(0);
    const isLyricsExpanded = ref(false);
    const autoScroll = ref(true);
    const isLoading = ref(true);
    const showTutorial = ref(true);
    const accuracy = ref(0);
    const streak = ref(0);
    const score = ref(0);

    // Audio settings
    const speeds = [0.75, 1.0, 1.25, 1.5];

    // Computed
    const currentLineText = computed(() => {
      return lyrics.value[currentLine.value] || { words: [], activeWords: [] };
    });

    // Methods
    const getLineClass = (index) => {
      return {
        "lyric-line": true,
        active: currentLine.value === index,
        passed: currentLine.value > index,
        next: currentLine.value + 1 === index,
      };
    };

    const getWordClass = (lineIndex, wordIndex, word) => {
      const line = lyrics.value[lineIndex];
      const isActive = line.activeWords.includes(wordIndex);
      const isHighlight = shouldHighlight(word);
      const isSinging = isWordSinging(lineIndex, wordIndex);

      return {
        word: true,
        active: isActive,
        highlight: isHighlight,
        singing: isSinging,
      };
    };

    const togglePlay = () => {
      if (!audio.value) return;

      if (isPlaying.value) {
        audio.value.pause();
      } else {
        audio.value.play();
        if (audio.value.readyState < 2) {
          isLoading.value = true;
        }
      }
      isPlaying.value = !isPlaying.value;
    };

    const toggleMute = () => {
      if (!audio.value) return;
      isMuted.value = !isMuted.value;
      audio.value.muted = isMuted.value;
    };

    const changeVolume = (event) => {
      if (!audio.value) return;
      volume.value = parseFloat(event.target.value);
      audio.value.volume = volume.value;
    };

    const setSpeed = (speed) => {
      if (!audio.value) return;
      playbackRate.value = speed;
      audio.value.playbackRate = speed;
    };

    const restart = () => {
      if (!audio.value) return;
      audio.value.currentTime = 0;
      currentLine.value = 0;
      lineProgress.value = 0;
      if (!isPlaying.value) {
        audio.value.play();
        isPlaying.value = true;
      }
      scrollToCurrentLine();
    };

    const seek = (event) => {
      if (!audio.value) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const percent = (event.clientX - rect.left) / rect.width;
      const newTime = percent * duration.value;
      audio.value.currentTime = Math.max(0, Math.min(newTime, duration.value));
    };

    const seekToLine = (index) => {
      if (!audio.value || index >= lyrics.value.length) return;
      audio.value.currentTime = lyrics.value[index].time;
      currentLine.value = index;
      scrollToCurrentLine();
    };

    const updateTime = () => {
      if (!audio.value) return;

      currentTime.value = audio.value.currentTime;

      // Update current line
      let newLine = 0;
      for (let i = 0; i < lyrics.value.length; i++) {
        if (currentTime.value >= lyrics.value[i].time) {
          newLine = i;
        }
      }

      // Line changed
      if (newLine !== currentLine.value) {
        currentLine.value = newLine;

        // Animate words in new line
        const line = lyrics.value[newLine];
        line.activeWords = [];

        // Simulate word-by-word highlighting
        const wordCount = line.words.length;
        const lineDuration = getLineDuration(newLine);
        const wordInterval = lineDuration / wordCount;

        line.words.forEach((_, wordIndex) => {
          setTimeout(() => {
            if (currentLine.value === newLine) {
              line.activeWords.push(wordIndex);

              // Update stats
              if (wordIndex > 0) {
                accuracy.value = Math.min(
                  100,
                  accuracy.value + 100 / wordCount
                );
                streak.value++;
                score.value += 10;
              }
            }
          }, wordIndex * wordInterval * 1000);
        });

        // Auto-scroll to current line
        if (autoScroll.value) {
          scrollToCurrentLine();
        }
      }

      // Update line progress
      if (newLine < lyrics.value.length - 1) {
        const lineStart = lyrics.value[newLine].time;
        const lineEnd = lyrics.value[newLine + 1].time;
        const lineDuration = lineEnd - lineStart;
        if (lineDuration > 0) {
          lineProgress.value =
            ((currentTime.value - lineStart) / lineDuration) * 100;
        }
      } else {
        lineProgress.value = 100;
      }
    };

    const getLineDuration = (lineIndex) => {
      if (lineIndex < lyrics.value.length - 1) {
        return lyrics.value[lineIndex + 1].time - lyrics.value[lineIndex].time;
      }
      return 4; // Default duration for last line
    };

    const setDuration = () => {
      if (!audio.value) return;
      duration.value = audio.value.duration;
      isLoading.value = false;

      // Initialize accuracy based on line count
      accuracy.value = 5;
      streak.value = 1;
      score.value = 100;
    };

    const onSongEnd = () => {
      isPlaying.value = false;
      currentLine.value = 0;
      lineProgress.value = 0;
    };

    const onPlay = () => {
      isPlaying.value = true;
      if (isLoading.value) {
        isLoading.value = false;
      }
    };

    const onPause = () => {
      isPlaying.value = false;
    };

    const formatTime = (seconds) => {
      if (!seconds || isNaN(seconds)) return "0:00";
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const toggleLyrics = () => {
      isLyricsExpanded.value = !isLyricsExpanded.value;
      if (!isLyricsExpanded.value) {
        scrollToCurrentLine();
      }
    };

    const scrollToCurrentLine = () => {
      nextTick(() => {
        const lyricsScroll = document.querySelector(".lyrics-scroll");
        if (!lyricsScroll) return;

        const currentLineEl = lyricsScroll.querySelector(".lyric-line.active");
        if (currentLineEl) {
          const scrollTop =
            currentLineEl.offsetTop - lyricsScroll.offsetTop - 100;
          lyricsScroll.scrollTo({
            top: scrollTop,
            behavior: "smooth",
          });
        }
      });
    };

    const getWaveHeight = (index) => {
      const base = 3;
      if (!isPlaying.value) {
        return base + Math.sin(Date.now() / 1000 + index) * 2;
      }

      // Create wave pattern based on current time and line progress
      const time = Date.now() / 200;
      const beat = Math.sin(currentTime.value * 8 + index) * 4;
      const wave = Math.sin(time + index * 0.5) * 6;
      const lineBeat = lineProgress.value / 10;

      return base + beat + wave + lineBeat;
    };

    const shouldHighlight = (word) => {
      const importantWords = [
        "love",
        "eyes",
        "touch",
        "heart",
        "dream",
        "darling",
        "kiss",
        "baby",
        "hello",
      ];
      const cleanWord = word.toLowerCase().replace(/[^a-z]/g, "");
      return importantWords.includes(cleanWord);
    };

    const isWordSinging = (lineIndex, wordIndex) => {
      if (lineIndex !== currentLine.value) return false;
      const line = lyrics.value[lineIndex];
      return line.activeWords.includes(wordIndex);
    };

    const closeTutorial = () => {
      showTutorial.value = false;
      localStorage.setItem("karaokeTutorialSeen", "true");
    };

    // Initialize
    onMounted(() => {
      // Check if tutorial has been seen
      const tutorialSeen = localStorage.getItem("karaokeTutorialSeen");
      if (tutorialSeen) {
        showTutorial.value = false;
      }

      // Setup audio element
      if (audio.value) {
        audio.value.volume = volume.value;
        audio.value.playbackRate = playbackRate.value;

        // Handle audio loading
        audio.value.addEventListener("canplaythrough", () => {
          isLoading.value = false;
        });

        audio.value.addEventListener("error", (e) => {
          console.error("Audio error:", e);
          isLoading.value = false;
          alert(
            'Error loading audio file. Please make sure "song.mp3" is in the same folder.'
          );
        });
      }

      // Auto-hide tutorial after 5 seconds if not interacted with
      setTimeout(() => {
        if (showTutorial.value) {
          showTutorial.value = false;
          localStorage.setItem("karaokeTutorialSeen", "true");
        }
      }, 5000);
    });

    // Watch for line changes to update stats
    watch(currentLine, (newLine) => {
      if (newLine > 0) {
        accuracy.value = Math.min(100, accuracy.value + 2);
        streak.value++;
        score.value += 50;
      }
    });

    // Watch for play state to update visual feedback
    watch(isPlaying, (playing) => {
      if (playing) {
        accuracy.value = Math.max(5, accuracy.value - 1);
      }
    });

    return {
      // Refs
      audio,
      isPlaying,
      isMuted,
      volume,
      playbackRate,
      currentTime,
      duration,
      progress,
      lyrics,
      currentLine,
      lineProgress,
      isLyricsExpanded,
      autoScroll,
      isLoading,
      showTutorial,
      accuracy,
      streak,
      score,
      speeds,

      // Computed
      currentLineText,

      // Methods
      getLineClass,
      getWordClass,
      togglePlay,
      toggleMute,
      changeVolume,
      setSpeed,
      restart,
      seek,
      seekToLine,
      updateTime,
      setDuration,
      onSongEnd,
      onPlay,
      onPause,
      formatTime,
      toggleLyrics,
      getWaveHeight,
      shouldHighlight,
      isWordSinging,
      closeTutorial,
    };
  },
}).mount("#app");
