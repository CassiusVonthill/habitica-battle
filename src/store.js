import Vue from 'vue'
import Vuex from 'vuex'
var Habitica = require('habitica')

Vue.use(Vuex)

var api = new Habitica()

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
            state.user.groups = [...newUser.guilds, 'party']
            state.user.challenges = newUser.challenges
            state.authenticated = true
        },
        setAuthenticated(state, val) {
            state.authenticated = val
        }
    },
    actions: {
        getUser(context, { userID, apiToken }) {
            return new Promise((resolve, reject) => {
                api.setOptions({ id: userID, apiToken: apiToken })

                api.get('/user')
                    .then(res => {
                        context.commit('addUserData', res.data)
                        resolve(
                            'Your credentials check out, please wait as we process some data...'
                        )
                    })
                    .catch(err => {
                        reject(err.message)
                    })
            })
        },
        // Assumes that all data for the target params has been previously gathered
        battle(context, { targetGroupOne, targetGroupTwo, targetChallenge }) {
            let getMembersInChallenge = groupMembers =>
                groupMembers.filter(member => targetChallenge.has(member))

            let [gOneChallengeMembers, gTwoChallengeMembers] = [
                (targetGroupOne, targetGroupTwo)
            ].map(group => getMembersInChallenge(group.members))

            let intersectionMembers = gOneChallengeMembers.filter(member =>
                gTwoChallengeMembers.has(member)
            )

            let uniqueGroupOneMembers = gOneChallengeMembers.filter(
                member => !intersectionMembers.has(member)
            )

            let uniqueGroupTwoMembers = gTwoChallengeMembers.filter(
                member => !intersectionMembers.has(member)
            )
        }
    },
    getters: {}
})
