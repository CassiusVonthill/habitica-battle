import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        user: {
            name: '',
            groups: ['party'],
            challenges: []
        },
        targetChallenge: {
            name: '',
            members: []
        },
        targetGroupOne: {
            name: '',
            avg: 0,
            members: []
        },
        targetGroupTwo: {
            name: '',
            avg: 0,
            members: []
        },
        authenticated: false
    },
    mutations: {
        addUserData(state, newUser) {
            state.user.name = newUser.profile.name
            state.user.groups.concat(newUser.guilds)
            state.user.challenges = newUser.challenges
            state.authenticated = true
        },
        setAuthenticated(state, val) {
            state.authenticated = val
        }
    },
    actions: {
        getUser(commit, userID, apiToken) {
            this.$api.setOptions({ id: userID, apiToken: apiToken })

            this.$api
                .get('/user')
                .then(res => {
                    commit('addUserData', res.data)
                    return [
                        'sucess',
                        'Your credentials check out, please wait as we process some data...'
                    ]
                })
                .catch(err => {
                    return ['error', err.message]
                })
        }
    },
    getters: {}
})
