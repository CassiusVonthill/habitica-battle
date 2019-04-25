<template>
  <v-container>
    <v-layout>
      <v-flex>
        <v-card>
          <challenge-form/>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex>
        <v-card>Hello World</v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import ChallengeForm from '@/components/ChallengeForm'
import { mapState } from 'vuex'

export default {
    name: 'Dashboard',
    components: {
        ChallengeForm
    },
    computed: {
        ...mapState(['targetChallenge', 'targetGroups'])
    }
}
</script>

<style scoped></style>
