<template>
    <v-app>
        <app-navigator></app-navigator>

        <v-content>
            <router-view />
        </v-content>
    </v-app>
</template>

<script>
import AppNavigator from '@/components/AppNavigator'

export default {
    components: {
        AppNavigator
    },
    name: 'App',
    data() {
        return {
            //
        }
    }
}
</script>
