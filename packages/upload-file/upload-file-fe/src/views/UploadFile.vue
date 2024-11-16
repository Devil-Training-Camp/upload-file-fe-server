<script setup lang="ts">
import UploadFileList from '../components/UploadFileList.vue';
import { ref, useTemplateRef } from 'vue';
import { splitFile, uploadChunkList } from '@/utils/file';
import { calMD5 } from '@/utils/hash';
import { hasFile, mergeChunkToFile } from '@/api';

const inputRef = useTemplateRef('inputRef');
const percentage = ref<number>(0);

const getFiles = () => {
  inputRef.value?.click();
};
const fileList = ref<File[]>([]);
const filesChange = (e: Event) => {
  fileList.value = Array.from((e.target as HTMLInputElement).files || []);
};
const uploadFile = async () => {
  if (fileList.value.length === 0) {
    ElMessage({
      message: '请先选择文件',
      type: 'warning'
    });
    return;
  }
  console.log('file: ', fileList.value[0]);
  const chunkList = splitFile(fileList.value[0]);
  const fileHash = await calMD5(chunkList);
  console.log('fileHash: ', fileHash);
  const searchFileResult = await hasFile({ hash: fileHash });
  if (searchFileResult.data.exist) {
    percentage.value = 100;
    ElMessage({
      message: '上传成功',
      type: 'success'
    });
    return;
  }
  const result = await uploadChunkList({
    chunkList,
    fileHash,
    onTick(progress){
      percentage.value = progress;
    }
  });
  if (result) {
    await mergeChunkToFile();
    ElMessage({
      message: '上传成功',
      type: 'success'
    });
  }else {
    ElMessage({
      message: '上传失败',
      type: 'error'
    });
  }
};
</script>

<template>
  <main class="wrapper">
    <el-button type="primary" @click="getFiles">
      <input type="file" class="input" ref="inputRef" @change="filesChange" />
      点击上传文件</el-button
    >
    <el-progress
      style="width: 90%"
      :percentage="percentage"
      :stroke-width="15"
      striped
      striped-flow
      status=""
    />
    <UploadFileList :fileList="fileList" />
    <footer>
      <el-button type="primary" @click="uploadFile">上传</el-button>
      <el-button type="warning">暂停</el-button>
    </footer>
  </main>
</template>

<style scoped lang="css">
.wrapper {
  width: 500px;
  height: 300px;
  border: 2px solid #fff;
  border-radius: 20px;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: space-evenly;
  padding: 10px 20px;
  margin-left: auto;
  margin-right: auto;
}
.input {
  display: none;
}
</style>
