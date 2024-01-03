<template>
    <v-app id="inspire">
        <sidebar />
        <v-app-bar app shrink-on-scroll>
            <v-app-bar-nav-icon></v-app-bar-nav-icon>

            <v-toolbar-title>Room List</v-toolbar-title>
            <CreateRoom />

            <v-spacer></v-spacer>

            <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
        </v-app-bar>

        <v-main>
            <v-container>
                <v-row>
                    <v-col v-for="room in rooms" :key="room.id" cols="4">
                        <v-card height="200">
                            <router-link :to="{path:'/chat', query:{room_id: room.id}}">
                                <v-avatar color="grey lighten-2" size="83">
                                    <v-img :src="room.thumbnailUrl" alt="thumnail" v-if="room.thumbnailUrl"></v-img>
                                    <v-img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="default" v-if="!room.thumbnailUrl"></v-img>
                                </v-avatar>
                            </router-link>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import Sidebar from '/src/components/layout/Sidebar.vue'
import CreateRoom from '/src/components/modal/CreateRoom.vue'
import firebase from '/src/firebase/firebase'

export default {
    components: {
        Sidebar,
        CreateRoom,
    },
    data: () => ({
        rooms: []
    }),
    async mounted() {
        //firebaseからroomを取得
        const roomRef = firebase.firestore().collection("rooms") //collectionを取得
        const snapshot = await roomRef.get() //collection配下をObjectで取得
        snapshot.docs.map(doc => {
            // const data = {
            //     name: doc.data().name,
            //     thumbnail: doc.data().thumbnail,
            //     createdAt: doc.data().createdAt,
            // }
            const data = {...doc.data()} //スプレッド構文
            data.id = doc.id
            console.log(data)
            this.rooms.push(data)
        })
    }
}
</script>