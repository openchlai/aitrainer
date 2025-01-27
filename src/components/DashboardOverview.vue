<template>
    <div class="dashboard-container">
        <h2>Dashboard Overview</h2>

        <!-- Model List Section -->
        <section class="model-list">
            <h3>Available Models</h3>
            <ul>
                {{ models }}
                <li v-for="model in models" :key="model.id">
                    <strong>{{ model.name }}</strong>: {{ model.description }}
                </li>
            </ul>
        </section>

        <!-- Training Status Section -->
        <section class="training-status">
            <h3>Training Sessions</h3>
            <ul>
                <li v-for="session in trainingSessions" :key="session.id">
                    <strong>{{ session.modelName }}</strong> - Status: {{ session.status }}
                </li>
            </ul>
        </section>

        <!-- Recent Projects Section -->
        <section class="recent-projects">
            <h3>Recent Projects</h3>
            <ul>
                <li v-for="project in recentProjects" :key="project.id">
                    <strong>{{ project.name }}</strong> - Last Modified: {{ project.lastModified }}
                </li>
            </ul>
        </section>
    </div>
</template>

<script>
    import { ref, onMounted } from 'vue';

    export default {
        setup() {
         

                const models = ref([
                    { id: 1, name: 'Model A', description: 'Description of Model A' },
                    { id: 2, name: 'Model B', description: 'Description of Model B' },
                ]);

                const trainingSessions = ref([
                    { id: 1, modelName: 'Model A', status: 'Completed' },
                    { id: 2, modelName: 'Model B', status: 'In Progress' },
                ]);

                const recentProjects = ref([
                    { id: 1, name: 'Project X', lastModified: '2025-01-20' },
                    { id: 2, name: 'Project Y', lastModified: '2025-01-18' },
                ]);
                
            onMounted(() => {

            });

            return {
                models,
                trainingSessions,
                recentProjects
            };
        }
    };
</script>

<style scoped>
    .dashboard-container {
        padding: 20px;
    }

    section {
        margin-bottom: 20px;
    }

    h3 {
        margin-bottom: 10px;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        background-color: #f9f9f9;
        margin-bottom: 5px;
        padding: 10px;
        border-radius: 5px;
    }
</style>
