<template>
    <v-app>
        <div class="login-box">
            <v-card class="login-form">
                <v-card-title class="login-title">Login</v-card-title>
                <v-card-subtitle>ユーザー情報をご入力ください</v-card-subtitle>
                <v-btn text color="light-blue" to="sign-up">新規登録はこちら</v-btn> <!---toプロップスで遷移先を指定-->

                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
                    <v-text-field v-model="password" label="Password" type="password"></v-text-field> <!--type=passwordは入力値が黒丸になる-->

                    <v-btn color="success" class="login-btn" @click="Login" :disabled="isValid"> <!--isValidがtrueなら非活性-->
                        LOGIN
                    </v-btn>
                    <v-btn @click="clear">CLEAR</v-btn>

                    <v-alert dense text type="success" class="success-message" v-if="message">
                        {{ message }}
                    </v-alert>
                    <v-alert dense outlined type="error" class="error-message" v-if="errorMessage">
                        {{ errorMessage }}
                    </v-alert>
                </v-form>
            </v-card>
        </div>
    </v-app>
</template>

<script>
import firebase from '/src/firebase/firebase'

export default {
    data: () => ({
        valid: true,
        name: '',
        nameRules: [
            v => !!v || 'Name is required',
            v => (v && v.length <= 10) || 'Name must be less than 10 characters',
        ],
        email: '',
        emailRules: [
            v => !!v || 'メールアドレスを入力してください', //必須チェック
            v => /.+@.+\..+/.test(v) || 'メールアドレスが不正です', //形式チェック
        ],
        password: '',
        message: '',
        errorMessage: ''
    }),
    computed: {
        // btnの活性化処理
        isValid() {
            return !this.valid
        }
    },
    mounted() {
        if(localStorage.message) {
            this.message = localStorage.message
            localStorage.message = ''
        }
    },
    methods: {
        validate() {
            this.$refs.form.validate()
        },
        reset() {
            this.$refs.form.reset()
        },
        resetValidation() {
            this.$refs.form.resetValidation()
        },
        // ログイン
        Login() {
            firebase.auth()
            .signInWithEmailAndPassword(this.email, this.password)
            .then((response) => {
                // レスポンスのユーザ名は空なので更新しとく
                console.log("login success", response)

                //セッション管理
                const user = {
                    displayName: response.user.displayName,
                    email: response.user.email,
                    uid: response.user.uid,
                    refreshToken: response.user.refreshToken,
                    photoURL: response.user.photoURL,
                }
                sessionStorage.setItem('user', JSON.stringify(user))

                // User一覧画面へリダイレクト
                this.$router.push({ path:'/user-list' })
            })
            .catch((error) => {
                console.log("error", error)
                this.errorMessage = error.message;
            });
        },
        clear() {
            this.email = ''
            this.password = ''
        },
    },
}
</script>

<style>
.login-box {
    margin: 0 auto;
}

.login-form {
    width: 500px;
    padding: 30px;
    text-align: center;
}

.login-title {
    display: inline-block
}

.login-btn {
    margin-right: 20px;
}

.error-message {
    margin-top: 20ex;
}

.success-message {
    margin-top: 20px;
}
</style>