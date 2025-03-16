<template>
    <!-- Decorative background only -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <!-- Back stripe -->
        <div class="stripe stripe-back bg-red-600" />
        <!-- Middle stripe -->
        <div class="stripe stripe-middle bg-red-600" />
        <!-- Front stripe -->
        <div class="stripe stripe-front bg-red-600" />
    </div>
</template>

<script setup lang="ts">
// purely presentational
</script>

<style scoped>
.stripe {
    position: absolute;
    left: -30%;
    width: 200%;
    height: 35vh;
    transform-origin: center center;
    box-shadow: 0 20px 30px rgba(0, 0, 0, 0.2);
}

.stripe-back {
    bottom: 0;
    transform: translateY(40%) rotate(-30deg);
}

.stripe-middle {
    bottom: 0;
    transform: translateY(-5%) rotate(-30deg);
}

.stripe-front {
    bottom: 0;
    transform: translateY(-50%) rotate(-30deg);
}

/* Tablet and larger screens */
@media (min-width: 768px) {
    .stripe {
        height: 38vh;
    }

    .stripe-back {
        transform: translateY(30%) rotate(-32deg);
    }

    .stripe-middle {
        transform: translateY(-10%) rotate(-32deg);
    }

    .stripe-front {
        transform: translateY(-50%) rotate(-32deg);
    }
}

/* Large screens */
@media (min-width: 1280px) {
    .stripe {
        height: 40vh;
    }
}
</style>
