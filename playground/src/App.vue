<script setup lang="ts">
import { TOKENS, tokenVar } from '@froq/ui/core'
import * as flat from '@froq/ui/flat'
import * as paper from '@froq/ui/paper'
import * as term from '@froq/ui/term'
import { ref, watchEffect } from 'vue'

type Theme = 'system' | 'light' | 'dark'
type Tone = 'quiet' | 'plain' | 'loud'

const themes = [
  { value: 'system', label: 'system' },
  { value: 'light', label: 'light' },
  { value: 'dark', label: 'dark' },
] as const

const tones = [
  { value: 'quiet', label: 'quiet' },
  { value: 'plain', label: 'plain' },
  { value: 'loud', label: 'loud' },
] as const

const swatches = TOKENS.filter(name => !name.startsWith('font') && !['ease', 'dur', 'radius'].includes(name))

const theme = ref<Theme>('system')
const tone = ref<Tone>('plain')
const sound = ref(false)
const grid = ref(true)
const mono = ref(false)

watchEffect(() => {
  const root = document.documentElement
  if (theme.value === 'system')
    delete root.dataset.theme
  else
    root.dataset.theme = theme.value
})
</script>

<template>
  <main class="demo">
    <header class="demo-head ui-flat">
      <div>
        <h1>froq / ui</h1>
        <p>One set of logic and tokens. Three surfaces to put it on.</p>
      </div>
      <flat.Choice
        v-model="theme"
        label="Theme"
        :options="[...themes]"
      />
    </header>

    <section class="demo-scope ui-paper">
      <h2>paper</h2>
      <p class="demo-note">
        Ink on paper. Serif for voice, one accent, a pen line that moves.
      </p>
      <div class="demo-row">
        <paper.Choice
          v-model="tone"
          label="Tone"
          :options="[...tones]"
        />
      </div>
      <div class="demo-row">
        <paper.ChoiceCircle
          v-model="tone"
          label="Tone"
          :options="[...tones]"
        />
      </div>
      <p class="demo-sentence">
        Read it in <paper.Toggle
          v-model="mono"
          label="Typeface"
          off-label="serif"
          on-label="mono"
        /> and with the grid <paper.Toggle
          v-model="grid"
          label="Grid"
          off-label="hidden"
          on-label="shown"
        />.
      </p>
      <div class="demo-tokens">
        <span
          v-for="name in swatches"
          :key="name"
          class="demo-swatch"
          :style="{ '--swatch': `var(${tokenVar(name)})` }"
        >{{ name }}</span>
      </div>
    </section>

    <section class="demo-scope ui-flat">
      <h2>flat</h2>
      <p class="demo-note">
        No metaphor. Neutral surfaces and a blue accent, for the projects that do not have a voice yet.
      </p>
      <div class="demo-row">
        <flat.Choice
          v-model="tone"
          label="Tone"
          :options="[...tones]"
        />
      </div>
      <div class="demo-row">
        <flat.Toggle
          v-model="sound"
          label="Sound"
          off-label="Sound off"
          on-label="Sound on"
        />
        <flat.Toggle
          v-model="grid"
          label="Grid"
        />
      </div>
      <div class="demo-tokens">
        <span
          v-for="name in swatches"
          :key="name"
          class="demo-swatch"
          :style="{ '--swatch': `var(${tokenVar(name)})` }"
        >{{ name }}</span>
      </div>
    </section>

    <section class="demo-scope ui-term">
      <h2>term</h2>
      <p class="demo-note">
        A terminal. Monospace, no radius, no easing. The choice is typed on the command line.
      </p>
      <div class="demo-row">
        <term.Choice
          v-model="tone"
          label="tone"
          prefix=":set tone="
          :options="[...tones]"
        />
      </div>
      <div class="demo-row">
        <term.Toggle
          v-model="sound"
          label="sound"
        />
        <term.Toggle
          v-model="grid"
          label="grid"
          off-label="nogrid"
          on-label="grid"
        />
      </div>
      <div class="demo-tokens">
        <span
          v-for="name in swatches"
          :key="name"
          class="demo-swatch"
          :style="{ '--swatch': `var(${tokenVar(name)})` }"
        >{{ name }}</span>
      </div>
    </section>

    <p class="demo-state ui-flat">
      tone={{ tone }} sound={{ sound }} grid={{ grid }} mono={{ mono }}
    </p>
  </main>
</template>
