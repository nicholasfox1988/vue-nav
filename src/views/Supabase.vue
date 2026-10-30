<template>
  <div class="box1">
    <div class="supabase-demo">
      <h2>nickData</h2>

      <form class="toolbar" @submit.prevent="submitForm">
        <input
          v-model="form.name"
          type="text"
          placeholder="请输入姓名"
          maxlength="50"
        />
        <button type="submit" :disabled="submitting">
          {{ editingId === null ? '新增' : '保存修改' }}
        </button>
        <button v-if="editingId !== null" type="button" class="secondary" @click="resetForm">
          取消
        </button>
      </form>

      <p v-if="loading">正在加载中...</p>
      <p v-else-if="error" class="error">{{ error }}</p>

      <div v-else class="table-wrap">
        <table v-if="rows.length">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.name ?? '—' }}</td>
              <td class="actions">
                <button class="small" type="button" @click="startEdit(row)">编辑</button>
                <button class="small danger" type="button" @click="deleteRow(row.id)">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else class="empty">暂无数据</p>
      </div>

      <button class="reload" type="button" @click="loadData">重新加载</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import supabase from '../lib/supabase'

type NickDataRow = {
  id: number
  name: string | null
}

const rows = ref<NickDataRow[]>([])
const loading = ref(false)
const submitting = ref(false)
const error = ref('')
const editingId = ref<number | null>(null)
const form = ref({ name: '' })

function resetForm() {
  editingId.value = null
  form.value.name = ''
}

async function loadData() {
  loading.value = true
  error.value = ''

  const { data, error: queryError } = await supabase
    .from('nickData')
    .select('*')
    .order('id', { ascending: true })

  loading.value = false

  if (queryError) {
    error.value = queryError.message
    console.error('❌ 查询失败:', queryError.message)
    return
  }

  rows.value = (data ?? []) as NickDataRow[]
}

async function submitForm() {
  const name = form.value.name.trim()

  if (!name) {
    error.value = '请输入姓名'
    return
  }

  submitting.value = true
  error.value = ''

  try {
    const payload = {
      id: editingId.value ?? Date.now(),
      name,
    }

    if (editingId.value === null) {
      const { error: insertError } = await supabase
        .from('nickData')
        .insert([payload])

      if (insertError) {
        throw insertError
      }
    } else {
      const { error: updateError } = await supabase
        .from('nickData')
        .update({ name })
        .eq('id', editingId.value)

      if (updateError) {
        throw updateError
      }
    }

    resetForm()
    await loadData()
  } catch (err: any) {
    error.value = err?.message ?? '保存失败'
    console.error('❌ 保存失败:', err)
  } finally {
    submitting.value = false
  }
}

function startEdit(row: NickDataRow) {
  editingId.value = row.id
  form.value.name = row.name ?? ''
}

async function deleteRow(id: number) {
  if (!confirm('确认删除这条数据吗？')) {
    return
  }

  try {
    const { error: deleteError } = await supabase
      .from('nickData')
      .delete()
      .eq('id', id)

    if (deleteError) {
      throw deleteError
    }

    if (editingId.value === id) {
      resetForm()
    }

    await loadData()
  } catch (err: any) {
    error.value = err?.message ?? '删除失败'
    console.error('❌ 删除失败:', err)
  }
}

onMounted(() => {
  void loadData()
})
</script>

<style scoped>
.box1 {
  display: flex;
  justify-content: center;
  margin: 60px 20px;
}

.supabase-demo {
  background: #fff4f7;
  width: min(760px, 90%);
  border: 2px solid #f3a9b6;
  border-radius: 12px;
  text-align: center;
  padding: 24px 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
}

h2 {
  margin-top: 0;
  color: #444;
}

.toolbar {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin: 20px 0;
  flex-wrap: wrap;
}

input {
  min-width: 200px;
  padding: 10px 12px;
  border: 1px solid #d7d7d7;
  border-radius: 8px;
  font-size: 14px;
}

button {
  border: none;
  background: #ff7da8;
  color: white;
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
  font-size: 14px;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

button.secondary {
  background: #9aa0a6;
}

button.small {
  padding: 6px 10px;
  font-size: 12px;
}

button.danger {
  background: #e74c3c;
}

.reload {
  margin-top: 18px;
}

.table-wrap {
  margin-top: 18px;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
}

th,
td {
  border-bottom: 1px solid #f2d4dc;
  padding: 12px 10px;
  text-align: left;
}

th {
  background: #ffe2ea;
  color: #555;
}

.actions {
  display: flex;
  gap: 8px;
  justify-content: flex-start;
}

.error {
  color: #c62828;
  font-weight: bold;
  margin: 12px 0;
}

.empty {
  color: #666;
  margin: 12px 0;
}
</style>
