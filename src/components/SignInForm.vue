<template>
    <div>
        <v-alert v-if="alert.type" :value="alert.msg" :type="alert.type">{{
            alert.msg
        }}</v-alert>
        <v-form lazy-validation v-model="validForm" ref="authForm">
            <v-text-field
                v-model="userID"
                label="User ID"
                :counter="36"
                :rules="authRules"
                required
            ></v-text-field>
            <v-text-field
                v-model="apiToken"
                label="API Token"
                :counter="36"
                :rules="authRules"
                required
                type="password"
            ></v-text-field>

            <v-btn
                :loading="isLoading"
                :disabled="!validForm"
                color="purple"
                @click="authenticate"
                >Authenticate</v-btn
            >
        </v-form>
    </div>
</template>

<script>
export default {
    name: 'SignInForm',

    data() {
        return {
            isLoading: null,
            alert: {
                msg: '',
                type: ''
            },
            validForm: true,
            userID: '',
            apiToken: '',
            authRules: [
                v => !!v || 'Field is required',
                v => (v && v.length == 36) || 'Field must be 36 characters',
                v =>
                    !RegExp('[^A-Za-z0-9-]').test(v) ||
                    'Field can only contain alphanumeric and dash (-) characters'
            ]
        }
    },

    methods: {
        authenticate() {
            if (
                this.$refs.authForm.validate() &&
                this.userID !== '' &&
                this.apiToken !== ''
            ) {
                this.isLoading = true
                this.$store
                    .dispatch('getUser', {
                        userID: this.userID,
                        apiToken: this.apiToken
                    })
                    .then(res => {
                        this.alert = { type: 'success', msg: res }
                    })
                    .then(() => {
                        this.$router.push({ name: 'dashboard' })
                    })
                    .catch(err => {
                        this.alert = { type: 'error', msg: err }
                    })
                this.isLoading = false
            }
        }
    }
}
</script>

<style lang="css" scoped></style>
