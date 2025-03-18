<template>
    <div class="auth-container">
      <!-- Welcome Section -->
      <div class="welcome-section">
        <h1>Welcome to AI Trainer</h1>
        <p>Empowering Transcription Through AI.</p>
        <img class="moving-image" src="../assets/welcome.svg" alt="AI Speech Illustration" />
      </div>
  
      <!-- Login Form -->
      <div class="form-container">
        <h2>Login</h2>
        <form @submit.prevent="otpRequested ? verifyOTP() : requestOTP()">
          <div class="form-group">
            <label>WhatsApp Number</label>
            <PhoneFormatter v-model="whatsapp_number" @phonenumber="handleFormattedNumber" />
          </div>
  
          <div class="form-group" v-if="otpRequested">
            <label>OTP</label>
            <input type="text" v-model="otp" placeholder="Enter OTP" required />
          </div>
  
          <button type="submit">
            {{ otpRequested ? "Verify OTP" : "Request OTP" }}
          </button>
        </form>
  
        <div class="action-links">
          <router-link to="/register" class="register-link">
            New user? Register
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from "vue";
  import PhoneFormatter from "../components/PhoneFormatter.vue";
  import { useToast } from "vue-toastification";
  import apiClient from "@/utils/axios";
  import { useRouter } from "vue-router";
  
  export default {
    components: { PhoneFormatter },
    setup() {
      const whatsapp_number = ref("");
      const otp = ref("");
      const otpRequested = ref(false);
      const router = useRouter();
      const toast = useToast();
  
      const handleFormattedNumber = (formatted) => {
        whatsapp_number.value = formatted;
      };
  
      const requestOTP = async () => {
        try {
          const response = await apiClient.post("/auth/request-otp/", {
            whatsapp_number: whatsapp_number.value,
          });
          otpRequested.value = true;
          toast.success(response.data.message);
        } catch (error) {
          toast.error("OTP request failed.");
        }
      };
  
      const verifyOTP = async () => {
        if (!otpRequested.value) {
          return requestOTP();
        }
  
        try {
          const response = await apiClient.post("/auth/verify-otp/", {
            whatsapp_number: whatsapp_number.value,
            otp: otp.value,
          });
          toast.success("OTP Verified! Welcome!");
          localStorage.setItem("access_token", response.data.access);
          router.push("/dashboard");
        } catch (error) {
          toast.error("Invalid OTP.");
        }
      };
  
      return {
        whatsapp_number,
        otp,
        otpRequested,
        handleFormattedNumber,
        requestOTP,
        verifyOTP,
      };
    },
  };
  </script>
  
  <style scoped>
  .auth-container {
    display: flex;
    /* min-height: 100vh; Changed to 100vh to fill entire viewport */
    height: auto;
    width: 100%;
    background: linear-gradient(145deg, #0a0a0a, #1f1f1f);
    color: #ffffff;
    overflow: hidden;
  }
  
  .welcome-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 3rem;
    text-align: center;
    background: linear-gradient(135deg, #151515, #222222);
  }
  
  .moving-image {
    width: 50%;
    animation: float 3s infinite ease-in-out;
  }
  
  .form-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #2c2f48, #1e1f3b);
    padding: 2rem;
    box-shadow: -10px 0 30px rgba(0, 0, 0, 0.4);
    min-height: 100vh; /* Added to ensure full height */
  }
  
  .form-group {
    width: 100%;
    max-width: 400px;
    margin-bottom: 1.2rem;
  }
  
  label {
    font-weight: 600;
    display: block;
    margin-bottom: 0.5rem;
  }
  
  input {
    width: 100%;
    padding: 0.8rem;
    border-radius: 8px;
    border: 1px solid #ccc;
    outline: none;
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
  }
  
  button {
    width: 100%;
    padding: 0.8rem;
    background: #646cff;
    border: none;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  
  button:hover {
    background: #535bf2;
  }
  
  .action-links {
    margin-top: 1.5rem;
    text-align: center;
  }
  
  .register-link {
    color: #646cff;
    text-decoration: underline;
    cursor: pointer;
  }
  
  @keyframes float {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(0);
    }
  }
  
  /* @media (max-width: 1024px) {
    .auth-container {
      flex-direction: column;
      align-items: center;
      height: auto;
      width: 100%;
      margin: 0;
    }
  
    .welcome-section {
      height: auto;
      padding: 2rem;
    }
  
    .form-container {
      height: auto;
      width: 100%;
    }
  } */
  
  @media (max-width: 768px) {
    .auth-container {
      flex-direction: column;
      align-items: center;
      /* height: 100vh;  */
      width: 100%;
      margin: 0;
    }
    
    .form-container {
      height: 100vh; 
      width: 100%;
      padding: 1.5rem;
    }
  
    .welcome-section {
      display: none;
    }
  
    .moving-image {
      display: none;
    }
  
    .form-group {
      max-width: 300px;
    }
  }
  </style>