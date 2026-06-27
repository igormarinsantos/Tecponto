<script setup>
import { Menu, Moon, Sun } from '@lucide/vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSessionStore } from '../../stores/session'

const emit = defineEmits(['toggle-sidebar'])
const route = useRoute()
const session = useSessionStore()

const title = computed(() => route.meta?.title || 'TecPonto')
</script>

<template>
  <header class="sticky top-0 z-20 flex h-[68px] shrink-0 items-center gap-3 border-b border-[var(--tp-border)] bg-[var(--tp-card)] px-4 sm:px-6">
    <button
      class="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[var(--tp-border)] text-[var(--tp-text)] lg:hidden"
      type="button"
      aria-label="Abrir menu"
      @click="emit('toggle-sidebar')"
    >
      <Menu class="h-5 w-5" />
    </button>

    <div class="min-w-0 flex-1">
      <p class="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--tp-text-secondary)]">TecPonto</p>
      <h1 class="truncate text-lg font-bold leading-tight text-[var(--tp-text)]">{{ title }}</h1>
    </div>

    <button
      class="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[var(--tp-border)] text-[var(--tp-text-secondary)] transition hover:border-[var(--tp-border-strong)] hover:text-[var(--tp-text)]"
      type="button"
      :aria-label="session.theme === 'dark' ? 'Tema claro' : 'Tema escuro'"
      @click="session.toggleTheme()"
    >
      <Sun v-if="session.theme === 'dark'" class="h-5 w-5" />
      <Moon v-else class="h-5 w-5" />
    </button>
  </header>
</template>
