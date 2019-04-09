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
            if (this.$refs.authForm.validate()) {
                console.log(this.userID)
                console.log(this.apiToken)
                // this.$api.setOptions({
                //     id: userID,
                //     apiToken: apiToken
                // })
            }
        }
    }
}
</script>

<style lang="css" scoped></style>
