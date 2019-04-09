<template>
    <v-container fill-height>
      <v-layout row wrap align-center>
        <v-flex style="height:100%" sm6 xs12>
          <v-card style="height:100%">
            <v-card-title primary-title>
              <div class="headline">Sign In</div>
            </v-card-title>
            <v-card-text>
                <SignInForm></SignInForm>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex style="height:100%" sm6 xs12>
          <v-card style="height:100%">
            <v-card-text id='welcome-text'>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
              quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
              proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
</template>

<script>
import SignInForm from '@/components/SignInForm';
export default {
    name: 'home',
    components: {
        SignInForm
    }
}
</script>

<style scoped>
#welcome-text {
    font-size: 20px;
}
</style>
