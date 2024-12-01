<script setup lang="ts">
import UploadFileList from '../components/UploadFileList.vue';
import { ref, useTemplateRef } from 'vue';
import { splitFile, uploadChunkList } from '@/utils/file';
import { calMD5 } from '@/utils/hash';
import { hasFile, mergeChunkToFile } from '@/api';
import { useUploadFileStore } from '@/stores/counter';
const uploadFileStore = useUploadFileStore();
const inputRef = useTemplateRef('inputRef');
const percentage = ref<number>(0);

const getFiles = () => {
  inputRef.value!.value = '';
  inputRef.value?.click();
};
const fileList = ref<File[]>([]);
const filesChange = (e: Event) => {
  fileList.value = Array.from((e.target as HTMLInputElement).files || []);
  percentage.value = 0;
};
const uploadFile = async (isAbort?: boolean) => {
  if (fileList.value.length === 0) {
    ElMessage({
      message: '请先选择文件',
      type: 'warning'
    });
    return;
  }
  const controller = uploadFileStore.getController();
  uploadFileStore.changeUploadState(true);
  if (!isAbort) {
    percentage.value = 0;
  }
  console.log('file: ', fileList.value[0]);
  const chunkList = splitFile(fileList.value[0]);
  const fileHash = await calMD5(chunkList);
  console.log('fileHash: ', fileHash);
  try {
    const searchFileResult = await hasFile({ hash: fileHash }, controller.signal);
    if (searchFileResult.isExist) {
      uploadFileStore.changeUploadState(false);
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
      onTick(progress) {
        if (percentage.value > progress) return;
        percentage.value = progress;
      },
      signal: controller.signal
    });
    // 上传切片打断
    if (!uploadFileStore.isUploading) {
      return;
    }
    uploadFileStore.changeUploadState(false);
    console.log(result, ' res');
    if (result) {
      await mergeChunkToFile({ hash: fileHash }, controller.signal);
      ElMessage({
        message: '上传成功',
        type: 'success'
      });
    } else {
      ElMessage({
        message: '上传失败',
        type: 'error'
      });
    }
  } catch (error) {
    // 除了上传切片之外的打断
  }
};

const deleteFile = (index: number) => {
  fileList.value.splice(index, 1);
};

const pauseUploadFile = () => {
  console.log(uploadFileStore.isUploading);
  if (uploadFileStore.isUploading) {
    // 暂停操作
    uploadFileStore.abortUpload();
    uploadFileStore.changeUploadState(false);
  } else if (fileList.value.length === 0) {
    ElMessage({
      message: '当前不在上传',
      type: 'error'
    });
  } else {
    // 继续上传
    uploadFile(true);
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
    <UploadFileList :fileList="fileList" @delete-file="deleteFile" />
    <footer>
      <el-button type="primary" @click="uploadFile(false)">上传</el-button>
      <el-button type="warning" @click="pauseUploadFile">{{
        uploadFileStore.isUploading ? '暂停' : '继续'
      }}</el-button>
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
