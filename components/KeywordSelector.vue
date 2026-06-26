<script setup lang="ts">
import { Icon, toastService } from '@admin'
import { computed, onMounted, ref } from 'vue'
import { keywordGroupService, type KeywordGroupKeyword } from '../services/keywordGroupService'
import { keywordService } from '../services/keywordService'

const props = defineProps<{
  groupId: number | string
  keywords: KeywordGroupKeyword[]
}>()

const emit = defineEmits<{
  (e: 'update:keywords', keywords: KeywordGroupKeyword[]): void
}>()

const allKeywords = ref<{ id: number; name: string }[]>([])
const search = ref('')
const isOpen = ref(false)
const isLoading = ref(false)

const availableKeywords = computed(() => {
  const existingIds = new Set(props.keywords.map((k) => k.id))
  const filtered = allKeywords.value.filter((k) => !existingIds.has(k.id))
  if (!search.value) return filtered
  const q = search.value.toLowerCase()
  return filtered.filter((k) => k.name.toLowerCase().includes(q))
})

const fetchAllKeywords = async () => {
  try {
    const { data } = await keywordService.getAll({ per_page: 9999 })
    allKeywords.value = data.data.map((k) => ({ id: k.id, name: k.name }))
  } catch {
    toastService.error('Hiba a kulcsszavak betöltésekor.')
  }
}

const attach = async (keyword: { id: number; name: string }) => {
  isLoading.value = true
  try {
    await keywordGroupService.attachKeyword(props.groupId, keyword.id)
    emit('update:keywords', [...props.keywords, { id: keyword.id, name: keyword.name }])
    search.value = ''
    isOpen.value = false
  } catch {
    toastService.error('Hiba a kulcsszó hozzáadásakor.')
  } finally {
    isLoading.value = false
  }
}

const detach = async (keyword: KeywordGroupKeyword) => {
  isLoading.value = true
  try {
    await keywordGroupService.detachKeyword(props.groupId, keyword.id)
    emit('update:keywords', props.keywords.filter((k) => k.id !== keyword.id))
  } catch {
    toastService.error('Hiba a kulcsszó eltávolításakor.')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchAllKeywords()
})
</script>

<template>
  <div class="space-y-3">
    <div v-if="keywords.length > 0" class="flex flex-wrap gap-2">
      <span
        v-for="keyword in keywords"
        :key="keyword.id"
        class="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
      >
        {{ keyword.name }}
        <button
          type="button"
          class="ml-1 rounded-full hover:bg-primary/20 p-0.5 transition-colors"
          :disabled="isLoading"
          @click="detach(keyword)"
        >
          <Icon name="x" class="h-3 w-3" />
        </button>
      </span>
    </div>
    <p v-else class="text-sm text-muted-foreground">Még nincs kulcsszó a csoportban.</p>

    <div class="relative">
      <button
        type="button"
        class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        @click="isOpen = !isOpen"
      >
        <span class="text-muted-foreground">Kulcsszó hozzáadása...</span>
        <Icon name="chevron-down" class="h-4 w-4 opacity-50 ml-2 shrink-0" />
      </button>

      <div
        v-if="isOpen"
        class="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md"
      >
        <div class="p-2">
          <input
            v-model="search"
            type="text"
            class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            placeholder="Keresés..."
            autofocus
          />
        </div>
        <div class="max-h-48 overflow-auto p-1">
          <div v-if="availableKeywords.length === 0" class="py-2 px-3 text-sm text-muted-foreground">
            Nincs találat.
          </div>
          <button
            v-for="keyword in availableKeywords"
            :key="keyword.id"
            type="button"
            class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
            :disabled="isLoading"
            @click="attach(keyword)"
          >
            {{ keyword.name }}
          </button>
        </div>
      </div>

      <div v-if="isOpen" class="fixed inset-0 z-40" @click="isOpen = false" />
    </div>
  </div>
</template>
