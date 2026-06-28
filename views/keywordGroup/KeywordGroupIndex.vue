<script setup lang="ts">
import { AdminLayout, toastService } from '@admin'
import CreateButton from '@admin/components/ui/button/CreateButton.vue'
import DeleteButton from '@admin/components/ui/button/DeleteButton.vue'
import EditButton from '@admin/components/ui/button/EditButton.vue'
import DataTable, { type Column, type PaginationMeta } from '@admin/components/ui/dataTable/DataTable.vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { keywordGroupService, type KeywordGroup } from '../../services/keywordGroupService'

const router = useRouter()
const groups = ref<KeywordGroup[]>([])
const isLoading = ref(false)

const pagination = ref<PaginationMeta>({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0
})

const columns = ref<Column[]>([])

const fetchGroups = async (params: {
  search?: string
  sort?: string
  direction?: 'asc' | 'desc'
  page?: number
}) => {
  try {
    isLoading.value = true
    const response = await keywordGroupService.getAll(params)
    groups.value = response.data.data
    pagination.value = response.data.meta
    columns.value = (response.data.columns ?? []) as Column[]
  } catch (error) {
    console.error('Hiba a kulcsszó-csoportok betöltésekor:', error)
  } finally {
    isLoading.value = false
  }
}

const deleteGroup = async (id: number) => {
  try {
    await keywordGroupService.delete(id)
    toastService.success('A csoport sikeresen törölve!')
    await fetchGroups({ page: pagination.value.current_page })
  } catch (error) {
    console.error('Hiba a csoport törlésekor:', error)
    toastService.error('Hiba történt a törlés során.')
  }
}

const editGroup = (id: number) => {
  router.push(`/admin/keyword-group/${id}/edit`)
}

onMounted(() => {
  fetchGroups({ page: 1, sort: 'name', direction: 'asc' })
})
</script>

<template>
  <AdminLayout page-title="Kulcsszó-csoportok">
    <DataTable
      :columns="columns"
      :data="groups"
      :loading="isLoading"
      :pagination="pagination"
      search-placeholder="Keresés név alapján..."
      default-sort="name"
      default-direction="asc"
      @fetch="fetchGroups"
    >
      <template #actions>
        <CreateButton to="/admin/keyword-group/create">Új csoport</CreateButton>
      </template>

      <template #row-actions="{ row }">
        <EditButton @click="editGroup(row.id)" />
        <DeleteButton @confirm="deleteGroup(row.id)" />
      </template>

      <template #empty>
        Nincs megjeleníthető kulcsszó-csoport.
      </template>
    </DataTable>
  </AdminLayout>
</template>
