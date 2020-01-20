<template>
  <div>
    <q-select
      :options="options"
      v-model="selected"
      bottom-slots
      clearable
      use-chips
      dense
      multiple
      use-input
      options-dense
      hide-dropdown-icon
      option-value="key"
      option-label="text"
      :readonly="disable"
      @new-value="manualInput"
      @blur="onLostFocus"
      @add="filterAdd"
      @remove="filterRemoveInSelect"
      @focus="popup=false"
      @clear="filterClear"
      ref="_filter"
      >
      <template #append>
        <q-btn icon="search" flat dense @click="onSearch"/>
        <q-btn icon="info" flat dense/>
      </template>
      <template #hint>
        <div :class="{ 'text-negative': hasError }">{{ hint }}</div>
      </template>
      <template #option="props">
        <q-item v-on="props.itemEvents" v-bind="props.itemProps" dense >
          <q-item-section avatar>
            <q-icon v-if="props.opt.icon" :name="props.opt.icon" color="primary"/>
          </q-item-section>
          <q-item-section>
            <div>{{ props.opt.text }}<span class="text-italic text-weight-light" v-if="props.opt.default">(默认属性)</span></div>
          </q-item-section>
        </q-item>
      </template>
      <template #selected-item="props">
        <q-chip class="text-caption" dense removable @remove="filterRemove(props)" :disable="disable" v-show="props.opt._done">
          <q-icon v-if="props.opt.icon" :name="props.opt.icon" color="primary"/>
          <div class="text-primary">{{ props.opt.text }}</div><strong><div class="text-secondary">:{{ props.opt.input_display }}</div></strong>
        </q-chip>
      </template>
    </q-select>
    <div>
      <q-menu
      ref="_popup"
      :auto-close="false"
      no-parent-event
      persistent
      fit
      v-model="popup"
      @show="disable=true"
      @hide="popupHidden"
      max-width="100px"
      >
      <q-card class="q-pa-sm" v-if="popup">
        <div class="q-pb-sm">
          <div >
            <span class="text-bold">{{ optionInEditing.text }}</span>
            <span v-if="popup_input">  {{ popup_input }}</span>
          </div>
        </div>
        <q-separator />
          <q-form autofocus @submit="popupOK">
        <div class="q-pt-sm row items-end justify-around">
          <div class="col-9">
          <div v-if="optionInEditing.behavior === 'radio'" >
            <q-radio v-for="item in optionInEditing.option.items" v-bind:key="item.k" :val="item.k" :label="item.v" v-model="popup_input"/>
          </div>
          <div  v-if="optionInEditing.behavior === 'selection_kv'" >
            <q-select bottom-slots ref="popup_select" @add="popupSelectAdded" clearable filled :multiple="optionInEditing.option.multiple" v-model="popup_input" emit-value map-options dense options-dense use-input @filter="popupFilterFn" option-label="v" option-value="k" :options="popup_option">
               <template v-slot:no-option>
                <q-item>
                <q-item-section class="text-italic text-grey">
                  无符合条件的选项
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:hint>
            <div>请在此选择或输入查询条件<span class="text-info" v-if="optionInEditing.option.multiple">(可多选, 该属性匹配所选任意值)</span></div>
          </template>
          </q-select>
        </div>
        <div  v-if="optionInEditing.behavior === 'selection_value'">
          <q-select bottom-slots ref="popup_select" @add="popupSelectAdded" clearable filled :multiple="optionInEditing.option.multiple" v-model="popup_input" emit-value dense options-dense use-input @filter="popupFilterFn" :options="popup_option"
          :rules="[
            val => {String(Object.values(val)); true}
          ]"
          >
             <template v-slot:no-option>
              <q-item>
              <q-item-section class="text-italic text-grey">
                无符合条件的选项
            </q-item-section>
          </q-item>
        </template>
         <template v-slot:hint>
          <div>请在此选择或输入查询条件<span class="text-info" v-if="optionInEditing.option.multiple">(可多选, 该属性匹配所选任意值)</span></div>
        </template>
          </q-select>
        </div>
        <div v-if="optionInEditing.behavior === 'date'">
            <q-input filled v-model="popup_input" mask="date" :rules="['date']">
              <template #append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" trnasition-hide="scale">
                    <q-date v-model="popup_input" @input="() => $refs.qDateProxy.hide()" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
        </div>
        </div>
        <div class="col-auto">
          <q-btn label="完成" color="primary" type="submit" :disable="!isPopupInputValid"/>
          <q-btn label="取消" color="secondary" v-close-popup />
        </div>
        </div>
        </q-form>
      </q-card>
    </q-menu>
      </div>

  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    value: Array,
    data: Array
  },
  data () {
    return {
      selected: [],
      options: this.data,
      disable: false,
      popup: false,
      popup_option: [],
      popup_confirmed: false,
      popup_input: null,
      hasError: false,
      hint: '请点击此处选取属性并输入条件或在弹出框中维护它的过滤条件; 直接输入文本作为默认属性的过滤条件. 输入过滤条件时用竖线(|)表示“或”',
      optionInEditing: {},
      idxInEditing: null,
      defaultFilter: {}
      // data: [
      //   { 'text': '标签', 'icon': 'tag', 'key': 'tags', 'behavior': 'selection_value', 'option': { 'type': 'multiple', 'items': ['A类项目', '外省', '明确意向'] } },
      //   { 'text': '订单', 'key': 'order_id', 'behavior': 'input', 'type': 'number', 'default': true },
      //   { 'text': '员工', 'key': 'user_id', 'behavior': 'input', 'type': 'number' },
      //   { 'text': '状态', 'key': 'status', 'behavior': 'selection_kv', 'option': { 'multiple': true, 'items': [ { 'k': 'complete', 'v': '完成' }, { 'k': 'wip', 'v': '投产' }, { 'k': 'confirmed', 'v': '确认' } ] } },
      //   { 'text': '生效', 'key': 'isValid', 'behavior': 'radio', 'option': { 'items': [{ 'k': true, 'v': '是' }, { 'k': false, 'v': '否' }], 'default': true } }
      // ],
    }
  },
  computed: {
    computed_selected () {
      return this.selected ? this.selected.filter(i => i._done === true).map(x => { return { 'key': x.key, 'input': x.input } }) : []
    },
    isPopupInputValid () {
      if (!this.popup_input || this.popup_input === '') {
        return false
      } else {
        if (this.popup_input instanceof Array) {
          return this.popup_input.length > 0
        } else {
          if (this.popup_input instanceof Object) {
            return Object.keys(this.popup_input).length > 0
          } else {
            return true
          }
        }
      }
    }
  },
  mounted () {
    console.log('MOUNTED')
    this.options = this.data
    this.defaultFilter = this.data.find(x => x.default)
  },
  watch: {
    selected (val) {
      if (!val) {
        this.selected = []
        val = []
      }
      this.options = this.data.filter(o => !val.map(i => i.key).includes(o.key))
    }
  },
  methods: {
    onSearch () {
      if (this.selected.filter(item => item._done).length !== 0) {
        this.$emit('search')
      }
    },
    popupSelectAdded () {
      this.$nextTick(() => {
        this.$refs.popup_select.updateInputValue('')
      })
    },
    popupFilterFn (val, update) {
      if (val === '') {
        update(() => {
          this.popup_option = this.optionInEditing.option.items
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        if (this.optionInEditing.behavior === 'selection_kv') {
          this.popup_option = this.optionInEditing.option.items.filter(kv => kv.k.toLowerCase().indexOf(needle) > -1 || kv.v.toLowerCase().indexOf(needle) > -1)
        } else {
          this.popup_option = this.optionInEditing.option.items.filter(i => i.toLowerCase().indexOf(needle) > -1)
        }
      },
      ref => {
        if (val !== '' && ref.options.length > 0 && ref.optionIndex === -1) {
          // DO NOT use setmoveOptionSelection or toggleOption with fill-input
          ref.moveOptionSelection() // focus the first selectable option
          ref.toggleOption(ref.options[ref.optionIndex], true) // toggle the focused option
        }
      }
      )
    },
    popupOK () {
      console.log(this.popup_input)
      this.popup_confirmed = true
      this.popup = false
      this.optionInEditing.input = this.popup_input
      if (!(this.popup_input instanceof Array)) {
        if (this.optionInEditing.option.items && this.optionInEditing.option.items[0] instanceof Object) {
          const kv = this.optionInEditing.option.items.find(x => x.k === this.popup_input)
          this.optionInEditing.input_display = kv.v
        } else {
          this.optionInEditing.input_display = this.popup_input
        }
      } else {
        if (this.optionInEditing.option.items[0] instanceof Object) {
          const valueList = this.popup_input.map(k => this.optionInEditing.option.items.find(kv => kv.k === k).v)
          this.optionInEditing.input_display = valueList.join(', ')
        } else {
          this.optionInEditing.input_display = this.popup_input.join(', ')
        }
      }
      this.optionInEditing._done = true
      this.optionInEditing = {}
      this.$emit('input', this.computed_selected)
    },
    popupHidden () {
      this.popup = false
      this.disable = false
      if (!this.popup_confirmed && Object.keys(this.optionInEditing).length !== 0) {
        this.optionInEditing = {}
        this.$refs._filter.removeAtIndex(this.idxInEditing)
      }
    },
    onLostFocus () {
      if (Object.keys(this.optionInEditing).length !== 0 && this.optionInEditing.behavior === 'input') {
        this.optionInEditing = {}
        this.$refs._filter.removeAtIndex(this.idxInEditing)
      }
    },
    filterClear () {
      this.$emit('input', this.computed_selected)
    },
    filterAdd (key) {
      key.value.input = ''
      key.value._done = false
      this.popup_confirmed = false
      this.optionInEditing = key.value
      this.idxInEditing = key.index
      this.$refs._filter.updateInputValue('')
      this.$refs._filter.hidePopup()
      this.popup_input = null
      switch (key.value.behavior) {
        case 'input':
          this.popup_input = ''
          this.$refs._filter.focus()
          this.$refs._filter.updateInputValue(`${key.value.text}: `)
          break
        case 'radio':
          if (this.optionInEditing.option.default) {
            this.popup_input = this.optionInEditing.option.default
          }
          this.popup = true
          break
        case 'selection_kv':
          this.popup_option = this.optionInEditing.option.items
          if (this.optionInEditing.option.default) {
            this.popup_input = this.optionInEditing.option.default
          }
          this.popup = true
          break
        case 'selection_value':
          if (this.optionInEditing.option.default) {
            this.popup_input = this.optionInEditing.option.default
          }
          this.popup = true
          break
        case 'date':
          this.popup_input = ''
          if (this.optionInEditing.option.default) {
            this.popup_input = this.optionInEditing.option.default
          }
          this.popup = true
          break
      }
      this.$nextTick(() => {
        for (let i = 0; i < key.index; i++) {
          if (!this.selected[i]._done) {
            this.$refs._filter.removeAtIndex(i)
            this.idxInEditing = this.idxInEditing - 1
          }
        }
      })
    },
    filterRemove (key) {
      this.$refs._filter.removeAtIndex(key.index)
      this.$emit('input', this.computed_selected)
    },
    filterRemoveInSelect (key) {
      if (this.selected[key.index]._done) {
        this.$nextTick(() => {
          this.$emit('input', this.computed_selected)
        })
      }
    },
    manualInput (val, done) {
      const [name, input] = val.split(': ')
      if (name && Object.keys(this.optionInEditing).length !== 0 && name === this.optionInEditing.text) {
        if (input) {
          const idx = this.selected.findIndex(x => x.text === name)
          this.selected[idx].input = input
          this.selected[idx].input_display = input
          this.selected[idx]._done = true
          this.$emit('input', this.computed_selected)

          this.optionInEditing = {}
          this.$refs._filter.updateInputValue('')
        } else {
          this.$refs._filter.focus()
          this.$refs._filter.hidePopup()
        }
      } else {
        var idx = this.selected.findIndex(x => x.default)
        if (Object.keys(this.optionInEditing).length !== 0 && !this.optionInEditing.default) {
          this.optionInEditing = {}
          this.$refs._filter.removeAtIndex(this.idxInEditing)
        }
        if (idx === -1) {
          this.$refs._filter.updateInputValue('')
          this.selected.push({ ...this.defaultFilter, ...{ 'input': val, 'input_display': val, '_done': true } })
          this.$emit('input', this.computed_selected)

          // done({ ...this.defaultFilter, ...{ 'input': val } }, 'add')
        } else {
          this.$refs._filter.updateInputValue('')
          // this.selected[idx] = this.defaultFilter
          this.selected[idx].input = val
          this.selected[idx].input_display = val
          this.selected[idx]._done = true
          this.$emit('input', this.computed_selected)

          // done()
        }
      }
    }
  }
}
</script>
