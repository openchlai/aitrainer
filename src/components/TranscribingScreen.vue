<!-- views/TranscribingScreen.vue -->
<template>
  <div class="audio-screen">
    <!-- Top Bar -->
    <div class="top-bar">
      <!-- Show chunk index + total -->
      <p>{{ currentIndex + 1 }} / {{ totalAudios }}</p>
      <h2>
        Transcribing Chunk {{ currentIndex }}
      </h2>
    </div>

    <!-- Audio Player -->
    <div class="audio-container">
      <audio ref="audioPlayer" class="audio-player" controls>
        <source :src="audioSrc" type="audio/wav" />
        Your browser does not support the audio element.
      </audio>

      <!-- Playback Controls -->
      <div class="playback-buttons">
        <button @click="playAudio" :disabled="isPlaying">Play</button>
        <button @click="pauseAudio" :disabled="!isPlaying">Pause</button>
        <button @click="resetAudio">Reset</button>
        <button @click="skipAudio(-5)">-5s</button>
        <button @click="skipAudio(5)">+5s</button>
      </div>

      <!-- Current Time Display -->
      <div class="current-time">
        Time: {{ currentTime.toFixed(2) }}s
        / {{ currentAudio.duration || 0 }}s
      </div>
    </div>


    <!-- Dropdown menus for gender and language -->
    <div class="Gender-Language-Dropdowns">
      <!-- Gender Dropdown -->
      <div class="gender-dropdown">
        <label v-if="genderLabel" :for="genderId">{{ genderLabel }}</label>
        <select :id="genderId" v-model="selectedGender" class="gender-select" @change="handleGender">
          <option value="" disabled>Select Gender</option>
          <option v-if="genderPlaceholder" value="" disabled>{{ genderPlaceholder }}</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <!-- {{ languages  }} -->
      <!-- Country-Language Dropdown -->
      <div>
        <!-- Country Dropdown -->
        <div class="country-dropdown">
          <select id="country" v-model="selectedCountry">
            <option value="" disabled>Select a country</option>
            <option v-for="(value, country) in languages" :key="country" :value="country">
              {{ country }}
            </option>
          </select>
        </div>

        <!-- Language Dropdown -->
        <div class="language-dropdown">
          <select id="language" v-model="selectedLanguage">
            <option value="" disabled>Select a language</option>
            <option v-for="(lang, index) in filteredLanguages" :key="index" :value="lang.initials">
              {{ lang.name }} <span v-if="lang.official"> (Official)</span>
            </option>
          </select>
        </div>
      </div>
    </div>



    <!-- Transcription Textarea -->
    <div class="transcription-box">
      <label for="transcription">Transcription:</label>
      <textarea id="transcription" ref="transcriptionInput" v-model="transcriptionText" rows="5"
        @keydown.enter.prevent="handleEnterKey"></textarea>
    </div>

    <!-- Action Buttons -->
    <div class="action-buttons">
      <button @click="goPrevious" :disabled="currentIndex === 0">
        Previous
      </button>
      <!-- <button @click="disapproveAudio" class="reject-button">
        Disapprove
      </button> -->
      <button @click="saveTranscriptionDetails" class="save-button">
        Save
      </button>
      <button @click="goNext" :disabled="currentIndex === totalAudios - 1">
        Next
      </button>
    </div>

    <!-- Modal for "Save and go Next?" -->
    <!-- <div v-if="showApproveDialog" class="modal-overlay" @click.self="cancelDialog">
      <div class="modal">
        <p>Save and go next?</p>
        <div>
          <button @click="cancelDialog">Cancel</button>
          <button ref="yesButton" @click="approveAndNext">Yes</button>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import apiClient from '@/utils/axios.js'
import { useCaseStore } from '../stores/caseStore.js'
import { useToast } from 'vue-toastification';
import { languages } from '../utils/languages.js';

