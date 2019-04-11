<template>
    <v-app>
        <app-navigator></app-navigator>

        <v-content>
            <router-view />
        </v-content>

        <v-footer color="purple" app></v-footer>
    </v-app>
</template>

<script>
import AppNavigator from '@/components/AppNavigator'
// import Store from './store/store'


export default {
    components: {
        AppNavigator,
        // Store
    },
    name: 'App',
    data() {
        return {
            //
        }
    }
}
</script>
