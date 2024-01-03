<template>
    <v-app id="inspire">
        <sidebar />
        <v-main>
            <h1>{{ room ? room.name : '' }}</h1>
            <v-container class="py-8 px-6" fluid>
                <v-row>
                    <v-col v-for="card in cards" :key="card" cols="12">
                        <v-card>
                            <v-list lines="two">
                                <v-list-subheader :title="card"></v-list-subheader>

                                <template v-for="(outputMessage, index) in outputMessages" :key="index">
                                    <v-list-item>
                                        <template v-slot:prepend>
                                            <v-avatar color="grey-darken-1">
                                                <v-img :src="outputMessage.photoUrl"></v-img>
                                            </v-avatar>
                                        </template>

                                        <v-list-item-subtitle>
                                            {{ outputMessage.message }}
                                        </v-list-item-subtitle>
                                        </v-list-item>

                                    <v-divider v-if="n !== 6" :key="`divider-${n}`" inset></v-divider>
                                </template>
                            </v-list>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
            <v-textarea
              prepend-inner-icon="mdi-comment"
              class="mx-2"
              label="type your messages"
              rows="1"
              v-model="inputMessage"
            ></v-textarea>
            <v-btn @click="submitMessage" :disabled="invalid" block>submit</v-btn>
        </v-main>
    </v-app>
</template>


<script>
import firebase from '/src/firebase/firebase'
import Sidebar from '/src/components/layout/Sidebar.vue'

export default {
    name: 'Chat',
    components: {
        Sidebar,
    },
    data: () => ({
        invalid: true,
        user: null,
        room: null,
        roomId: '',
        inputMessage: '',
        outputMessages: [],
        cards: ['Today',],
    }),
    // 初期化処理、DOM使用不可、this使用可
    async created() {
        // パラメータroom_idを取得
        this.roomId = this.$route.query.room_id
        console.log(this.roomId)

        // room_idを確認
        const roomRef = firebase.firestore().collection("rooms").doc(this.roomId)
        const roomDoc = await roomRef.get() //ルームドキュメントを取得
        if (!roomDoc.exists) { //ルームドキュメントが存在しないならTOPへリダイレクト
            await this.$router.push("/room-list")
        }

        // ルーム情報を取得
        this.room = roomDoc.data()
        console.log("room", this.room)
    },
    mounted() {
        this.user = JSON.parse(sessionStorage.getItem('user'))

        //DBのリアルタイム更新
        const roomRef = firebase.firestore().collection("rooms").doc(this.roomId)
        roomRef.collection("messages").orderBy("createdAt", "asc")
        .onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => { //change = 新しいメッセージ
                console.log("new message", change.doc.data())
                this.outputMessages.push(change.doc.data())
            })
        })
    },
    computed: {
        invalid() {
            if(!this.inputMessage) {
                return true
            } else {
                return false
            }
        }
    },
    methods: {
        submitMessage() {
            //メッセージをDBに保存
            const roomRef = firebase.firestore().collection("rooms").doc(this.roomId)
            roomRef.collection("messages").add({
                message: this.inputMessage,
                name: this.user.displayName,
                photoUrl: this.user.photoURL,
                createdAt: firebase.firestore.Timestamp.now()
            })
            .then(result => {
                console.log("success", result)
                this.inputMessage = ''
            })
            .catch(error => {
                console.log("fail", error)
                alert("メッセージの送信に失敗しました")
            })
        }
    },
}
</script>

<style scoped>
</style>