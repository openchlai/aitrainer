<template>
    <li class="dropdown-item">
        <a :href="href">
            <slot></slot>
        </a>
    </li>
</template>

<script>
    export default {
        name: 'DropdownItem',
        props: {
            href: {
                type: String,
                required: true,
            },
        },
    };
</script>

<style scoped>
    .dropdown-item a {
        display: block;
        padding: 0.5rem 1rem;
        color: #000;
        text-decoration: none;
    }

    .dropdown-item a:hover {
        background-color: #f8f9fa;
    }
</style>
