import { defineStore } from 'pinia'
import { useSessionStore } from './session'

export const profiles = {
  atendente: 'Atendente',
  tecnico: 'Técnico',
  gestor: 'Gestor',
  admin: 'Admin/Direção',
}

// Navegação agrupada por setor (Repare / Troque / Compre / Apoio), como no
// posicionamento "Compre. Troque. Repare.". Cada item declara os perfis que o veem.
export const navSections = [
  {
    label: null,
    items: [
      { label: 'Visão geral', caption: 'O que precisa de você', to: '/', icon: 'LayoutDashboard', profiles: ['atendente', 'tecnico', 'gestor', 'admin'] },
    ],
  },
  {
    label: 'Repare',
    items: [
      { label: 'Ordens de serviço', caption: 'Consertos e garantias', to: '/ordens-de-servico', icon: 'ClipboardList', profiles: ['atendente', 'tecnico', 'gestor', 'admin'] },
      { label: 'Aparelhos', caption: 'Cadastro e histórico', to: '/aparelhos', icon: 'Smartphone', profiles: ['atendente', 'tecnico', 'gestor', 'admin'] },
    ],
  },
  {
    label: 'Troque',
    items: [
      { label: 'Avaliações de troca', caption: 'Usados e ofertas', to: '/trocas', icon: 'Repeat2', profiles: ['atendente', 'gestor', 'admin'] },
    ],
  },
  {
    label: 'Apoio',
    items: [
      { label: 'Clientes', caption: 'Pessoas atendidas', to: '/clientes', icon: 'Users', profiles: ['atendente', 'gestor', 'admin'] },
      { label: 'Peças e estoque', caption: 'Itens disponíveis', to: '/estoque', icon: 'Boxes', profiles: ['atendente', 'tecnico', 'gestor', 'admin'] },
      { label: 'Financeiro', caption: 'Caixa e faturamento', to: '/financeiro', icon: 'WalletCards', profiles: ['gestor', 'admin'] },
    ],
  },
]

export const usePermissionsStore = defineStore('permissions', {
  getters: {
    profile() {
      return useSessionStore().profile
    },
    profileLabel() {
      return profiles[this.profile] || profiles.atendente
    },
    // Setores com pelo menos um item visível ao perfil atual.
    navigation() {
      const profile = this.profile
      return navSections
        .map((section) => ({
          ...section,
          items: section.items.filter((item) => item.profiles.includes(profile)),
        }))
        .filter((section) => section.items.length > 0)
    },
    canSeeFinancial() {
      return ['gestor', 'admin'].includes(this.profile)
    },
    canManageSettings() {
      return this.profile === 'admin'
    },
    inventoryCanSeeCost() {
      return this.profile !== 'tecnico'
    },
    canAccessRoute() {
      return (route) => {
        const allowedProfiles = route.meta?.profiles
        if (!allowedProfiles?.length) return true
        return allowedProfiles.includes(this.profile)
      }
    },
  },
})
