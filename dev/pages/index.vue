<template>
    <div :style="style" class="lazy" title="this is tooltip">
    </div>
</template>


<script setup lang="ts">
import Lazyload from '../../ts/lazyload'

if (typeof window !== 'undefined') {
    const b: Lazyload = new Lazyload('https://www.2k5chik.site/guest.png', { objectFit: 'scale-down' })
    document.querySelector('.lazy')?.append(b.component)

    window.setTimeout((): string => b.source = 'https://www.2k5chik.site/favicon.png', 3000)
}
const style = {
    height: "400px",
};
</script>


<style lang="scss">
.lazy {
    background-color: deeppink;

    .lazyload {
        width: 50px;
        height: 50px;
    }
}
</style>
