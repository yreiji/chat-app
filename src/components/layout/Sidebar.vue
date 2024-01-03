<template>
      <v-navigation-drawer v-model="drawer">
        <v-sheet color="grey-lighten-4" class="pa-4">
          <v-avatar class="mb-4" color="grey-darken-1" size="64">
            <input type="file" ref="fileInput" @change="updateIcon" accept="image/jpef, image/ipg, image/png, image/jpg" style="display:none">
            <v-icon dark @click="changeIcon" v-if="!photoUrl">mdi-account-circle</v-icon>
            <img :src="photoUrl" @click="changeIcon" v-if="photoUrl">
          </v-avatar>
          <div>{{ user && user.displayName }}</div>
        </v-sheet>

        <v-divider></v-divider>

        <v-list>
          <v-list-item
            v-for="[icon, text, link] in links" :key="icon" :prepend-icon="icon" :title="text" :to="link">
          </v-list-item>

          <!--ログアウトメニュー-->
          <v-list-item prepend-icon="mdi-logout" title="logout" @click="logout">
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
</template>

<script>
import firebase from '/src/firebase/firebase'

export default {
  name: 'Sidebar',
  data: () => ({
    drawer: null,
    user: null,
    photoUrl: '',
    links: [
      ['mdi-inbox-arrow-down', 'Inbox', '/room-list'],
      ['mdi-send', 'Send', '/chat'],
      ['mdi-delete', 'Trash', '/'],
      ['mdi-alert-octagon', 'Span', '/'],
    ],
  }),
  mounted() {
    // セッションからユーザ情報取得
    this.user = JSON.parse(sessionStorage.getItem('user'))
    this.photoUrl = this.user.photoURL
  },
  methods: {
    changeIcon() {
      this.$refs.fileInput.click()
    },
    updateIcon() {
      //先ずはユーザ認証を確認
      const user = this.getAuth()
      if (!user) {
        sessionStorage.removeItem('user')
        this.$router.push('/login')
      }

      //ファイルをアップロード
      const file = this.$refs.fileInput.files[0]
      const filePath = `/user/${file.name}`
      firebase.storage().ref().child(filePath).put(file)
        .then(async snapshot => {
          const photoUrl = await snapshot.ref.getDownloadURL()

          // const user = this.getAuth()
          // if (!user) {
          //   user.updateProfile({photoURL: photoUrl})
          //   this.user.photoURL = photoUrl
          //   sessionStorage.setItem('user', JSON.stringify(this.user))
          //   this.photoUrl = photoUrl
          // }
          firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              console.log(photoUrl)
              user.updateProfile({photoURL: photoUrl})
              this.user.photoURL = photoUrl
              sessionStorage.setItem('user', JSON.stringify(this.user))
              this.photoUrl = photoUrl
            }
          })
        })
    },
    getAuth() {
      return firebase.auth().onAuthStateChanged((user) => {
          return user
      })
    },
    logout() {
      firebase.auth()
          .signOut()
          .then(async (response) => {
              // localStorageにメッセージを保存
              localStorage.message = 'Logout is success'

              // Login画面へリダイレクト
              this.$router.push({ path:'/login' })
          })
          .catch((error) => {
              console.log("error", error)
              this.errorMessage = error.message;
          });
    }
  }
}
</script>