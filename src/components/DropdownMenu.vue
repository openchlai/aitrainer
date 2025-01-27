<template>
    <li class="nav-item dropdown" @mouseenter="openDropdown" @mouseleave="closeDropdown">
        <a href="#" class="dropdown-toggle" @click.prevent="toggleDropdown">{{ title }}</a>
        <ul class="dropdown-menu" v-if="isOpen">
            <slot></slot>
        </ul>
    </li>
</template>

<script>
    export default {
        name: 'DropdownMenu',
        props: {
            title: {
                type: String,
                required: true,
            },
            isOpen: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                isOpen: this.isOpen,
            };
        },
        methods: {
            toggleDropdown() {
                this.isOpen = !this.isOpen;
                this.$emit('toggle');
            },
            openDropdown() {
                this.isOpen = true;
            },
            closeDropdown() {
                this.isOpen = false;
            },
        },
    };
</script>

<style scoped>
    .nav-item.dropdown {
        position: relative;
    }

    .dropdown-toggle::after {
        content: ' ▼';
        font-size: 0.8em;
    }

    .dropdown-menu {
        display: block;
        position: absolute;
        background-color: #fff;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        z-index: 1;
        list-style: none;
        padding: 0;
        margin: 0;
        min-width: 10rem;
    }
</style>
