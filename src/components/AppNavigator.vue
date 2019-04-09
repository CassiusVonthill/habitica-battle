<template>
    <v-toolbar color="purple darken-4" dark dense scroll-off-screen app>
        <v-toolbar-title>
            Habitica Battles
            <span v-if="isDevEnv">(DEVELOPMENT)</span>
        </v-toolbar-title>
        <v-toolbar-items>
            <v-btn v-once flat small to="/wiki">Wiki</v-btn>
        </v-toolbar-items>
        <v-spacer></v-spacer>
        <v-toolbar-items>
            <v-btn v-once flat small>
                <v-icon color="white">mdi-refresh</v-icon>
            </v-btn>
        </v-toolbar-items>
    </v-toolbar>
</template>

<script>
export default {
    name: 'AppNavigator',
    data() {
        return {
            isDevEnv: process.env.NODE_ENV == 'development',
            isAuthenticated: false
        }
    }
}
</script>

<style lang="css" scoped>
a {
    color: white;
    text-decoration: none;
}
</style>
