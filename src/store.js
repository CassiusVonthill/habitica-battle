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
        }
    },
    getters: {}
})
