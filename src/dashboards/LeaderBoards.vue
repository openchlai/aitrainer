<template>
    <div class="leaderboard-container">
        <h2>🏆 Evaluation Leaderboard</h2>

        <div class="leaderboard-table">
            <!-- Display loading message until data is fetched -->
            <div v-if="loading" class="loading-message">Loading leaderboard...</div>

            <table v-else>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>User Name</th>
                        <th>Evaluations Done</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(user, index) in sortedLeaderboard" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ user.created_by_username }}</td>
                        <td>{{ user.evaluations_done }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import { defineComponent, ref, computed, onMounted } from "vue";
    import apiClient from "@/utils/axios.js";

    export default defineComponent({
        name: "Leaderboard",
        setup() {
            const leaderboardData = ref([]);
            const loading = ref(true); // Track loading state

            const getLeaderBoard = async () => {
                try {
                    const response = await apiClient.get('/transcriptions/leader-board/');
                    leaderboardData.value = response.data;
                } catch (error) {
                    console.error('Error fetching leaderboard:', error);
                } finally {
                    loading.value = false; // Hide loading state after data is fetched
                }
            };

            // Sort leaderboard by the number of evaluations done (in descending order)
            const sortedLeaderboard = computed(() => {
                return leaderboardData.value.sort((a, b) => b.evaluations_done - a.evaluations_done);
            });

            onMounted(() => {
                getLeaderBoard(); // Fetch leaderboard when component is mounted
            });

            return {
                sortedLeaderboard,
                loading,
            };
        }
    });
</script>

<style scoped>
    .leaderboard-container {
        max-width: 800px;
        margin: 2rem auto;
        padding: 2rem;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    h2 {
        font-size: 2rem;
        margin-bottom: 2rem;
        color: #2c3e50;
        font-weight: 700;
    }

    .leaderboard-table {
        overflow: hidden;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    table {
        border-collapse: separate;
        border-spacing: 0;
        background: white;
    }

    th,
    td {
        padding: 1rem 1.5rem;
        text-align: center;
        border-bottom: 1px solid #edf2f7;
    }

    th {
        background-color: #f8fafc;
        color: #4a5568;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-size: 0.875rem;
    }

    tbody tr {
        transition: all 0.2s ease;
    }

    tbody tr:nth-child(even) {
        background-color: #f8fafc;
    }

    tbody tr:hover {
        background-color: #edf2f7;
        transform: translateY(-1px);
    }

    td {
        font-weight: 500;
        color: #2d3748;
    }

    td:first-child {
        font-weight: 700;
        color: #4299e1;
    }

    tbody tr:first-child td {
        color: #2c5282;
        background-color: #ebf8ff;
    }

    .loading-message {
        text-align: center;
        font-size: 1.2rem;
        color: #999;
    }

    @media (max-width: 640px) {
        .leaderboard-container {
            padding: 1rem;
            margin: 1rem;
        }

        th,
        td {
            padding: 0.75rem;
            font-size: 0.875rem;
        }
    }
</style>
