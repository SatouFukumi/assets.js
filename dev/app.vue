<template>
  <div :style="style" data-dit-me="this is tooltip">
    <link rel="stylesheet" href="http://localhost:5500/styles/main.css" />
  </div>
</template>


<script setup lang="ts">
const style = {
  backgroundColor: "deeppink",
  height: "400px",
};
</script>
