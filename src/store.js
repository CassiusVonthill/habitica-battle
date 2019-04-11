import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        userName: '',
        userGroups: ['party'],
        userChallenges: [],
        targetChallenge: '',
        targetGroupOne: '',
        targetGroupTwo: '',
        authenticated: false,

    },
    mutations: {
        addUserData(state, newUser) {
            state.userName = newUser.data.profile.name
            state.userChallenges = newUser.data.challenges
            state.userGroups.concat(newUser.data.guilds)
        },
        setAuthenticated(state, val) {
            state.authenticated = val
        },
        setAuthenticated(state) {
            setAuthenticated(state, true)
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
