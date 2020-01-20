<template>
  <q-layout view="lHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          icon="menu"
          aria-label="Menu"
        />

        <q-toolbar-title>
          My Application
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-2"
    >
      <q-list>
        <q-item-label header>Essential Links</q-item-label>
        <q-item clickable tag="a" to="/">
          <q-item-section avatar>
            <q-icon name="school" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Home</q-item-label>
            <q-item-label caption>Go home</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" to="/calendar">
          <q-item-section avatar>
            <q-icon name="code" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Calendar</q-item-label>
            <q-item-label caption>Calendar</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" to="/order">
          <q-item-section avatar>
            <q-icon name="code" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Order</q-item-label>
            <q-item-label caption>Order</q-item-label>
          </q-item-section>
        </q-item>

      </q-list>
    </q-drawer>
    <q-drawer v-model="rightDrawerOpen"   side="right" overlay elevated>
      <div class="q-pa-md" id="popupDrawer">
        asdfasf
        adf
        adf
        adsf
        asdfasf
      {{ rightDrawerContent }}
      </div>
    </q-drawer>
    <q-page-container v-on:mentionClicked.capture="onMentioned">
      <keep-alive include="Order">
        <router-view />
      </keep-alive>
    </q-page-container>
  </q-layout>
</template>

<script>
// import Vue from 'vue'
// import { QAvatar } from 'quasar'
export default {
  name: 'MyLayout',

  data () {
    return {
      leftDrawerOpen: false,
      rightDrawerOpen: false,
      rightDrawerContent: ''
    }
  },
  methods: {
    onMentioned (e) {
      this.rightDrawerContent = e.detail
      this.rightDrawerOpen = !this.rightDrawerOpen
      //     const Constr = Vue.extend({
      //       template: `
      // <q-avatar size="23px">
      //   <img src="https://cdn.quasar.dev/img/avatar.png">
      // </q-avatar>
      // `,
      //       components: {
      //         'q-avatar': QAvatar
      //       }
      //     })
      //     new Constr().$mount('#popupDrawer')
      //     console.log(e)
    }
  }
}
</script>