export default {
  setup() {
    const toast = useToast();
    const caseStore = useCaseStore();
    const route = useRoute();

    const currentIndex = ref(0);
    const audioPlayer = ref(null);
    const isPlaying = ref(false);
    const currentTime = ref(0);
    const showApproveDialog = ref(false);
    const yesButton = ref(null);

    onMounted(() => {
      const idx = parseInt(route.params.startIndex, 10);
      currentIndex.value = Number.isNaN(idx) ? 0 : idx;
    });

    const audioList = computed(() => caseStore.audioList);
    const currentAudio = computed(() => audioList.value[currentIndex.value] || {});
    const selectedGender = ref(currentAudio.value.gender || '');
    const selectedLanguage = ref(currentAudio.value.locale || '');
    const transcriptionText = ref(currentAudio.value.feature_text || '');
    const totalAudios = computed(() => audioList.value.length);

    const audioSrc = computed(() => currentAudio.value.chunk_file || '');
    // Reactive state
    const selectedCountry = ref("");

    // Computed property to filter languages based on selected country
    const filteredLanguages = computed(() => {
      return selectedCountry.value ? languages[selectedCountry.value] || [] : [];
    });

    // Watch the selectedCountry for debugging
    watch(selectedCountry, (newVal) => {
      console.log("Country changed to:", newVal);
      console.log("Updated languages:", filteredLanguages.value);
    });

    watch(currentAudio, (newAudio) => {
      selectedGender.value = newAudio.gender || '';
      selectedLanguage.value = newAudio.locale || '';
      transcriptionText.value = newAudio.feature_text || '';
    });



    watch(currentAudio, async () => {
      isPlaying.value = false;
      currentTime.value = 0;


      await nextTick();
      if (audioPlayer.value) {
        audioPlayer.value.load();
      }
    });

    watch(audioPlayer, (player) => {
      if (!player) return;
      player.ontimeupdate = () => (currentTime.value = player.currentTime);
      player.onplay = () => (isPlaying.value = true);
      player.onpause = () => (isPlaying.value = false);
      player.onloadedmetadata = () => {
        if (currentAudio.value) {
          currentAudio.value.duration = player.duration;
        }
      };
    });

    function playAudio() {
      if (audioPlayer.value) audioPlayer.value.play();
    }

    function pauseAudio() {
      if (audioPlayer.value) audioPlayer.value.pause();
    }

    function resetAudio() {
      if (!audioPlayer.value) return;
      audioPlayer.value.currentTime = 0;
      isPlaying.value = false;
      audioPlayer.value.pause();
    }

    function skipAudio(seconds) {
      if (!audioPlayer.value) return;
      const duration = audioPlayer.value.duration;
      if (!duration || isNaN(duration)) return;

      let newTime = audioPlayer.value.currentTime + seconds;
      newTime = Math.min(Math.max(newTime, 0), duration);
      audioPlayer.value.currentTime = newTime;
    }

    async function saveTranscriptionDetails() {
      if (currentAudio.value.unique_id) {
        try {
          await apiClient.put(
            `/transcriptions/audio-chunks/${currentAudio.value.unique_id}/`,
            {
              "feature_text": transcriptionText.value,
              "gender": selectedGender.value,
              "locale": selectedLanguage.value
            }
          );

          currentAudio.value.is_evaluated = true;
          toast.success('Successfully saved Transcription details.');
        } catch (err) {
          console.error('Error saving transcription:', err);
          toast.error('Could not save transcription.');
        }
      }
    }

    function goNext() {
      if (currentIndex.value < audioList.value.length - 1) {
        currentIndex.value++;
      }
    }

    function goPrevious() {
      if (currentIndex.value > 0) {
        currentIndex.value--;
      }
    }

    function handleEnterKey() {
      if (!transcriptionText.value.trim()) return;
      showApproveDialog.value = true;
    }

    return {
      currentIndex,
      audioPlayer,
      isPlaying,
      currentTime,
      showApproveDialog,
      yesButton,
      audioList,
      currentAudio,
      selectedGender,
      selectedLanguage,
      transcriptionText,
      totalAudios,
      audioSrc,
      playAudio,
      pauseAudio,
      resetAudio,
      skipAudio,
      saveTranscriptionDetails,
      goNext,
      goPrevious,
      handleEnterKey,
      languages,
      selectedCountry,  // Ensure this is included
      filteredLanguages
    };
  }
};
</script>


<style scoped>
.audio-screen {
  padding: 20px;
  background: #f0f0f0;
  color: #333;
  width: 700px;
  margin: 0 auto;
  border-radius: 8px;
}

/* Top Bar */
.top-bar {
  margin-bottom: 10px;
}

.top-bar h2 {
  margin: 0;
}

.narration {
  margin: 4px 0 12px;
  font-style: italic;
}

/* Audio container */
.audio-container {
  background: white;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
}


.audio-player {
  width: 100%;
  outline: none;
}

.playback-buttons {
  margin-top: 8px;
}

.playback-buttons button {
  margin-right: 6px;
}

.current-time {
  margin-top: 8px;
  font-size: 0.9em;
  color: #555;
}

/* Transcription */
.transcription-box {
  margin-bottom: 10px;
}

#transcription {
  width: 100%;
  font-family: inherit;
  padding: 8px;
  box-sizing: border-box;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}

.reject-button {
  background: #ff0019;
  color: white;
  opacity: 0.7;
}

.reject-button:disabled {
  cursor: not-allowed;
  background: #e9a5ac;
}

.save-button {
  background: #28a745;
  color: white;
}

.save-button:disabled {
  cursor: not-allowed;
  background: #b2debd;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  display: block;
  width: 200px;
}

.modal p {
  margin-bottom: 16px;
}

.modal div {
  display: flex;
  justify-content: space-between;

}
</style>