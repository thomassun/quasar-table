<template>
  <div class="q-pa-md">
    <div>
      <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
    </div>
    <div>
      {{ editorData }}
    </div>
  </div>
</template>

<script>
import CKEditor from '@ckeditor/ckeditor5-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
export default {
  components: {
    ckeditor: CKEditor.component
  },
  data () {
    return {
      editor: ClassicEditor,
      editorData: '<p>Content of the editor.</p>',
      editorConfig: {
        mention: {
          feeds: [
            {
              marker: '@',
              feed: [
                {
                  id: '@Barney',
                  name: '张三'
                },
                {
                  id: '@Marshall',
                  name: '王某某'
                }
              ],
              minimumCharacters: 0,
              itemRenderer: this.customItemRenderer
            },
            {
              marker: '#',
              feed: ['#客户1', '#客户2'],
              minimumCharacters: 0
            }

          ]
        }
      }
    }
  },
  methods: {
    customItemRenderer (item) {
      const itemElement = document.createElement(('span'))
      itemElement.classList.add('custom-item')
      itemElement.id = `mention-list-item-id-${item.id}`
      itemElement.textContent = `${item.name} `

      const usernameElement = document.createElement('span')

      usernameElement.classList.add('custom-item-username')
      usernameElement.textContent = `(${item.id.substr(1)})`

      itemElement.appendChild(usernameElement)

      return itemElement
    }
  }
}
</script>
