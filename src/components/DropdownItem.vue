<template>
    <li class="dropdown-item">
      <a :href="href">
        <slot></slot>
      </a>
    </li>
  </template>
  
  <script>
  export default {
    props: {
      href: {
        type: String,
        required: true
      }
    }
  };
  </script>
  
  <style>
  .dropdown-item {
    padding: 0;
    margin: 0;
  }
  
  .dropdown-item a {
    padding: 0.5rem 1rem !important;
    display: block;
    color: white;
    text-decoration: none;
    transition: background-color 0.2s;
  }
  
  .dropdown-item a:hover {
    background-color: rgba(255, 255, 255, 0.1);
    text-decoration: none !important;
  }
  
  /* Mobile responsive styles */
  @media (max-width: 992px) {
    .dropdown-item {
      width: 100%;
    }
    
    .dropdown-item a {
      padding: 0.75rem 0 !important;
      font-size: 0.95rem;
    }
  }
  </style>