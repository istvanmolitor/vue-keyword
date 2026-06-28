<script setup lang="ts">
import { AdminLayout, toastService } from '@admin'
import CreateButton from '@admin/components/ui/button/CreateButton.vue'
import DeleteButton from '@admin/components/ui/button/DeleteButton.vue'
import EditButton from '@admin/components/ui/button/EditButton.vue'
import DataTable from '@admin/components/ui/dataTable/DataTable.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { keywordGroupService } from '../../services/keywordGroupService'

const router = useRouter()
const table = ref()

const deleteGroup = async (id: number) => {
  try {
    await keywordGroupService.delete(id)
    toastService.success('A csoport sikeresen törölve!')
    table.value?.refresh()
  } catch (error) {
    console.error('Hiba a csoport törlésekor:', error)
    toastService.error('Hiba történt a törlés során.')
  }
}

const editGroup = (id: number) => {
  router.push(`/admin/keyword-group/${id}/edit`)
}
</script>

<template>
  <AdminLayout page-title="Kulcsszó-csoportok">
    <DataTable
      ref="table"
      url="/api/admin/keyword/keyword-groups"
    >
      <template #actions>
        <CreateButton to="/admin/keyword-group/create">Új csoport</CreateButton>
      </template>

      <template #row-actions="{ row }">
        <EditButton @click="editGroup((row as any).id)" />
        <DeleteButton @confirm="deleteGroup((row as any).id)" />
      </template>

      <template #empty>
        Nincs megjeleníthető kulcsszó-csoport.
      </template>
    </DataTable>
  </AdminLayout>
</template>
