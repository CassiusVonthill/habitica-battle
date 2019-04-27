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
        targetGroups: [
            {
                name: '',
                id: '',
                avg: 0,
                memberCount: null,
                members: []
            },
            {
                name: '',
                id: '',
                avg: 0,
                memberCount: null,
                members: []
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
        addGroupData(state, { groupData, index }) {
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
            state.targetGroups[id] = val
        },
        appendGroupMembers(state, { index, members }) {
            state.targetGroups[index].members.push(members)
        },
        appendChallengeMembers(state, members) {
            state.targetChallenge.members.push(members)
        },
        flattenGroupMembers(state, index) {
            state.targetGroups[index].members = state.targetGroups[
                index
            ].members.flat()
        },
        flattenChallengeMembers(state) {
            state.targetChallenge.members = state.targetChallenge.members.flat()
        },
        emptyGroupMembers(state, index) {
            state.targetGroups[index].members = []
        },
        emptyChallengeMembers(state) {
            state.targetChallenge.members = []
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
            console.log('Getting Challege')
            if (state.targetChallenge.id != challengeID) {
                // Cleanup previous information
                commit('emptyChallengeMembers')

                let challengeDataResponse = await api.get(
                    `/challenges/${challengeID}`
                )
                commit('addChallengeData', challengeDataResponse.data)

                let newMemberIDs = []
                let lastId = ''
                do {
                    let memberResponse = await api.get(
                        `/challenges/${challengeID}/members` +
                            (lastId != '' ? `?lastId=${lastId}` : '')
                    )
                    newMemberIDs = memberResponse.data.map(member => member.id)
                    commit('appendChallengeMembers', newMemberIDs)
                    lastId = newMemberIDs[newMemberIDs.length - 1]
                } while (newMemberIDs.length == 30)
                commit('flattenChallengeMembers')
            }
            console.log('Finished getting challenge')
        },
        async getGroup({ commit, state }, { groupID, index }) {
            console.log(`Getting group ${index}`)
            if (state.targetGroups[index].id != groupID) {
                // Cleanup previous information
                commit('emptyGroupMembers', index)

                let groupDataResponse = await api.get(`/groups/${groupID}`)
                commit('addGroupData', {
                    groupData: groupDataResponse.data,
                    index: index
                })

                let newMemberIDs = []
                let lastId = ''
                do {
                    let memberResponse = await api.get(
                        `/groups/${groupID}/members` +
                            (lastId != '' ? `?lastId=${lastId}` : '')
                    )
                    newMemberIDs = memberResponse.data.map(member => member.id)
                    commit('appendGroupMembers', {
                        index: index,
                        members: newMemberIDs
                    })
                    lastId = newMemberIDs[newMemberIDs.length - 1]
                } while (newMemberIDs.length == 30)
                commit('flattenGroupMembers', index)
            }
            console.log(`Finished getting group ${index}`)
        },
        async getAverageCompletion(state, { members }) {
            let completions = await Promise.all(
                members.map(memberId => {
                    api.get(
                        `/challenges/${
                            state.targetChallenge
                        }/members/${memberId}`
                    ).then(res => {
                        // TODO: grab and sum all the completions from the object
                        let completedTasks = res.data.tasks.filter(
                            task => task.completed
                        )

                        return completedTasks.length()
                    })
                })
            )
            return (
                completions.reduce((acc, x) => acc + x, 0) / completions.length
            )
        },
        async battle(
            { state, dispatch, commit },
            [targetGroupOneId, targetGroupTwoId, targetChallengeId]
        ) {
            console.log('In battle')
            // Make sure we have the correct data and deal with it
            // Fail fast because we need all the information for it to work
            await Promise.all([
                dispatch('getChallenge', targetChallengeId),
                dispatch('getGroup', {
                    groupID: targetGroupOneId,
                    index: 0
                }),
                dispatch('getGroup', {
                    groupID: targetGroupTwoId,
                    index: 1
                })
            ])
            console.log('after dispatch')

            // Get members in each group that are in the challenge
            let groupChallengeMembers = state.targetGroups.map(group => {
                group.members.filter(member =>
                    state.targetChallenge.members.includes(member)
                )
            })
            // Intersection group members
            let intersectionMembers = groupChallengeMembers[0].filter(member =>
                groupChallengeMembers[1].includes(member)
            )
            //  Symettric difference group members
            let uniqueGroupMembers = groupChallengeMembers.map(group =>
                group.members.filter(
                    member => !intersectionMembers.includes(member)
                )
            )
            // Grab the completion status of each unique member in each group
            // average the group
            let averages = await Promise.all(
                uniqueGroupMembers.map(group =>
                    dispatch('getAverageCompletion', {
                        members: group.members
                    })
                )
            )

            averages.forEach((val, index) =>
                commit('setGroupAvg', [val, index])
            )
        }
    },
    getters: {
        isAuthenticated: state => state.authenticated
    }
})
