<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import Sidebar from '/src/components/layout/Sidebar.vue'

export default {
  name: 'App',

  components: {
    Sidebar,
  },
}
</script>
