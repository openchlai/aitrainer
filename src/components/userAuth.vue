<template>
    <div class="container">
        <h2>{{ isRegister ? "Register" : "Login" }}</h2>

        <form @submit.prevent="isRegister ? registerUser() : (useOTP ? verifyOTP() : requestOTP())">
            <div class="form-group">
                <label for="whatsapp_number">WhatsApp Number</label>
                <input type="text" v-model="whatsapp_number" required />
            </div>

            <div class="form-group" v-if="isRegister">
                <label for="name">Name</label>
                <input type="text" v-model="name" required />
            </div>

            <div class="form-group">
                <label v-if="!useOTP">Password</label>
                <label v-if="useOTP">OTP</label>
                <input type="password" v-model="password" v-if="!useOTP" required />
                <input type="text" v-model="otp" v-if="useOTP" required />
            </div>

            <button type="submit">
                {{ isRegister ? "Register" : useOTP ? "Verify OTP" : "Request OTP" }}
            </button>
        </form>

        <button @click="toggleMode">
            {{ isRegister ? "Already have an account? Login" : "New user? Register" }}
        </button>

        <button @click="useOTPMode" v-if="!useOTP && !isRegister">Use OTP Instead</button>
    </div>
</template>

<script>
    import { ref } from "vue";
    import { useRouter } from "vue-router";
    import apiClient from "@/utils/axios";

    export default {
        setup() {
            const whatsapp_number = ref("");
            const name = ref("");
            const password = ref("");
            const otp = ref("");
            const isRegister = ref(false);
            const useOTP = ref(false);
            const router = useRouter();

            const toggleMode = () => {
                isRegister.value = !isRegister.value;
                useOTP.value = false;
                whatsapp_number.value = "";
                name.value = "";
                password.value = "";
                otp.value = "";
            };

            const useOTPMode = () => {
                useOTP.value = true;
            };

            const registerUser = async () => {
                try {
                    const response = await apiClient.post("/auth/register/", {
                        whatsapp_number: whatsapp_number.value,
                        name: name.value,
                        password: password.value,
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
                    useOTP.value = true;
                } catch (error) {
                    alert(error.response?.data?.error || "Failed to request OTP.");
                }
            };

            const verifyOTP = async () => {
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
                password,
                otp,
                isRegister,
                useOTP,
                toggleMode,
                useOTPMode,
                registerUser,
                requestOTP,
                verifyOTP,
            };
        },
    };
</script>

<style scoped>
    .container {
        width: 300px;
        margin: auto;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
        text-align: center;
    }

    .form-group {
        margin-bottom: 10px;
    }

    input {
        width: 100%;
        padding: 8px;
        margin-top: 5px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    button {
        width: 100%;
        padding: 10px;
        margin-top: 10px;
        border: none;
        background-color: #007bff;
        color: white;
        cursor: pointer;
    }

    button:hover {
        background-color: #0056b3;
    }
</style>
