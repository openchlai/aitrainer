<template>
    <nav class="navbar">
        <div class="navbar-brand">AI Model Trainer</div>
        <button class="navbar-toggle" @click="toggleNav">☰</button>
        <div :class="['navbar-collapse', { show: isNavOpen }]">
            <ul class="navbar-nav">
                <li class="nav-item"><a href="/dashboard">Dashboard</a></li>
                <DropdownMenu title="Data Acquisition">
                    <DropdownItem href="/dataset-management">Pre Evaluations</DropdownItem>
                    <DropdownItem href="/model-configuration">Post Evaluation</DropdownItem>
                    <DropdownItem href="/dashboard">Manual Transcription</DropdownItem>
                    <DropdownItem href="/model-evaluation">Model Evaluation</DropdownItem>
                    <DropdownItem href="/results">Results</DropdownItem>
                </DropdownMenu>
                <DropdownMenu title="Model Management">
                    <DropdownItem href="/dataset-management">Dataset Management</DropdownItem>
                    <DropdownItem href="/model-configuration">Model Configuration</DropdownItem>
                    <DropdownItem href="/training-progress">Training Progress</DropdownItem>
                    <DropdownItem href="/model-evaluation">Model Evaluation</DropdownItem>
                    <DropdownItem href="/results">Results</DropdownItem>
                </DropdownMenu>

                <!-- <li class="nav-item"><a href="/transcription">Transcription </a></li> -->
                <!-- <li class="nav-item"><a href="/model-training">Model Training </a></li> -->

                <DropdownMenu title="Support">
                    <DropdownItem href="/feedback">Feedack</DropdownItem>
                    <DropdownItem href="/help">Help & Support</DropdownItem>
                </DropdownMenu>
                <li class="nav-item"><a href="/deployment">Model Deployment</a></li>
                <!-- <li class="nav-item"><a href="/feedback">User Feedback</a></li> -->
            </ul>
            <ul class="navbar-nav ml-auto">
                <li class="nav-item">
                    <a v-if="!isAuthenticated" href="/login">Login</a>
                    <a v-else href="#" @click.prevent="logout">Logout</a>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>
    import DropdownMenu from './DropdownMenu.vue';
    import DropdownItem from './DropdownItem.vue';

    export default {
        components: {
            DropdownMenu,
            DropdownItem,
        },
        data() {
            return {
                isNavOpen: false,
            };
        },
        methods: {
            toggleNav() {
                this.isNavOpen = !this.isNavOpen;
            },
            logout() {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                this.isAuthenticated = false;
                this.$router.push("/login");
            },
        },
    };
</script>

<style>
    .navbar {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        background-color: #17a2b8;
        padding: 0.5rem 1rem;
        color: white;
    }

    .navbar-brand {
        font-size: 1.25rem;
        font-weight: bold;
    }

    .navbar-toggle {
        font-size: 1.25rem;
        background: none;
        border: none;
        color: white;
        cursor: pointer;
    }

    .navbar-collapse {
        display: none;
        flex-basis: 100%;
        flex-grow: 1;
        align-items: center;
    }

    .navbar-collapse.show {
        display: flex;
    }

    .navbar-nav {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
    }

    .navbar-nav.ml-auto {
        margin-left: auto;
    }

    .nav-item {
        margin: 0.5rem 0;
    }

    .nav-item a {
        color: white;
        text-decoration: none;
    }

    .nav-item a:hover {
        text-decoration: underline;
    }

    @media (min-width: 992px) {
        .navbar-collapse {
            display: flex !important;
            flex-basis: auto;
            flex-direction: row;
        }

        .navbar-nav {
            flex-direction: row;
        }

        .nav-item {
            margin: 0 0.5rem;
        }
    }
</style>
