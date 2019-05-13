<template>
    <div>
        <v-alert v-if="alert.type" :value="alert.msg" :type="alert.type">
            {{ alert.msg }}
        </v-alert>
        <v-form lazy-validation v-model="valid" ref="challengeForm">
            <v-layout row wrap align-center justify-space-between>
                <v-flex xs12 md3>
                    <v-combobox
                        v-model="selectedChallenge"
                        :items="challengeOptions"
                        label="Select the Challenge"
                        :counter="36"
                        :rules="authRules"
                        dense
                    ></v-combobox>
                </v-flex>
                <v-flex xs12 md3>
                    <v-combobox
                        v-model="selectedGroupOne"
                        :items="groupOptions"
                        label="Select the first group"
                        :counter="36"
                        :rules="authRules"
                        dense
                    ></v-combobox>
                </v-flex>
                <v-flex xs12 md3>
                    <v-combobox
                        v-model="selectedGroupTwo"
                        :items="groupOptions"
                        label="Select the second group"
                        :counter="36"
                        :rules="authRules"
                        dense
                    ></v-combobox>
                </v-flex>

                <v-flex xs12 md3>
                    <v-layout justify-center>
                        <v-flex>
                            <v-btn
                                :disabled="!valid"
                                color="purple"
                                @click="battle"
                                >Battle!</v-btn
                            >
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-form>
    </div>
</template>

<script>
export default {
    name: 'ChallengeForm',

    data: function() {
        return {
            alert: {
                type: '',
                msg: ''
            },
            valid: true,
            selectedChallenge: '',
            selectedGroupOne: '',
            selectedGroupTwo: '',
            challengeOptions: this.$store.state.user.challenges,
            groupOptions: this.$store.state.user.groups,
            authRules: [
                v => !!v || 'Field is required',
                v =>
                    (v && v.length == 36) ||
                    v === 'party' ||
                    'Field must be 36 characters',
                v =>
                    !RegExp('[^A-Za-z0-9-]').test(v) ||
                    'Field can only contain alphanumeric and dash (-) characters',
                v =>
                    !(
                        v in
                        [
                            '5481ccf3-5d2d-48a9-a871-70a7380cee5a', // Habitica Help: Ask a Question
                            'f2db2a7f-13c5-454d-b3ee-ea1f5089e601', // Party Wanted (Looking for Group)
                            '6e6a8bd3-9f5f-4351-9188-9f11fcd80a99', // Official New Year's Resolution Guild!
                            '68d4a01e-db97-4786-8ee3-05d612c5af6f', // Aspiring Blacksmiths (Coding for Habitica)
                            'a141a5b9-0d69-46cd-93e6-2b76f18bcc54', // Pixels in Progress (Aspiring Artists)
                            'a29da26b-37de-4a71-b0c6-48e72a900dac', // Report a Bug
                            '52f49529-58c1-4020-a59b-8bb8579e941f', // Aspiring Legends: Contributing to Habitica
                            '1d3a10bf-60aa-4806-a38b-82d1084a59e6', // Use Case Spotlights
                            'd6295936-7106-41d4-b90c-f22bdca3303b', // The Bulletin Board
                            '7732f64c-33ee-4cce-873c-fc28f147a6f7', // Commonwealth of i18n (Aspiring Linguists)
                            'db4819dd-0efb-4290-989c-9f7625b59a3a', // Party Wanted International
                            'b0764d64-8276-45a1-afa5-5ca9a5c64ca0', // Aspiring Socialites
                            '9a163b28-ebcf-4e52-87de-5c040ed0f8f8', // Wizards of the Wiki
                            '0393624e-65f0-40c1-8e87-360955fcebca', // Guild Leaders & Challenge Creators
                            '426c2c1a-eed0-4997-9b73-d30fc1397688', // The Back Corner
                            '2ff9822b-27f2-4774-98da-db349b57a38e', // Aspiring Comrades
                            '416f7007-7226-4beb-9897-56fffed93a07', // Pirate Cove
                            'ae985ab0-fcc3-410d-bdb3-ae4defe712bb', // Testimonials of Habitica
                            'a7d0a7c8-f1cf-4813-b841-75308003f611', // Elven Grove
                            '56052316-006d-4cc8-948a-d2b08669fbab' // The Pirate Ship's Log
                        ]
                    ) || 'Offical guilds not supported'
            ]
        }
    },

    methods: {
        async battle() {
            if (
                this.$refs.challengeForm.validate() &&
                this.selectedChallenge !== '' &&
                this.selectedGroupOne !== '' &&
                this.selectedGroupTwo !== '' &&
                this.selectedGroupOne !== this.selectedGroupTwo
            ) {
                console.log('Entering battle')
                this.valid = false
                await this.$store
                    .dispatch('battle', [
                        this.selectedGroupOne,
                        this.selectedGroupTwo,
                        this.selectedChallenge
                    ])
                    .catch(err => (this.alert = { type: 'error', msg: err }))
                this.valid = true
            } else {
                // alert that something is wrong with form inputs
                this.alert = {
                    type: 'error',
                    msg:
                        'Generic Error: Make sure your groups are different and fields are not empty'
                }
            }
        }
    }
}
</script>

<style scoped></style>
