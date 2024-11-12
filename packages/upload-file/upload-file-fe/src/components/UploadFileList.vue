
<script setup lang="ts">
import { Delete } from '@element-plus/icons-vue';
import prettysize from "prettysize";

const { fileList } = defineProps<{
  fileList?: File[]
}>()
</script>

<template>
  <div class="list">
    <div v-for="(item, index) in fileList" :key="index" class="item">{{ item.name + " -----该文件大小: " + prettysize(item.size) }} <el-button text :icon="Delete" size="small"></el-button></div>
  </div>
</template>

<style scoped>
.list {
  width: 100%;
  height: 150px;
  overflow-y: scroll;
}
.item {
  display: flex;
  justify-content: space-between;
  height: 24px;
}
</style>
