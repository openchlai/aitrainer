<template>
    <div>
        <h2>Dataset Management for "{{ groupName }}"</h2>

        <!-- Upload Audio File -->
        <input type="file" accept="audio/*" @change="uploadPlaceholder" />
        <button @click="uploadPlaceholder">Upload Audio</button>

        <!-- Dataset List -->
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Duration (s)</th>
                    <th>Sample Rate</th>
                    <th>Language</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="dataset in datasets" :key="dataset.id">
                    <td>{{ dataset.name }}</td>
                    <td>{{ dataset.duration }}</td>
                    <td>{{ dataset.sampleRate }}</td>
                    <td>{{ dataset.language }}</td>
                    <td>{{ dataset.status }}</td>
                    <td>
                        <button @click="startTranscription(dataset.id)">Transcribe</button>
                        <button @click="deleteDataset(dataset.id)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
    import { ref } from "vue";

    const groupName = ref("Interviews"); // Placeholder

    const datasets = ref([
        { id: 1, name: "interview1.wav", duration: 55, sampleRate: 16000, language: "en", status: "completed" },
        { id: 2, name: "interview2.mp3", duration: 48, sampleRate: 22050, language: "fr", status: "pending" }
    ]);

    const uploadPlaceholder = () => alert("🔼 Placeholder: Uploading audio file...");
    const startTranscription = (id) => alert(`📝 Placeholder: Transcribing dataset #${id}`);
    const deleteDataset = (id) => alert(`🗑️ Placeholder: Deleting dataset #${id}`);
</script>
