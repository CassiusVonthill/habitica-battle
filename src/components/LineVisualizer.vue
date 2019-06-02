<template>
    <div>
        <div>Hello Line</div>
        <div>Group 1 Avg: {{ groupOneAvg }}</div>
        <div>Group 2 Avg: {{ groupTwoAvg }}</div>
    </div>
</template>

<script>
export default {
    name: 'LineVisualizer',
    // data() {},
    computed: {
        groupOneAvg() {
            return this.$store.state.targetGroups[0].avg
        },
        groupTwoAvg() {
            return this.$store.state.targetGroups[1].avg
        }
    }
}
</script>

<style lang="scss" scoped></style>
