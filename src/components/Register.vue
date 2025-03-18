<template>
    <div class="auth-container">
      <!-- Welcome Section -->
      <div class="welcome-section">
        <h1>Welcome to AI Trainer</h1>
        <p>Empowering Transcription Through AI.</p>
        <img class="moving-image" src="../assets/welcome.svg" alt="AI Speech Illustration" />
      </div>
  
      <!-- Register Form -->
      <div class="form-container">
        <h2>Register</h2>
        <form @submit.prevent="registerUser">
          <div class="form-group">
            <label>WhatsApp Number</label>
            <PhoneFormatter v-model="whatsapp_number" @phonenumber="handleFormattedNumber" />
          </div>
  
          <div class="form-group">
            <label>Name</label>
            <input type="text" v-model="name" placeholder="Enter your name" required />
          </div>
  
          <div class="form-group">
            <label>Password</label>
            <input type="password" v-model="password" placeholder="Password" required />
          </div>
  
          <button type="submit">Register</button>
        </form>
  
        <div class="action-links">
          <router-link to="/login" class="login-link">
            Already have an account? Login
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
      const name = ref("");
      const password = ref("");
      const router = useRouter();
      const toast = useToast();
  
      const handleFormattedNumber = (formatted) => {
        whatsapp_number.value = formatted;
      };
  
      const registerUser = async () => {
        try {
          const response = await apiClient.post("/auth/register/", {
            whatsapp_number: whatsapp_number.value,
            name: name.value,
            password: password.value,
          });
          toast.success(response.data.message);
          router.push("/login");
        } catch (error) {
          toast.error("Registration failed.");
        }
      };
  
      return {
        whatsapp_number,
        name,
        password,
        handleFormattedNumber,
        registerUser,
      };
    },
  };
  </script>
  
  <style scoped>
  .auth-container {
    display: flex;
    min-height: 100vh;
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
    min-height: 100%; /* Added to ensure full height */
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
  
  .login-link {
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
  
  @media (max-width: 1024px) {
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
  }
  
  @media (max-width: 768px) {
    .auth-container {
      flex-direction: column;
      align-items: center;
      height: 100vh; /* Force full height on mobile */
      width: 100%;
      margin: 0;
    }
    
    .form-container {
      height: 100vh; /* Force full height on mobile */
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