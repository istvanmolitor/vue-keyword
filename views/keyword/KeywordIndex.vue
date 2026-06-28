<script setup lang="ts">
import { AdminLayout, toastService } from '@admin'
import CreateButton from '@admin/components/ui/button/CreateButton.vue'
import DeleteButton from '@admin/components/ui/button/DeleteButton.vue'
import EditButton from '@admin/components/ui/button/EditButton.vue'
import DataTable from '@admin/components/ui/dataTable/DataTable.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { keywordService } from '../../services/keywordService'

const router = useRouter()
const table = ref()

const deleteKeyword = async (id: number) => {
  try {
    await keywordService.delete(id)
    toastService.success('A kulcsszo sikeresen torolve!')
    table.value?.refresh()
  } catch (error) {
    console.error('Hiba a kulcsszo torlesekor:', error)
    toastService.error('Hiba tortent a torles soran.')
  }
}

const editKeyword = (id: number) => {
  router.push(`/admin/keyword/${id}/edit`)
}
</script>

<template>
  <AdminLayout page-title="Kulcsszavak">
    <DataTable
      ref="table"
      url="/api/admin/keyword/keywords"
    >
      <template #actions>
        <CreateButton to="/admin/keyword/create">Uj Keyword</CreateButton>
      </template>

      <template #cell-alias_keyword="{ row }">
        <span>{{ (row as any).alias_keyword?.name ?? '-' }}</span>
      </template>

      <template #cell-is_stop_word="{ row }">
        <span
          v-if="(row as any).is_stop_word"
          class="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800"
        >
          Igen
        </span>
        <span
          v-else
          class="rounded bg-slate-100 px-2 py-1 text-xs text-slate-700"
        >
          Nem
        </span>
      </template>

      <template #row-actions="{ row }">
        <EditButton @click="editKeyword((row as any).id)" />
        <DeleteButton @confirm="deleteKeyword((row as any).id)" />
      </template>

      <template #empty>
        Nincs megjelenitheto kulcsszo.
      </template>
    </DataTable>
  </AdminLayout>
</template>
