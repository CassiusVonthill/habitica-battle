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
            id: '',
            memberCount: null,
            members: [],
            tasks: {
                todos: [],
                dailys: [],
                habits: []
            }
        },
        targetGroupOne: {
            name: '',
            id: '',
            avg: 0,
            memberCount: null,
            members: []
        },
        targetGroupTwo: {
            name: '',
            id: '',
            avg: 0,
            memberCount: null,
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
        },
        addChallengeData(state, challengeData) {
            state.targetChallenge.name = challengeData.name
            state.targetChallenge.memberCount = challengeData.memberCount
            state.targetChallenge.tasks.todos = challengeData.tasksOrder.todos
            state.targetChallenge.tasks.dailys = challengeData.tasksOrder.dailys
            state.targetChallenge.tasks.habits = challengeData.tasksOrder.habits
        },
        addGroupData(state, { groupData, id }) {
            let temp = {
                name: groupData.name,
                memberCount: groupData.memberCount
            }
            switch (id) {
                case 1:
                    state.targetGroupOne = temp
                    break
                case 2:
                    state.targetGroupTwo = temp
                    break
                default:
                    throw 'id variable must be a 1 or a 2 to match the target group!'
            }
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
        getChallenge(context, challengeID) {
            api.get('/challenges' + challengeID).then(res => {
                context.commit('addChallengeData', {
                    challengeData: res.data
                })
            })
        },
        getGroup(context, { groupID, id }) {
            api.get('/groups/' + groupID).then(res => {
                context.commit('addGroupData', {
                    groupData: res.data,
                    id: id
                })
            })
        },
        getMemberCompletion(state, { member }) {
            api.get(
                `/challenges/${state.targetChallenge}/members/${member}`
            ).then(res => {
                // TODO: grab and sum all the completions from the object
                res.data
            })
        },
        async getAverageCompletion(dispatch, { members }) {
            let completions = await Promise.all(
                members.map(m => dispatch('getMemberCompletion', { member: m }))
            )
            return completions.reduce((acc, x) => acc + x) / completions.length
        },
        async battle(
            context,
            { targetGroupOne, targetGroupTwo, targetChallenge }
        ) {
            // Grab the data if needed
            context.dispatch('getChallenge', { challengeID: targetChallenge })
            context.dispatch('getGroup', { groupID: targetGroupOne, id: 1 })
            context.dispatch('getGroup', { groupID: targetGroupTwo, id: 2 })

            // Filters out the members in each group that are in the challenge
            let [groupOneChallengeMembers, groupTwoChallengeMembers] = [
                (targetGroupOne, targetGroupTwo)
            ].map(group =>
                group.members.filter(member =>
                    context.state.targetChallenge.members.has(member)
                )
            )

            // Basic set operations for oganization
            let intersectionMembers = groupOneChallengeMembers.filter(member =>
                groupTwoChallengeMembers.has(member)
            )
            let uniqueGroupOneMembers = groupOneChallengeMembers.filter(
                member => !intersectionMembers.has(member)
            )
            let uniqueGroupTwoMembers = groupTwoChallengeMembers.filter(
                member => !intersectionMembers.has(member)
            )

            // Grab the completion status of each unique member in each group
            let [avgOne, avgTwo] = await Promise.all(
                [uniqueGroupOneMembers, uniqueGroupTwoMembers].map(x =>
                    context.dispatch('getAverageCompletion', { members: x })
                )
            )
        }
    },
    getters: {}
})
