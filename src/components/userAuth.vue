<template>
    <div class="auth-container">
        <!-- Left Section: Welcome Message -->
        <div class="welcome-section">
            <h1>Welcome to AI Trainer</h1>
            <p>Empowering Transcription Through AI.</p>
            <img class="moving-image" :src="welcomeImage" alt="AI Speech Illustration" />
        </div>

        <!-- Right Section: Login Form -->
        <div class="auth-box">
            <h2>{{ isLogin ? 'Sign In' : 'Create an Account' }}</h2>
            <br>
            <form @submit.prevent="handleSubmit">
                <div class="input-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" v-model="email" required autofocus placeholder="Enter your email" />
                </div>
                <div class="input-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" v-model="password" required placeholder="Enter your password" />
                </div>
                <br>
                <button type="submit" :disabled="loading">
                    {{ loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up' }}
                </button>
            </form>
            <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
            <p class="toggle-text" @click="toggleAuthMode">
                {{ isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In" }}
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import welcomeImage from '../assets/welcome.svg';

const router = useRouter();
const email = ref('');
const password = ref('');
const isLogin = ref(true);
const loading = ref(false);
const errorMessage = ref('');
const API_BASE_URL = 'https://your-api.com/auth'; 

const handleSubmit = async () => {
    errorMessage.value = '';
    loading.value = true;

    try {
        const endpoint = isLogin.value ? `${API_BASE_URL}/login` : `${API_BASE_URL}/register`;
        const response = await axios.post(endpoint, {
            email: email.value,
            password: password.value,
        });

        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            router.push('/dashboard'); 
        } else {
            errorMessage.value = response.data.message || 'Something went wrong!';
        }
    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'An error occurred. Please try again.';
    } finally {
        loading.value = false;
    }
};

const toggleAuthMode = () => {
    isLogin.value = !isLogin.value;
    errorMessage.value = ''; 
};
</script>

<style scoped>
/* Ensure full screen coverage */
html, body {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden; /* Prevent scrolling */
}

.auth-container {
    display: flex;
    width: 100vw;
    min-height: 100vh; /* Ensures it takes the full height */
}

.welcome-section, .auth-box {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.welcome-section {
    background: linear-gradient(135deg, #0a0a0a, #141414, #1f1f1f);
    color: white;
    padding: 2rem;
}

.moving-image {
    width: 75%;
    max-width: 500px;
    object-fit: contain;
    animation: float 3s ease-in-out infinite;
}

.auth-box {
    background: linear-gradient(135deg, #2c2f48, #1e1f3b);
    padding: 3rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    min-height: 100vh;
}

/* Form Styling */
.input-group {
    width: 100%;
    max-width: 300px;
}

label {
    display: block;
    font-weight: 600;
    margin-bottom: 5px;
}

input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
}

button {
    width: 100%;
    padding: 10px;
    background: #007bff;
    border: none;
    color: white;
    font-size: 1rem;
    border-radius: 6px;
    cursor: pointer;
}

button:hover {
    background: #0056b3;
}

button:disabled {
    background: #ccc;
    cursor: not-allowed;
}

.error-message {
    color: red;
    margin-top: 10px;
}

.toggle-text {
    margin-top: 1rem;
    color: #007bff;
    cursor: pointer;
}

.toggle-text:hover {
    text-decoration: underline;
}

@keyframes float {
    0% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0); }
}

/* Responsive Design */
@media (max-width: 768px) {
    .auth-container {
        flex-direction: column;
    }
    .welcome-section {
        width: 100%;
        padding: 1rem;
    }
    .auth-box {
        width: 100%;
    }
}
</style>
