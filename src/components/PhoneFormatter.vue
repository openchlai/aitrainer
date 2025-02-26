<template>
    <div>
        <label for="country">Country Code:</label>
        <select v-model="countryCode">
            <option value="US">United States (+1)</option>
            <option value="KE">Kenya (+254)</option>
            <option value="UG">Uganda (+256)</option>
            <option value="TZ">Tanzania (+255)</option>
            <option value="IN">India (+91)</option>
        </select>

        <label for="phone">Phone Number:</label>
        <input type="text" v-model="phoneNumber" placeholder="Enter phone number" />

        <p>Formatted: {{ formattedNumber }}</p>
    </div>
</template>

<script>
    import { ref, computed, watch } from "vue";
    import { parsePhoneNumberFromString } from "libphonenumber-js";

    export default {
        props: {
            modelValue: String // Enables v-model usage in parent
        },
        emits: ["update:modelValue", "phonenumber"], // Declare events
        setup(props, { emit }) {
            const countryCode = ref("KE"); // Default country
            const phoneNumber = ref(props.modelValue || ""); // Sync with v-model

            // Computed property to format phone number
            const formattedNumber = computed(() => {
                if (!phoneNumber.value) return "";

                const phoneNumberObj = parsePhoneNumberFromString(phoneNumber.value, countryCode.value);

                if (phoneNumberObj) {
                    return `${phoneNumberObj.countryCallingCode}${phoneNumberObj.nationalNumber}`; // No "+"
                }

                return "Invalid number";
            });

            // Watch for changes and emit updates
            watch([formattedNumber, countryCode], () => {
                emit("update:modelValue", phoneNumber.value); // Sync v-model
                emit("phonenumber", formattedNumber.value); // Emit formatted number
            });

            return {
                countryCode,
                phoneNumber,
                formattedNumber,
            };
        },
    };
</script>

<style scoped>
    label {
        display: block;
        margin: 10px 0 5px;
        font-weight: bold;
    }

    input,
    select {
        padding: 8px;
        width: 100%;
        max-width: 300px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    p {
        font-weight: bold;
        margin-top: 10px;
        color: #007bff;
    }
</style>
