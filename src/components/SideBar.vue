<template>
    <div :class="['sidebar', { 'sidebar-visible': sidebarVisible }]">
        <h2>Navigation</h2>
        <nav>
            <ul>
                <li><a href="#/dashboard">Model Training</a></li>
                <li><a href="#/deployment">Model Deployment</a></li>
                <li><a href="#/feedback">User Feedback</a></li>
            </ul>
        </nav>
        <button @click="toggleSidebar">Toggle Sidebar</button>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                sidebarVisible: false
            };
        },
        methods: {
            toggleSidebar() {
                this.sidebarVisible = !this.sidebarVisible;
            }
        }
    };
</script>

<style scoped>
    .sidebar {
        width: 250px;
        height: 100%;
        position: fixed;
        top: 0;
        left: -250px;
        background-color: #343a40;
        transition: left 0.3s ease;
        padding: 20px;
        box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
        color: #ffffff;
        overflow-y: auto;
        z-index: 1000;
    }

    .sidebar-visible {
        left: 0;
    }

    .sidebar h2 {
        margin-top: 0;
        color: #ffffff;
        font-size: 1.5em;
        border-bottom: 1px solid #495057;
        padding-bottom: 10px;
    }

    .sidebar nav ul {
        list-style-type: none;
        padding: 0;
    }

    .sidebar nav ul li {
        margin: 15px 0;
    }

    .sidebar nav ul li a {
        text-decoration: none;
        color: #adb5bd;
        font-size: 1.1em;
        transition: color 0.3s ease;
    }

    .sidebar nav ul li a:hover {
        color: #ffffff;
    }

    .sidebar button {
        margin-top: 20px;
        background-color: #007bff;
        color: #ffffff;
        border: none;
        padding: 10px 20px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        border-radius: 5px;
    }

    .sidebar button:hover {
        background-color: #0056b3;
    }

    @media (max-width: 768px) {
        .sidebar {
            width: 200px;
            left: -200px;
        }

        .sidebar-visible {
            left: 0;
        }
    }

    @media (max-width: 480px) {
        .sidebar {
            width: 150px;
            left: -150px;
        }

        .sidebar-visible {
            left: 0;
        }

        .sidebar h2 {
            font-size: 1.2em;
        }

        .sidebar nav ul li a {
            font-size: 1em;
        }
    }
</style>
