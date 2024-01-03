<template>
    <v-row justify="center">
        <v-dialog v-model="dialog" persistent width="1024">
            <template v-slot:activator="{ props }">
                <v-btn color="primary" v-bind="props">
                    Creat New Room
                </v-btn>
            </template>
            <v-card>
                <v-card-title>
                    <span class="text-h5">Creat New Room</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field label="Room Name*" v-model="name" required></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-file-input truncate-length="15" accept="image/*" v-model="file"></v-file-input>
                            </v-col>
                        </v-row>
                    </v-container>
                    <small>*indicates required field</small>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
                        Close
                    </v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="onSubmit">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import firebase from '/src/firebase/firebase'


export default {
    data: () => ({
        name: '',
        file: '',
        dialog: false,
    }),
    methods: {
        async onSubmit() {
            let thumbnailUrl = ""
            //storageにファイルをアップロード
            if(this.file) {
                const filePath = `/room/${this.file.name}`
                await firebase.storage().ref().child(filePath).put(this.file)
                .then(async snapshot => {
                    thumbnailUrl = await snapshot.ref.getDownloadURL()
                })
            }

            //roomコレクションにデータを追加
            const roomRef = firebase.firestore().collection("rooms")
            await roomRef.add({
                name: this.name,
                thumbnailUrl: thumbnailUrl,
                createdAt: firebase.firestore.Timestamp.now()
            })
            .then(result => {
                console.log("success to create room", result)
                this.dialog = false
            })
    },
    }
}
</script>