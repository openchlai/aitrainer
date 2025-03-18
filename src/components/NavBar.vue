<template>
  <header class="header">
    <div class="container">
      <div class="logo">AI Model Trainer</div>
      
      <button class="menu-toggle" @click="toggleMenu" aria-label="Toggle Menu">
        <span :class="['hamburger', { 'active': isMenuOpen }]">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </span>
      </button>
      
      <nav :class="['main-nav', { 'open': isMenuOpen }]">
        <ul class="nav-list">
          <li class="nav-item"><a href="/dashboard" class="nav-link">Dashboard</a></li>
          
          <li class="nav-item has-dropdown">
            <button class="dropdown-toggle" @click="toggleDropdown('dataAcquisition')">
              Data Acquisition
              <svg class="dropdown-icon" :class="{ 'rotate': openDropdowns.dataAcquisition }" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z"></path>
              </svg>
            </button>
            <ul class="dropdown-menu" :class="{ 'show': openDropdowns.dataAcquisition }">
              <li><a href="/pre-eval">Pre Evaluations</a></li>
              <li><a href="/post-eval">Post Evaluation</a></li>
              <li><a href="/manual-transcription/">Manual Transcription</a></li>
              <li><a href="/model-evaluation">Model Evaluation</a></li>
              <li><a href="/results">Results</a></li>
            </ul>
          </li>
          
          <li class="nav-item has-dropdown">
            <button class="dropdown-toggle" @click="toggleDropdown('modelManagement')">
              Model Management
              <svg class="dropdown-icon" :class="{ 'rotate': openDropdowns.modelManagement }" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z"></path>
              </svg>
            </button>
            <ul class="dropdown-menu" :class="{ 'show': openDropdowns.modelManagement }">
              <li><a href="/dataset-management">Dataset Management</a></li>
              <li><a href="/model-configuration">Model Configuration</a></li>
              <li><a href="/training-control">Training Control</a></li>
              <li><a href="/training-progress">Training Progress</a></li>
              <li><a href="/model-evaluation">Model Evaluation</a></li>
              <li><a href="/results">Results</a></li>
              <li><a href="/experiment-tracking">Experiment Tracking</a></li>
              <li><a href="/deployment">Model Deployment</a></li>
            </ul>
          </li>
          
          <li class="nav-item has-dropdown">
            <button class="dropdown-toggle" @click="toggleDropdown('support')">
              Support
              <svg class="dropdown-icon" :class="{ 'rotate': openDropdowns.support }" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z"></path>
              </svg>
            </button>
            <ul class="dropdown-menu" :class="{ 'show': openDropdowns.support }">
              <li><a href="/feedback">Feedback</a></li>
              <li><a href="/help">Help & Support</a></li>
            </ul>
          </li>
        </ul>
        
        <div class="auth-section">
          <a v-if="!isAuthenticated" href="/login" class="auth-link">Login</a>
          <a v-else href="#" @click.prevent="logout" class="auth-link">Logout</a>
        </div>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      isMenuOpen: false,
      openDropdowns: {
        dataAcquisition: false,
        modelManagement: false,
        support: false
      }
    };
  },
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem("access_token");
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
      
      // Close all dropdowns when closing the menu
      if (!this.isMenuOpen) {
        Object.keys(this.openDropdowns).forEach(key => {
          this.openDropdowns[key] = false;
        });
      }
    },
    toggleDropdown(dropdown) {
      this.openDropdowns[dropdown] = !this.openDropdowns[dropdown];
    },
    logout() {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      this.$router.push("/login");
    },
    closeDropdownsOnClickOutside(event) {
      const dropdown = event.target.closest('.has-dropdown');
      if (!dropdown) {
        Object.keys(this.openDropdowns).forEach(key => {
          this.openDropdowns[key] = false;
        });
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.closeDropdownsOnClickOutside);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.closeDropdownsOnClickOutside);
  }
};
</script>

<style>
:root {
  --primary-color: #4a6cfa;
  --primary-hover: #3959d9;
  --text-color: #333;
  --text-light: #666;
  --background-color: #fff;
  --border-color: #eaeaea;
  --shadow-color: rgba(0, 0, 0, 0.1);
  --menu-transition: 0.3s ease;
}

