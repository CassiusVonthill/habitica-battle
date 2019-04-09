<template>
    <v-form
        lazy-validation
        v-model="valid"
        ref='user-pass-form'
    >
        <v-text-field
            label='User ID'
            :counter="36"
            :rules="authRules"
            required
        ></v-text-field>
        <v-text-field
            label='API Token'
            :counter="36"
            :rules="authRules"
            required
        ></v-text-field>

        <v-btn
            :disabled="!valid"
            color="purple"
        >
            Authenticate
        </v-btn>
    </v-form>
</template>

<script>
export default {
  name: 'SignInForm',

  data () {
    return {
        valid: true,
        authRules: [
            v => !!v || 'Field is required',
            v => (v && v.length == 36) || 'Field must be 36 characters'
        ]
    }
  }
}
</script>

<style lang="css" scoped>
</style>
