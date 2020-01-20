<template>
  <q-page padding>
    <search-bar v-model="search" :data="data" @search="onSearch" />
  </q-page>
</template>

<script>
import SearchBar from 'components/SearchBar.vue'
export default {
  name: 'Order',
  components: {
    SearchBar
  },
  data () {
    return {
      data: [
        { 'text': '标签', 'icon': 'tag', 'key': 'tags', 'behavior': 'selection_value', 'option': { 'multiple': true, 'items': ['A类项目', '外省', '明确意向'] } },
        { 'text': '订单', 'key': 'order_id', 'behavior': 'input', 'type': 'number', 'default': true },
        { 'text': '员工', 'key': 'user_id', 'behavior': 'input', 'type': 'number' },
        { 'text': '状态', 'key': 'status', 'behavior': 'selection_kv', 'option': { 'multiple': true, 'items': [ { 'k': 'complete', 'v': '完成' }, { 'k': 'wip', 'v': '投产' }, { 'k': 'confirmed', 'v': '确认' } ] } },
        { 'text': '生效', 'key': 'isValid', 'behavior': 'radio', 'option': { 'items': [{ 'k': true, 'v': '是' }, { 'k': false, 'v': '否' }], 'default': true } },
        { 'text': '投产日期', 'key': 'working_date', 'behavior': 'date', 'option': { } }
      ],
      search: []
    }
  },
  methods: {
    onSearch () {
      console.log(this.search)
    }
  },
  watch: {
    search (val) {
      console.log(val)
    }
  }
}
</script>
