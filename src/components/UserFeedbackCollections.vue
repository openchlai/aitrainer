<template>
    <div class="user-feedback">
        <h2>User Feedback</h2>

        <!-- Feedback Form -->
        <form @submit.prevent="submitFeedback">
            <div class="input-group">
                <label for="username">Name:</label>
                <input type="text" id="username" v-model="username" placeholder="Enter your name" required />
            </div>

            <div class="input-group">
                <label for="email">Email:</label>
                <input type="email" id="email" v-model="email" placeholder="Enter your email" required />
            </div>

            <div class="input-group">
                <label for="comments">Comments:</label>
                <textarea id="comments" v-model="comments" placeholder="Enter your feedback" required></textarea>
            </div>

            <button type="submit">Submit Feedback</button>
        </form>

        <!-- Submission Confirmation -->
        <div v-if="submissionStatus" class="submission-status">
            <p>{{ submissionStatus }}</p>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';

    const username = ref('');
    const email = ref('');
    const comments = ref('');
    const submissionStatus = ref(null);

    const submitFeedback = async () => {
        if (!username.value || !email.value || !comments.value) {
            alert('Please fill in all fields.');
            return;
        }

        // Mock submission logic
        // Replace this with actual API call to submit feedback
        try {
            // Simulate API call delay
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Clear form fields after submission
            username.value = '';
            email.value = '';
            comments.value = '';

            // Set submission status message
            submissionStatus.value = 'Thank you for your feedback!';
        } catch (error) {
            submissionStatus.value = 'An error occurred. Please try again later.';
        }

        // Clear submission status message after a delay
        setTimeout(() => {
            submissionStatus.value = null;
        }, 5000);
    };
</script>

<style scoped>
    .user-feedback {
        padding: 20px;
    }

    .input-group {
        margin-bottom: 15px;
    }

    label {
        display: block;
        margin-bottom: 5px;
    }

    input,
    textarea {
        width: 100%;
        padding: 8px;
        box-sizing: border-box;
    }

    button {
        padding: 10px 20px;
        background-color: #42b983;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    button:hover {
        background-color: #369870;
    }

    .submission-status {
        margin-top: 20px;
        padding: 10px;
        background-color: #f9f9f9;
        border-left: 4px solid #42b983;
    }
</style>
