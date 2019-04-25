<template>
    <v-container>
        <v-layout>
            <v-flex>
                <v-card>
                    <challenge-form />
                </v-card>
            </v-flex>
        </v-layout>
        <v-layout>
            <visualizer mode="line" />
        </v-layout>
    </v-container>
</template>

<script>
import ChallengeForm from '@/components/ChallengeForm'
import Visualizer from '@/components/Visualizer'
import { mapState } from 'vuex'

export default {
    name: 'Dashboard',
    components: {
        ChallengeForm,
        Visualizer
    },
    computed: {
        ...mapState(['targetChallenge', 'targetGroups'])
    }
}
</script>

<style scoped></style>
