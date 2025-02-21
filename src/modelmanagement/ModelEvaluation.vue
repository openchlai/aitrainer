<template>
    <div>
        <h2>Model Evaluation</h2>
        <p>Word Error Rate (WER): {{ evaluation.WER }}%</p>
        <p>BLEU Score: {{ evaluation.BLEU }}</p>
    </div>
</template>

<script setup>
    import { ref } from 'vue';

    const evaluation = ref({ WER: 5.3, BLEU: 0.85 });
</script>
