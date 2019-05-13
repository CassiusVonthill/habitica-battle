<template>
    <div>Hello Line</div>
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
