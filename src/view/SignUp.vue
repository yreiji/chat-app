<template>
    <v-app>
        <div class="login-box">
            <v-card class="login-form">
                <v-card-title class="login-title">Sign Up</v-card-title>
                <v-card-subtitle>ユーザー情報をご入力ください</v-card-subtitle>
                <v-btn text color="light-blue" to="login">ログイン画面はこちら</v-btn> <!---toプロップスで遷移先を指定-->

                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-text-field v-model="name" :rules="nameRules" label="Name" required></v-text-field>
                    <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
                    <v-text-field v-model="password" :rules="passwordRules" label="Password" type="password" ></v-text-field> <!--type=passwordは入力値が黒丸になる-->

                    <v-btn color="success" class="login-btn" @click="signUp" :disabled="isValid"> <!--isValidがtrueなら非活性-->
                        SIGN UP
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
            v => !!v || 'E-mail is required', //必須チェック
            v => /.+@.+\..+/.test(v) || 'E-mail is invalid', //形式チェック
        ],
        password: '',
        passwordRules: [
            v => !!v || 'Password is required', //必須チェック
            v => (v && v.length >= 6) || 'Password must be more than 6 characters', //形式チェック
        ],
        message: '',
        errorMessage: ''
    }),
    computed: {
        // btnの活性化処理
        isValid() {
            return !this.valid
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
        // 新規ユーザ作成
        signUp() {
            firebase.auth()
            .createUserWithEmailAndPassword(this.email, this.password)
            .then(async (response) => {
                // レスポンスのユーザ名は空なので更新しとく
                await response.user.updateProfile({displayName: this.name})
                console.log("sign up success", response.user)
                // localStorageにメッセージを保存
                localStorage.message = 'Sign up is success'

                // Login画面へリダイレクト
                this.$router.push({ path:'/login' })
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