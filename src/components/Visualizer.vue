<template>
    <div>
        <div v-if="mode === 'line'">
            <line-visualizer />
        </div>
        <div v-else-if="mode === 'bar'">
            <bar-visualizer />
        </div>
    </div>
</template>

<script>
import LineVisualizer from '@/components/LineVisualizer'
import BarVisualizer from '@/components/BarVisualizer'
export default {
    props: ['mode'],
    components: {
        LineVisualizer,
        BarVisualizer
    }
}
</script>

<style lang="scss" scoped></style>
