<template>
    <v-container fluid>
        <v-form lazy-validation v-model="valid" ref="challengeForm">
            <v-combobox
                v-model="selectedChallenge"
                :items="challengeOptions"
                label="Select the Challenge"
                :counter="36"
                :rules="authRules"
                dense
            ></v-combobox>
            <v-combobox
                v-model="selectedGroupOne"
                :items="groupOptions"
                label="Select the first group"
                :counter="36"
                :rules="authRules"
                dense
            ></v-combobox>
            <v-combobox
                v-model="selectedGroupTwo"
                :items="groupOptions"
                label="Select the second group"
                :counter="36"
                :rules="authRules"
                dense
            ></v-combobox>

            <v-btn :disabled="!valid" color="purple" @click="battle"
                >Battle!</v-btn
            >
        </v-form>
    </v-container>
</template>

<script>
export default {
    name: 'ChallengeForm',

    data() {
        return {
            valid: true,
            selectedChallenge: '',
            challengeOptions: [],
            selectedGroupOne: '',
            selectedGroupTwo: '',
            groupOptions: [],
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
        battle() {
            if (
                this.$refs.challengeForm.validate() &&
                this.selectedChallenge !== '' &&
                this.selectedGroupOne !== '' &&
                this.selectedGroupTwo !== ''
            ) {
                console.log('Battling!')
            }
        }
    }
}
</script>

<style scoped></style>
