<template>
  <div class="q-pa-md">
    <div>
<ckeditor :editor="editor" :config="initOption" v-model="editContent" :disabled="editorReadonly">
</ckeditor>
    </div>
    <div>
    </div>
    <div id="testDOM" ref="testDOM">
      <q-avatar size="24px" color="orange">
        <img src='https://cdn.quasar.dev/img/avatar.png'/>
      </q-avatar>
      <div>{{ editContent }}</div>
      <q-toggle v-model="editorReadonly"/>
    </div>
  </div>
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
// import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials'
// import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold'
// import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic'
// import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline'
// import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough'
// import Mention from '@ckeditor/ckeditor5-mention/src/mention'
// import Link from '@ckeditor/ckeditor5-link/src/link'
// import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph'
import CKEditor from '@ckeditor/ckeditor5-vue'
import MentionCustomization from '../statics/mentions'
export default {
  name: 'index',
  components: {
    'ckeditor': CKEditor.component
  },
  data () {
    return {
      editorReadonly: false,
      editContent: '',
      editor: ClassicEditor,
      initOption: {
        extraPlugins: [ MentionCustomization ],
        mention: {
          feeds: [
            {
              marker: '@',
              feed: [ { id: '@Barney', userId: 33, name: 'Barney Wang', link: '/grid' },
                { id: '@Zhang', userId: 199, name: 'Zhang San', link: '/grid' }
              ],
              minimumCharacters: 0
            }
          ]
        }
      }
    }
  },
  methods: {
  }
}
</script>
<style>
  :root {
    /* Make the mention background blue. */
    --ck-color-mention-background: hsla(220, 100%, 54%, 0.4);

    /* Make the mention text dark grey. */
    --ck-color-mention-text: hsl(0, 0%, 15%);
  }
</style>
