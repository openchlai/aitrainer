<template>
    <div class="auth-container">
        <!-- Left Section: Welcome Message -->
        <div class="welcome-section">
            <h1>Welcome to AI Trainer</h1>
            <p>Empowering Transcription Through AI.</p>
            <img class="moving-image" src="../assets/welcome.svg" alt="AI Speech Illustration" />

        </div>
        <!-- Right Section: Login Form -->
        <div class="container">
        <h2>{{ isRegister ? "Register" : "Login" }}</h2>
        <form @submit.prevent="isRegister ? registerUser() : verifyOTP()">
            <div class="form-group">
                <label for="whatsapp_number">WhatsApp Number</label>
                <input type="text" v-model="whatsapp_number" required />
            </div>
            <div class="form-group" v-if="isRegister">
                <label for="name">Name</label>
                <input type="text" v-model="name" required />
            </div>
             <br>
            <div class="form-group" v-if="otpRequested">
                <label>OTP</label>
                <input type="text" v-model="otp" required />
            </div>

            <button type="submit">
                {{ isRegister ? "Register" : otpRequested ? "Verify OTP" : "Request OTP" }}
            </button>
        </form>
        <br>
        <button @click="toggleMode">
            {{ isRegister ? "Already have an account? Login" : "New user? Register" }}
        </button>
    </div>
    </div>
</template>

<script>
    import { ref } from "vue";
    import { useRouter } from "vue-router";
    import apiClient from "../utils/axios.js";
    export default {
        setup() {
            const whatsapp_number = ref("");
            const name = ref("");
            const otp = ref("");
            const isRegister = ref(false);
            const otpRequested = ref(false);
            const router = useRouter();

            const toggleMode = () => {
                isRegister.value = !isRegister.value;
                otpRequested.value = false;
                whatsapp_number.value = "";
                name.value = "";
                otp.value = "";
            };

            const registerUser = async () => {
                try {
                    const response = await apiClient.post("/auth/register/", {
                        whatsapp_number: whatsapp_number.value,
                        name: name.value,
                    });
                    alert(response.data.message);
                    isRegister.value = false;
                } catch (error) {
                    alert(error.response?.data?.error || "Registration failed.");
                }
            };

            const requestOTP = async () => {
                try {
                    const response = await apiClient.post("/auth/request-otp/", {
                        whatsapp_number: whatsapp_number.value,
                    });
                    alert(response.data.message);
                    otpRequested.value = true;
                } catch (error) {
                    alert(error.response?.data?.error || "Failed to request OTP.");
                }
            };

            const verifyOTP = async () => {
                if (!otpRequested.value) {
                    return requestOTP(); // Request OTP first if not already done
                }

                try {
                    const response = await apiClient.post("/auth/verify-otp/", {
                        whatsapp_number: whatsapp_number.value,
                        otp: otp.value,
                    });

                    alert("OTP Verified! Login successful.");
                    localStorage.setItem("access_token", response.data.access);
                    localStorage.setItem("refresh_token", response.data.refresh);
                    router.push("/dashboard"); // Redirect after login
                } catch (error) {
                    alert(error.response?.data?.error || "OTP verification failed.");
                }
            };

            return {
                whatsapp_number,
                name,
                otp,
                isRegister,
                otpRequested,
                toggleMode,
                registerUser,
                verifyOTP,
            };
        },
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
    width: 90vw;
    height: 100vh; /* Ensure full-screen coverage */
    overflow: hidden;
}


.welcome-section {
    flex: 1;
    background: linear-gradient(135deg, #0a0a0a, #141414, #1f1f1f);
    color: white;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    text-align: center;
    
}

.moving-image {
    width: 40%;
    max-width: 500px;
    object-fit: contain;
    animation: float 3s ease-in-out infinite;
} 

.container {
    flex: 1;
    background: linear-gradient(135deg, #2c2f48, #1e1f3b);
    padding: 3rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    height: 100vh; /* Full height */
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
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
    width: auto; /* Adjusts width based on content */
    max-width: 300px; /* Prevents it from being too wide */
    padding: 10px 20px; /* Adds horizontal padding for a balanced look */
    background: #007bff;
    border: none;
    color: white;
    font-size: 1rem;
    border-radius: 6px;
    cursor: pointer;
    text-align: center; /* Ensures text stays centered */
    display: inline-block; /* Prevents unwanted stretching */
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
    .welcome-section, .container {
        max-width: 100%;
        width: 100%;
    }
}
</style>
