<script setup lang="ts">
import { AdminLayout, BackButton, CheckboxField, FormButtons, InputError, toastService } from '@admin'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardDescription from '@admin/components/ui/CardDescription.vue'
import CardFooter from '@admin/components/ui/CardFooter.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import InputField from '@admin/components/ui/InputField.vue'
import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { keywordGroupService, type KeywordGroupFormData } from '../../services/keywordGroupService'

const router = useRouter()
const isSaving = ref(false)
const errors = ref<Record<string, string[]>>({})

const form = reactive<KeywordGroupFormData>({
  name: '',
  slug: '',
  is_public: false,
})

watch(() => form.name, (value) => {
  if (!form.slug || form.slug === slugify(form.name)) {
    form.slug = slugify(value)
  }
})

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

const handleSubmit = async () => {
  try {
    isSaving.value = true
    errors.value = {}

    const response: any = await keywordGroupService.create(form)
    toastService.success('Csoport sikeresen létrehozva!')

    const createdId = response?.data?.data?.id ?? response?.data?.id ?? response?.id

    if (createdId !== undefined && createdId !== null) {
      await router.push({ name: 'keyword-keyword-group-edit', params: { id: String(createdId) } })
      return
    }

    await router.push('/admin/keyword-group')
  } catch (error: any) {
    console.error('Hiba a csoport létrehozásakor:', error)
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
</script>

<template>
  <AdminLayout page-title="Új kulcsszó-csoport">
    <div class="mb-4 flex items-center justify-between">
      <BackButton to="/admin/keyword-group" />
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Csoport adatai</CardTitle>
        <CardDescription>Add meg az új kulcsszó-csoport adatait.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <InputField id="name" label="Név" v-model="form.name" placeholder="Példa csoport" :errors="errors.name" />
        <InputField id="slug" label="Slug" v-model="form.slug" placeholder="pelda-csoport" :errors="errors.slug" />
        <InputError :message="errors.slug" />
        <CheckboxField id="is_public" label="Nyilvános" v-model="form.is_public" />
      </CardContent>
      <CardFooter>
        <FormButtons
          :is-saving="isSaving"
          @save="handleSubmit"
          @cancel="router.push('/admin/keyword-group')"
        />
      </CardFooter>
    </Card>
  </AdminLayout>
</template>
