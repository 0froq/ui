<script setup lang="ts">
import type { StyleName } from '@froq/ui/core'
import { scopeClass, STYLES } from '@froq/ui/core'
import { Choice as FlatChoice, Toggle as FlatToggle } from '@froq/ui/flat'
import { ChoiceCircle, Choice as PaperChoice, Toggle as PaperToggle } from '@froq/ui/paper'
import { Choice as TermChoice, Toggle as TermToggle } from '@froq/ui/term'
import { computed } from 'vue'

type Tone = 'quiet' | 'plain' | 'loud'
type DemoName = 'choice' | 'toggle' | 'circle'
type DemoKind
  = | 'paper-choice'
    | 'paper-circle'
    | 'paper-toggle'
    | 'flat-choice'
    | 'flat-toggle'
    | 'term-choice'
    | 'term-toggle'
    | 'missing'
    | 'invalid'

const props = defineProps<{
  skin: string
  name: string
}>()

const options: { value: Tone, label: string }[] = [
  { value: 'quiet', label: 'quiet' },
  { value: 'plain', label: 'plain' },
  { value: 'loud', label: 'loud' },
]

const tone = useState<Tone>('demo-tone', () => 'plain')
const on = useState('demo-on', () => false)

function isStyle(value: string): value is StyleName {
  return (STYLES as readonly string[]).includes(value)
}

function isName(value: string): value is DemoName {
  switch (value) {
    case 'choice':
    case 'toggle':
    case 'circle':
      return true
    default:
      return false
  }
}

function demoKind(skin: StyleName, name: DemoName): DemoKind {
  switch (name) {
    case 'circle':
      return skin === 'paper' ? 'paper-circle' : 'missing'
    case 'choice':
      switch (skin) {
        case 'paper':
          return 'paper-choice'
        case 'flat':
          return 'flat-choice'
        case 'term':
          return 'term-choice'
        default: {
          const neverSkin: never = skin
          return neverSkin
        }
      }
    case 'toggle':
      switch (skin) {
        case 'paper':
          return 'paper-toggle'
        case 'flat':
          return 'flat-toggle'
        case 'term':
          return 'term-toggle'
        default: {
          const neverSkin: never = skin
          return neverSkin
        }
      }
    default: {
      const neverName: never = name
      return neverName
    }
  }
}

const kind = computed(() => {
  if (!isStyle(props.skin) || !isName(props.name))
    return 'invalid'
  return demoKind(props.skin, props.name)
})

const frameClass = computed(() => isStyle(props.skin) ? scopeClass(props.skin) : undefined)
const readout = computed(() => props.name === 'toggle' ? String(on.value) : tone.value)
</script>

<template>
  <div
    class="demo-card"
    :class="frameClass"
  >
    <p
      v-if="kind === 'invalid'"
      class="demo-missing"
    >
      未知的演示：{{ skin }} / {{ name }}
    </p>
    <p
      v-else-if="kind === 'missing'"
      class="demo-missing"
    >
      ChoiceCircle 只有 paper 有。
    </p>
    <PaperChoice
      v-else-if="kind === 'paper-choice'"
      v-model="tone"
      label="Tone"
      :options="options"
    />
    <ChoiceCircle
      v-else-if="kind === 'paper-circle'"
      v-model="tone"
      label="Tone"
      :options="options"
    />
    <p
      v-else-if="kind === 'paper-toggle'"
      class="demo-sentence"
    >
      用 <PaperToggle
        v-model="on"
        label="声音"
        off-label="安静"
        on-label="有声"
      /> 读。
    </p>
    <FlatChoice
      v-else-if="kind === 'flat-choice'"
      v-model="tone"
      label="Tone"
      :options="options"
    />
    <FlatToggle
      v-else-if="kind === 'flat-toggle'"
      v-model="on"
      label="声音"
      off-label="声音关"
      on-label="声音开"
    />
    <TermChoice
      v-else-if="kind === 'term-choice'"
      v-model="tone"
      label="tone"
      prefix=":set tone="
      :options="options"
    />
    <TermToggle
      v-else-if="kind === 'term-toggle'"
      v-model="on"
      label="sound"
      off-label="off"
      on-label="on"
    />
    <p
      v-if="kind !== 'invalid' && kind !== 'missing'"
      class="demo-readout"
    >
      {{ readout }}
    </p>
  </div>
</template>
