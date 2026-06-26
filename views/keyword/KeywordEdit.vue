<script setup lang="ts">
import { AdminLayout, BackButton, FormButtons, InputError, LoadingSpinner, toastService } from '@admin'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardDescription from '@admin/components/ui/CardDescription.vue'
import CardFooter from '@admin/components/ui/CardFooter.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import Checkbox from '@admin/components/ui/Checkbox.vue'
import InputField from '@admin/components/ui/InputField.vue'
import Label from '@admin/components/ui/Label.vue'
import Select from '@admin/components/ui/Select.vue'
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { keywordService, type KeywordFormData, type KeywordGroupOption, type KeywordOption } from '../../services/keywordService'

const router = useRouter()
const route = useRoute()
const isSaving = ref(false)
const isLoading = ref(true)
const errors = ref<Record<string, string[]>>({})
const aliasOptions = ref<KeywordOption[]>([])
const groupOptions = ref<KeywordGroupOption[]>([])

const form = reactive<KeywordFormData>({
  name: '',
  slug: '',
  is_stop_word: false,
  alias_keyword_id: null,
  group_ids: [],
})

const fetchKeyword = async () => {
  const id = route.params.id as string

  try {
    isLoading.value = true
    const { data } = await keywordService.getEditData(id)

    if (data.data) {
      form.name = data.data.name
      form.slug = data.data.slug
      form.is_stop_word = data.data.is_stop_word
      form.alias_keyword_id = data.data.alias_keyword_id
      form.group_ids = data.data.group_ids ?? []
    }

    aliasOptions.value = data.alias_keywords ?? []
    groupOptions.value = data.keyword_groups ?? []
  } catch (error) {
    console.error('Hiba a kulcsszo betoltesekor:', error)
    await router.push('/admin/keyword')
  } finally {
    isLoading.value = false
  }
}

const toggleGroup = (groupId: number) => {
  const idx = form.group_ids.indexOf(groupId)
  if (idx === -1) {
    form.group_ids.push(groupId)
  } else {
    form.group_ids.splice(idx, 1)
  }
}

const handleSubmit = async () => {
  const id = route.params.id as string

  try {
    isSaving.value = true
    errors.value = {}
    await keywordService.update(id, form)
    toastService.success('Kulcsszo sikeresen frissitve!')
    await router.push('/admin/keyword')
  } catch (error: any) {
    console.error('Hiba a kulcsszo frissitesekor:', error)
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors
      toastService.error('Kerd lek a hibak javitasat.')
    } else {
      toastService.error('Hiba tortent a mentes soran.')
    }
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  fetchKeyword()
})
</script>

<template>
  <AdminLayout page-title="Keyword szerkesztese">
    <div class="mb-4 flex items-center justify-between">
      <BackButton to="/admin/keyword" />
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      <LoadingSpinner label="Betoltes..." />
    </div>

    <Card v-else>
      <CardHeader>
        <CardTitle>Keyword adatok</CardTitle>
        <CardDescription>Modositsd a keyword adatait.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <InputField id="name" label="Kulcsszo" v-model="form.name" placeholder="pelda" :errors="errors.name" />
        <InputField id="slug" label="Slug" v-model="form.slug" placeholder="pelda-kulcsszo" :errors="errors.slug" />

        <div class="space-y-2">
          <Label for="alias_keyword_id">Alias keyword</Label>
          <Select
            id="alias_keyword_id"
            v-model="form.alias_keyword_id"
            :options="aliasOptions"
            label-field="name"
            value-field="id"
            placeholder="Nincs alias"
            clearable
          />
          <InputError :message="errors.alias_keyword_id" />
        </div>

        <div class="flex items-center gap-2">
          <Checkbox v-model="form.is_stop_word" />
          <Label>Stop szo</Label>
        </div>
        <InputError :message="errors.is_stop_word" />

        <div v-if="groupOptions.length" class="space-y-2">
          <Label>Csoportok</Label>
          <div class="space-y-1">
            <div v-for="group in groupOptions" :key="group.id" class="flex items-center gap-2">
              <Checkbox
                :model-value="form.group_ids.includes(group.id)"
                @update:model-value="toggleGroup(group.id)"
              />
              <Label>{{ group.name }}</Label>
            </div>
          </div>
          <InputError :message="errors.group_ids" />
        </div>
      </CardContent>
      <CardFooter>
        <FormButtons
          :is-saving="isSaving"
          @save="handleSubmit"
          @cancel="router.push('/admin/keyword')"
        />
      </CardFooter>
    </Card>
  </AdminLayout>
</template>
