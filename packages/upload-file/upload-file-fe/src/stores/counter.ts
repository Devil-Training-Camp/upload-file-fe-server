import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useUploadFileStore = defineStore('uploadFile', () => {
  let controller: AbortController;
  const isUploading = ref<boolean>(false);

  const changeUploadState = (state: boolean) => {
    isUploading.value = state;
  };

  const getController = () => {
    controller = new AbortController();
    return controller;
  };

  const abortUpload = () => {
    controller.abort();
  };

  return { getController, abortUpload, changeUploadState, isUploading };
});
