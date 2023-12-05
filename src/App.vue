<template>
  <div>App根组件</div>
  <router-link to="/login">Login</router-link>
  <router-link to="/">Home</router-link>
  <router-link to="/404">404</router-link>
  <hr />
  <router-view />
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped></style>
