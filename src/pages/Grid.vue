<template>
  <div class="q-pa-md q-gutter-sm">
    <q-editor v-model="defaultContent" min-height="5rem" @input="onChanged" ref="editor"/>

    <q-card flat bordered>
      <q-card-section>
        <pre style="white-space: pre-line">{{ defaultContent }}</pre>
      </q-card-section>
    </q-card>
    <q-card flat bordered>
      <q-card-section v-html="defaultContent" />
      <q-popup-edit value="sdf" title="Edit the Name">
        <q-input  dense autofocus counter />
      </q-popup-edit>
    </q-card>
    <q-input type="number" v-model="position">
    </q-input>
    <div>{{ text }}</div>
  </div>
</template>
<script>
import VanillaCaret from 'vanilla-caret-js'
export default {
  data () {
    return {
      defaultContent: 'What you see is <b>what</b> you get.',
      caret: null,
      editor: null,
      position: 0,
      text: ''
    }
  },
  methods: {
    strBeforeTheCaret () {
      // this.editor.focus()
      let _range = document.getSelection().getRangeAt(0)
      let range = _range.cloneRange()
      range.selectNodeContents(this.editor)
      range.setEnd(_range.endContainer, _range.endOffset)
      return range.toString()
    },
    onChanged () {
      console.log(this.caret.getPos())
      this.text = this.strBeforeTheCaret()
      if (this.text.endsWith('@') || this.text.endsWith('#')) {
        console.log('triggered')
      }
    }
  },
  computed: {
  },
  mounted () {
    let _this = this
    this.$nextTick(() => {
      _this.editor = _this.$refs.editor.$el.children[1]
      _this.caret = new VanillaCaret(_this.editor)
    })
  }
}
</script>
