<template>
    <v-form lazy-validation v-model="valid" ref="authForm">
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

        <v-btn :disabled="!valid" color="purple" @click="authenticate"
            >Authenticate</v-btn
        >
    </v-form>
</template>

<script>
export default {
    name: 'SignInForm',

    data() {
        return {
            valid: true,
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
                this.$api.setOptions({
                    id: this.userID,
                    apiToken: this.apiToken
                })
                this.$api.get('/user').then(res => {
                    // There has to be a better way to do this.
                    // Surely we could pattern match or something?
                    let currentUser = new Object()
                    currentUser.id = res.data.id
                    currentUser.name = res.data.profile.name
                    currentUser.challenges = res.data.challenges
                    currentUser.guilds = [...res.data.guilds, 'party']
                })
            } else {
                console.log('User tried to authenticate')
            }
        }
    }
}
</script>

<style lang="css" scoped></style>
