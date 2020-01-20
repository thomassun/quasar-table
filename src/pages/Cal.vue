<template>
  <q-page padding>
    <file-pond
      name="test"
      ref="pond"
      maxFileSize="1MB"
      allowImagePreview="false"
      labelMaxFileSizeExceeded="文件太大啦"
      labelMaxFileSize="支持上传的最大文件为{filesize}"
      label-idle="将文件拖拽到此以上传..."
      :allow-multiple="true"
      accepted-file-types="image/jpeg, image/png"
      @updatefiles="handleFileUpload"
      @init="handleFilePondInit"/>
    <q-btn label="Upload" @click="startUpload" class="secondary"/>
  </q-page>
</template>

<script>
// Import Vue FilePond
import vueFilePond from 'vue-filepond'

// Import FilePond styles
import 'filepond/dist/filepond.min.css'

// Import FilePond plugins
// Please note that you need to install these plugins separately

// Import image preview plugin styles
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'

// Import image preview and file type validation plugins
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'

// Create component
const FilePond = vueFilePond(FilePondPluginFileValidateType, FilePondPluginImagePreview, FilePondPluginFileValidateSize)

export default {
  name: 'app',
  data: function () {
    return {
      myFiles: []
    }
  },
  methods: {
    handleFilePondInit: function () {
      console.log('FilePond has initialized')

      // FilePond instance methods are available on `this.$refs.pond`
    },
    handleFileUpload: file => {
      console.log(file)
    },
    startUpload () {
      const fileList = this.$refs.pond.getFiles()
      if (fileList.length > 0) {
        console.log(fileList[0].file.name)
      }

      // FilePond instance methods are available on `this.$refs.pond`
    }

  },
  components: {
    FilePond
  }
}
</script>
<style>
  .filepond--root {
    width: calc(50% - .5em);
    max-height: 15em;
  }
  .filepond--file {
    color: cadetblue;
  }
</style>
