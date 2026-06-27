<script setup>
import {
  Boxes,
  Circle,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Repeat2,
  Smartphone,
  Users,
  WalletCards,
} from '@lucide/vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import logoHorizontal from '../../assets/brand/logo-horizontal.png'
import { logout } from '../../api'
import { usePermissionsStore } from '../../stores/permissions'
import { useSessionStore } from '../../stores/session'

defineProps({ open: { type: Boolean, default: false } })
const emit = defineEmits(['close'])

const route = useRoute()
const permissions = usePermissionsStore()
const session = useSessionStore()

const icons = { Boxes, ClipboardList, LayoutDashboard, Repeat2, Smartphone, Users, WalletCards }
const sections = computed(() => permissions.navigation)

async function doLogout() {
  try {
    await logout()
  } catch (e) {
    // segue para o reload mesmo se a chamada falhar
  }
  window.location.reload()
}
</script>

<template>
  <button
    v-if="open"
    class="fixed inset-0 z-30 bg-black/50 lg:hidden"
    type="button"
    aria-label="Fechar navegação"
    @click="emit('close')"
  />

  <aside
    class="fixed inset-y-0 left-0 z-40 flex w-[264px] -translate-x-full flex-col bg-[var(--tp-sidebar)] text-white transition-transform duration-200 lg:translate-x-0"
    :class="{ 'translate-x-0': open }"
  >
    <div class="flex h-[68px] shrink-0 items-center px-5">
      <img class="h-7 w-auto brightness-0 invert" :src="logoHorizontal" alt="TecPonto" />
    </div>

    <nav class="flex-1 overflow-y-auto px-3 pb-4">
      <div v-for="(section, i) in sections" :key="i">
        <p
          v-if="section.label"
          class="px-3 pb-1 pt-5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/40"
        >
          {{ section.label }}
        </p>
        <RouterLink
          v-for="item in section.items"
          :key="item.to"
          :to="item.to"
          class="mb-0.5 flex items-center gap-3 rounded-[10px] px-3 py-2.5 transition"
          :class="
            route.path === item.to
              ? 'bg-[var(--tp-orange)] text-[var(--tp-on-orange)] shadow-[0_6px_18px_rgba(254,80,0,0.28)]'
              : 'text-white/80 hover:bg-white/10 hover:text-white'
          "
          @click="emit('close')"
        >
          <component :is="icons[item.icon] || Circle" class="h-[18px] w-[18px] shrink-0" />
          <span class="block min-w-0 flex-1 truncate text-sm font-semibold leading-tight">{{ item.label }}</span>
        </RouterLink>
      </div>
    </nav>

    <div class="shrink-0 border-t border-white/10 p-3">
      <div class="flex items-center gap-3 rounded-[10px] px-2 py-1.5">
        <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--tp-orange)] text-xs font-bold text-[var(--tp-on-orange)]">
          {{ session.initials }}
        </span>
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-semibold leading-tight">{{ session.fullName }}</p>
          <p class="truncate text-xs text-white/50">{{ permissions.profileLabel }}</p>
        </div>
        <button
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-white/60 transition hover:bg-white/10 hover:text-white"
          type="button"
          title="Sair"
          @click="doLogout"
        >
          <LogOut class="h-[18px] w-[18px]" />
        </button>
      </div>
    </div>
  </aside>
</template>
