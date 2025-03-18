<template>
    <li class="dropdown-menu">
      <a href="#" class="dropdown-toggle" @click.prevent="toggleDropdown">
        {{ title }} <span class="dropdown-arrow" :class="{ 'open': isOpen }">▼</span>
      </a>
      <ul class="dropdown-items" :class="{ 'show': isOpen }">
        <slot></slot>
      </ul>
    </li>
  </template>
  
  <script>
  import { ref, watch } from 'vue';
  
  export default {
    props: {
      title: {
        type: String,
        required: true
      },
      closeAllDropdowns: {
        type: Function,
        default: null
      }
    },
    setup(props) {
      const isOpen = ref(false);
  
      const toggleDropdown = (event) => {
        event.stopPropagation();
        isOpen.value = !isOpen.value;
      };
  
      // Close dropdown when clicking outside
      const handleClickOutside = (event) => {
        if (isOpen.value && !event.target.closest('.dropdown-menu')) {
          isOpen.value = false;
        }
      };
  
      // Watch for the closeAllDropdowns signal
      watch(() => props.closeAllDropdowns, () => {
        isOpen.value = false;
      });
  
      // Attach and detach click listener
      if (typeof window !== 'undefined') {
        document.addEventListener('click', handleClickOutside);
      }
  
      return {
        isOpen,
        toggleDropdown
      };
    }
  };
  </script>
  
  <style>
  .dropdown-menu {
    position: relative;
  }
  
  .dropdown-toggle {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 0.5rem 0;
    white-space: nowrap;
  }
  
  .dropdown-arrow {
    margin-left: 0.25rem;
    font-size: 0.75rem;
    transition: transform 0.2s ease;
  }
  
  .dropdown-arrow.open {
    transform: rotate(180deg);
  }
  
  .dropdown-items {
    position: absolute;
    top: 100%;
    left: 0;
    background-color: #1a93a5;
    min-width: 200px;
    list-style: none;
    padding: 0.5rem 0;
    margin: 0;
    border-radius: 0 0 4px 4px;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.2s ease;
    z-index: 1001;
  }
  
  .dropdown-items.show {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
  
  /* Mobile responsive styles */
  @media (max-width: 992px) {
    .dropdown-menu {
      width: 100%;
    }
    
    .dropdown-toggle {
      width: 100%;
      justify-content: space-between;
      padding: 0.75rem 0;
    }
    
    .dropdown-items {
      position: static;
      background-color: rgba(0, 0, 0, 0.1);
      min-width: auto;
      width: 100%;
      max-height: 0;
      overflow: hidden;
      box-shadow: none;
      border-radius: 0;
      transform: none;
      transition: max-height 0.3s ease;
    }
    
    .dropdown-items.show {
      max-height: 1000px;
      padding: 0.5rem 0 0.5rem 1rem;
      margin-top: 0.25rem;
      margin-bottom: 0.5rem;
      border-left: 2px solid rgba(255, 255, 255, 0.3);
    }
  }
  </style>