<template>
    <Script src="https://kit.fontawesome.com/b0b1bbd0d1.js"></Script>
    <div>
        <NuxtLink to="/schedule" data-href="/schedule" />
        <NuxtLink to="/" data-href="/" />
    </div>
</template>


<style lang='scss' scoped>
</style>


<script setup lang='ts'>
import navigation from "./../../ts/navigation"
if (typeof window !== "undefined") {
    window.setTimeout((): void => {
        navigation.init("#__nuxt", "#__nuxt-content")
        navigation.addComponent.logo()
        navigation.addComponent.button()
        navigation.addComponent.route([{ href: '/schedule' }, { href: '/' }], true)
        navigation.addComponent.hamburger().clicker.onClick((a): void => { console.log(a) })
        navigation.addComponent.account().avatar = 'https://www.2k5chik.site/guest.png'
    })
}
</script>
