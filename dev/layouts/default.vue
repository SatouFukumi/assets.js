<template>
    <div class="expander">
        <link rel="stylesheet" href="http://localhost:5500/styles/main.css" />
        <Navigation />
        <div id="__nuxt-content">
            <NuxtLink to="/schedule" data-href="/schedule">hello</NuxtLink>
            <NuxtLink to="/schedule#na" data-href="#na">bruh</NuxtLink>
            <NuxtPage />
        </div>
    </div>
</template>


<style lang='scss' scoped>
</style>


<script setup lang='ts'>
</script>