.header {
  position: relative;
  background-color: var(--background-color);
  box-shadow: 0 2px 10px var(--shadow-color);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
}

.hamburger {
  display: block;
  position: relative;
  width: 24px;
  height: 22px;
}

.hamburger-line {
  display: block;
  width: 100%;
  height: 2px;
  background-color: var(--primary-color);
  position: absolute;
  left: 0;
  transition: all 0.3s;
}

.hamburger-line:nth-child(1) {
  top: 0;
}

.hamburger-line:nth-child(2) {
  top: 10px;
}

.hamburger-line:nth-child(3) {
  top: 20px;
}

.hamburger.active .hamburger-line:nth-child(1) {
  transform: translateY(10px) rotate(45deg);
}

.hamburger.active .hamburger-line:nth-child(2) {
  opacity: 0;
}

.hamburger.active .hamburger-line:nth-child(3) {
  transform: translateY(-10px) rotate(-45deg);
}

.main-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-grow: 1;
  margin-left: 40px;
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  position: relative;
  margin: 0 5px;
}

.nav-link {
  display: block;
  padding: 10px 15px;
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  transition: color var(--menu-transition);
}

.nav-link:hover {
  color: var(--primary-color);
}

.has-dropdown {
  position: relative;
}

.dropdown-toggle {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background: none;
  border: none;
  font-weight: 500;
  color: var(--text-color);
  cursor: pointer;
  transition: color var(--menu-transition);
}

.dropdown-toggle:hover {
  color: var(--primary-color);
}

.dropdown-icon {
  width: 16px;
  height: 16px;
  margin-left: 5px;
  fill: currentColor;
  transition: transform var(--menu-transition);
}

.dropdown-icon.rotate {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 100;
  min-width: 220px;
  background-color: var(--background-color);
  box-shadow: 0 5px 15px var(--shadow-color);
  border-radius: 4px;
  padding: 8px 0;
  margin: 5px 0 0;
  list-style: none;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all var(--menu-transition);
}

.dropdown-menu.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-menu a {
  display: block;
  padding: 8px 20px;
  color: var(--text-light);
  text-decoration: none;
  transition: color var(--menu-transition), background-color var(--menu-transition);
}

.dropdown-menu a:hover {
  color: var(--primary-color);
  background-color: rgba(74, 108, 250, 0.05);
}

.auth-section {
  margin-left: auto;
}

.auth-link {
  display: inline-block;
  padding: 8px 20px;
  color: white;
  background-color: var(--primary-color);
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color var(--menu-transition);
}

.auth-link:hover {
  background-color: var(--primary-hover);
}

@media (max-width: 992px) {
  .menu-toggle {
    display: block;
    z-index: 1000;
  }

  .main-nav {
    position: fixed;
    top: 0;
    right: 0;
    width: 280px;
    height: 100vh;
    background-color: var(--background-color);
    box-shadow: -5px 0 15px var(--shadow-color);
    padding: 80px 20px 30px;
    flex-direction: column;
    align-items: flex-start;
    transform: translateX(100%);
    transition: transform var(--menu-transition);
    overflow-y: auto;
    z-index: 999;
  }

  .main-nav.open {
    transform: translateX(0);
  }

  .nav-list {
    flex-direction: column;
    width: 100%;
  }

  .nav-item {
    margin: 0;
    width: 100%;
  }

  .nav-link,
  .dropdown-toggle {
    padding: 12px 0;
  }

  .dropdown-menu {
    position: static;
    box-shadow: none;
    padding-left: 15px;
    max-height: 0;
    overflow: hidden;
    transform: none;
    transition: max-height var(--menu-transition), opacity var(--menu-transition);
  }

  .dropdown-menu.show {
    max-height: 500px;
  }

  .dropdown-menu a {
    padding: 10px 0;
  }

  .auth-section {
    margin: 20px 0 0;
    width: 100%;
  }

  .auth-link {
    display: block;
    text-align: center;
  }
}
</style>