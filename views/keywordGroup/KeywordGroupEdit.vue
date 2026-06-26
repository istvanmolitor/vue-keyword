<script setup lang="ts">
import { AdminLayout, BackButton, Checkbox, FormButtons, LoadingSpinner, toastService } from '@admin'
import Label from '@admin/components/ui/Label.vue'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardDescription from '@admin/components/ui/CardDescription.vue'
import CardFooter from '@admin/components/ui/CardFooter.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import InputField from '@admin/components/ui/InputField.vue'
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import KeywordSelector from '../../components/KeywordSelector.vue'
import { keywordGroupService, type KeywordGroupFormData, type KeywordGroupKeyword } from '../../services/keywordGroupService'

const router = useRouter()
const route = useRoute()
const isSaving = ref(false)
const isLoading = ref(true)
const errors = ref<Record<string, string[]>>({})
const groupId = ref<string>('')
const keywords = ref<KeywordGroupKeyword[]>([])

const form = reactive<KeywordGroupFormData>({
  name: '',
  slug: '',
  is_public: false,
})

const fetchGroup = async () => {
  const id = route.params.id as string
  groupId.value = id

  try {
    isLoading.value = true
    const { data } = await keywordGroupService.getById(id)

    form.name = data.data.name
    form.slug = data.data.slug
    form.is_public = data.data.is_public
    keywords.value = data.data.keywords ?? []
  } catch (error) {
    console.error('Hiba a csoport betöltésekor:', error)
    await router.push('/admin/keyword-group')
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  const id = route.params.id as string

  try {
    isSaving.value = true
    errors.value = {}
    await keywordGroupService.update(id, form)
    toastService.success('Csoport sikeresen frissítve!')
    await router.push('/admin/keyword-group')
  } catch (error: any) {
    console.error('Hiba a csoport frissítésekor:', error)
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors
      toastService.error('Kérlek javítsd a hibákat.')
    } else {
      toastService.error('Hiba történt a mentés során.')
    }
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  fetchGroup()
})
</script>

<template>
  <AdminLayout page-title="Kulcsszó-csoport szerkesztése">
    <div class="mb-4 flex items-center justify-between">
      <BackButton to="/admin/keyword-group" />
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      <LoadingSpinner label="Betöltés..." />
    </div>

    <div v-else class="grid grid-cols-5 gap-6 items-start">
      <Card class="col-span-2">
        <CardHeader>
          <CardTitle>Csoport adatai</CardTitle>
          <CardDescription>Módosítsd a kulcsszó-csoport adatait.</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <InputField id="name" label="Név" v-model="form.name" placeholder="Példa csoport" :errors="errors.name" />
          <InputField id="slug" label="Slug" v-model="form.slug" placeholder="pelda-csoport" :errors="errors.slug" />
          <div class="flex items-center gap-2">
            <Checkbox id="is_public" v-model="form.is_public" />
            <Label for="is_public">Nyilvános</Label>
          </div>
        </CardContent>
        <CardFooter>
          <FormButtons
            :is-saving="isSaving"
            @save="handleSubmit"
            @cancel="router.push('/admin/keyword-group')"
          />
        </CardFooter>
      </Card>

      <Card class="col-span-3">
        <CardHeader>
          <CardTitle>Kulcsszavak</CardTitle>
          <CardDescription>A csoporthoz tartozó kulcsszavak kezelése.</CardDescription>
        </CardHeader>
        <CardContent>
          <KeywordSelector
            :group-id="groupId"
            :keywords="keywords"
            @update:keywords="keywords = $event"
          />
        </CardContent>
      </Card>
    </div>
  </AdminLayout>
</template>
