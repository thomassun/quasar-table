<template>
  <div class="q-pa-md">
    <q-chip clickable color="purple" label="Account Settings" ref="chip">
      <q-menu>
        <div class="row no-wrap q-pa-md">
          <div class="column">
            <div class="text-h6 q-mb-md">Settings</div>
            <q-toggle v-model="mobileData" label="Use Mobile Data" />
            <q-toggle v-model="bluetooth" label="Bluetooth" />
          </div>
          <q-separator vertical inset class="q-mx-lg" />
          <div class="column items-center">
            <q-avatar size="72px">
              <img src="https://cdn.quasar.dev/img/avatar4.jpg">
            </q-avatar>
            <div class="text-subtitle1 q-mt-md q-mb-xs">John Doe</div>
            <q-btn
              color="primary"
              label="Logout"
              push
              size="sm"
              v-close-popup
            />
          </div>
        </div>
      </q-menu>
    </q-chip>
    <q-btn @click="click" label="click me" />
  </div>
</template>

<script>
export default {
  // name: 'PageName',
  methods: {
    click () {
      this.$refs.chip.$el.click()
    }
  }
}
</script>
