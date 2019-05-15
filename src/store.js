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
            tasks: {
                todos: [],
                dailys: [],
                habits: []
            }
        },
        targetGroups: [
            {
                name: '',
                id: '',
                avg: null,
                memberCount: null,
                completionCount: null
            },
            {
                name: '',
                id: '',
                avg: null,
                memberCount: null,
                completionCount: null
            }
        ],
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
            // TODO: grab ID
            state.targetChallenge.name = challengeData.name
            state.targetChallenge.memberCount = challengeData.memberCount
            state.targetChallenge.tasks.todos = challengeData.tasksOrder.todos
            state.targetChallenge.tasks.dailys = challengeData.tasksOrder.dailys
            state.targetChallenge.tasks.habits = challengeData.tasksOrder.habits
        },
        addGroupData(state, [groupData, index]) {
            let temp = {
                // TODO: grab ID
                name: groupData.name,
                memberCount: groupData.memberCount
            }
            state.targetGroups[index] = {
                ...state.targetGroups[index],
                ...temp
            }
        },
        setGroupAvg(state, [val, id]) {
            state.targetGroups[id].avg = val
        },
        setCompletionCount(state, [val, id]) {
            state.targetGroups[id].completionCount = val
        },
        setGroupCompletionAvgs(state) {
            state.targetGroups = state.targetGroups.map(group => {
                group.avg = group.completionCount / group.memberCount
                return group
            })
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
        async getChallenge({ commit, state }, challengeID) {
            console.log('Getting Challenge')
            // Don't grab information if we have it
            if (state.targetChallenge.id !== challengeID) {
                let challengeDataResponse = await api.get(
                    `/challenges/${challengeID}`
                )
                commit('addChallengeData', challengeDataResponse.data)
            }
            console.log('Finished getting challenge')
        },
        async getGroup({ commit, state }, [groupID, index, challengeId]) {
            console.log(`Getting group ${index}`)
            // Don't get information again if we have it
            if (state.targetGroups[index].id !== groupID) {
                let groupDataResponse = await api.get(`/groups/${groupID}`)
                commit('addGroupData', [groupDataResponse.data, index])

                let continueLoop = true
                let lastId = ''
                let completionCount = 0
                do {
                    let memberResponse = await api.get(
                        `/groups/${groupID}/members` +
                            (lastId !== '' ? `?lastId=${lastId}` : '')
                    )
                    let newMemberIDs = memberResponse.data.map(
                        member => member.id
                    )
                    let memberCompletions = await Promise.all(
                        newMemberIDs.map(memberId =>
                            api.get(
                                `/challenges/${challengeId}/members/${memberId}`
                            )
                        )
                    )
                    let memberCompletionCounts = memberCompletions.map(
                        res =>
                            res.data.tasks.filter(task => task.completed).length
                    )
                    completionCount += memberCompletionCounts.reduce(
                        (acc, x) => acc + x
                    )

                    // Loop variables
                    lastId = newMemberIDs[newMemberIDs.length - 1]
                    continueLoop = newMemberIDs.length === 30
                } while (continueLoop)
                commit('setCompletionCount', [completionCount, index])
            }
            console.log(`Finished getting group ${index}`)
        },
        battle: async function(
            { dispatch, commit },
            [targetGroupOneId, targetGroupTwoId, targetChallengeId]
        ) {
            console.log('In battle')
            // Make sure we have the correct data and deal with it
            // Fail fast because we need all the information for it to work
            await Promise.all([
                dispatch('getGroup', [targetGroupOneId, 0, targetChallengeId]),
                dispatch('getGroup', [targetGroupTwoId, 1, targetChallengeId])
            ]).catch(err => {
                console.log('Error aggregating data')
                return Promise.reject(err)
            })
            console.log('after dispatch')

            commit('setGroupCompletionAvgs')

            console.log('Battle computation ended')
        }
    },
    getters: {
        isAuthenticated: state => state.authenticated
    }
})
