<template>
    <div class="auth-container">
        <h2>{{ isLogin ? 'Login' : 'Sign Up' }}</h2>
        <form @submit.prevent="handleSubmit">
            <div class="input-group">
                <label for="email">Email:</label>
                <input type="email" id="email" v-model="email" required />
            </div>
            <div class="input-group">
                <label for="password">Password:</label>
                <input type="password" id="password" v-model="password" required />
            </div>
            <button type="submit">{{ isLogin ? 'Login' : 'Sign Up' }}</button>
        </form>
        <p @click="toggleAuthMode">
            {{ isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login' }}
        </p>
    </div>
</template>

<script setup>
    import { ref } from 'vue';

    const email = ref('');
    const password = ref('');
    const isLogin = ref(true);

    const handleSubmit = () => {
        if (isLogin.value) {
            // Handle login logic
            console.log('Logging in with', email.value, password.value);
        } else {
            // Handle signup logic
            console.log('Signing up with', email.value, password.value);
        }
    };

    const toggleAuthMode = () => {
        isLogin.value = !isLogin.value;
    };
</script>

<style scoped>
    .auth-container {
        max-width: 400px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 8px;
    }

    .input-group {
        margin-bottom: 15px;
    }

    input {
        width: 100%;
        padding: 8px;
        box-sizing: border-box;
    }

    button {
        width: 100%;
        padding: 10px;
        background-color: #42b983;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    button:hover {
        background-color: #369870;
    }

    p {
        text-align: center;
        color: #42b983;
        cursor: pointer;
    }

    p:hover {
        text-decoration: underline;
    }
</style>
