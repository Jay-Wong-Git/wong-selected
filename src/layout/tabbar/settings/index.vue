<template>
  <el-button size="small" icon="Refresh" circle></el-button>
  <el-button
    size="small"
    icon="FullScreen"
    circle
  ></el-button>
  <el-button size="small" icon="Setting" circle></el-button>
  <img
    src="/logo-site.png"
    style="width: 24px; height: 24px; margin: 0 10px"
    alt="avatar"
  />
  <el-dropdown>
        <span class="el-dropdown-link">
          admin
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>Logout</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped></style>
