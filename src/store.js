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
        targetChallenge: '',
        targetGroupOne: {
            name: '',
            avg: 0
        },
        targetGroupTwo: {
            name: '',
            avg: 0
        },
        authenticated: false
    },
    mutations: {
        addUserData(state, newUser) {
            state.user.name = newUser.data.profile.name
            state.user.challenges = newUser.data.challenges
            state.user.groups.concat(newUser.data.guilds)
        },
        setAuthenticated(state, val) {
            state.authenticated = val
        },
        setAuthenticatedTrue(state) {
            this.setAuthenticated(state, true)
        }
    },
    actions: {
        userName: state => state.userName,
        userGroups: state => state.userGroups,
        userChallenges: state => state.userChallenges,
        targetChallenge: state => state.targetChallenge,
        targetGroupOne: state => state.targetGroupOne,
        targetGroupTwo: state => state.targetGroupTwo,
        authenticated: state => state.authenticated
    }
})
