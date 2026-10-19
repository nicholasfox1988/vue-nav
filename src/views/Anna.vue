<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import * as XLSX from 'xlsx'

const router = useRouter()
const back = (): void => {
  router.push('/')
}

type RowRecord = Record<string, string | number>

const fileName = ref('未选择文件')
const importedRows = ref<RowRecord[]>([])
const columns = computed(() => {
  if (!importedRows.value.length) return []
  return Object.keys(importedRows.value[0])
})
const filteredCount = ref(0)

const totalSalesAmount = computed(() => {
  const amountKey = importedRows.value.length
    ? Object.keys(importedRows.value[0]).find((key) => /销售金额|销售额|金额|amount/i.test(String(key)))
    : null

  if (!amountKey) return 0

  return importedRows.value.reduce((sum, row) => {
    const value = parseCellValue(row[amountKey])
    return Number.isNaN(value) ? sum : sum + value
  }, 0)
})

const parseCellValue = (value: unknown): number => {
  if (value === null || value === undefined || value === '') return Number.NaN
  const text = String(value).replace(/￥|元|,|\s|\(|\)|\[|\]/g, '')
  const parsed = Number(text)
  return Number.isFinite(parsed) ? parsed : Number.NaN
}

const normalizeRecord = (row: any[], header: string[]): RowRecord => {
  const record: RowRecord = {}
  header.forEach((key, index) => {
    record[key || `col_${index + 1}`] = row[index] ?? ''
  })
  return record
}

const getAmountKey = (headers: string[]): string | null => {
  const key = headers.find((header) => /销售金额|销售额|金额|amount/i.test(String(header)))
  return key ?? null
}

const readOrderSummary = (arrayBuffer: ArrayBuffer, sourceLabel: string): void => {
  const workbook = XLSX.read(arrayBuffer, { type: 'array' })
  const targetSheetName = workbook.SheetNames.find((sheetName) => sheetName.includes('订单汇总'))
  const sheet = workbook.Sheets[targetSheetName ?? workbook.SheetNames[0]]

  if (!sheet) {
    importedRows.value = []
    fileName.value = sourceLabel
    filteredCount.value = 0
    return
  }

  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, blankrows: false, defval: '' }) as any[][]
  const headerRow = rows[4] ?? rows[0] ?? []
  const dataRows = rows.slice(5)

  const headers = headerRow.map((cell, index) => String(cell || `col_${index + 1}`))
  const mappedRows = dataRows
    .filter((row) => Array.isArray(row) && row.some((cell) => cell !== null && cell !== '' && cell !== undefined))
    .map((row) => normalizeRecord(row, headers))

  const amountKey = getAmountKey(headers)
  const nextRows = mappedRows.filter((row) => {
    if (!amountKey) return true
    const amount = parseCellValue(row[amountKey])
    return !Number.isNaN(amount) && amount !== 0
  })

  importedRows.value = nextRows
  fileName.value = sourceLabel
  filteredCount.value = Math.max(0, mappedRows.length - nextRows.length)
}

const loadFile = async (file: File): Promise<void> => {
  const arrayBuffer = await file.arrayBuffer()
  readOrderSummary(arrayBuffer, file.name)
}

const handleFileChange = async (event: Event): Promise<void> => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  await loadFile(file)
}

const exportData = (): void => {
  if (!importedRows.value.length) return

  const headers = columns.value
  const worksheetData = importedRows.value.map((row) => headers.map((header) => row[header] ?? ''))
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...worksheetData])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, '订单汇总')

  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')
  const fileNameWithSuffix = fileName.value && fileName.value !== '未选择文件'
    ? '-处理后-'+fileName.value.replace(/\.[^.]+$/, '') + `.xlsx`
    : `订单汇总-处理后-${timestamp}.xlsx`

  XLSX.writeFile(workbook, fileNameWithSuffix)
}
</script>

<template>
  <div class="page">
    <button @click="back">← 返回主页</button>
    <h1>🔑 Anna的页面</h1>

    <div class="import-panel">
      <label class="file-input">
        <span>导入 XLSX 文件</span>
        <input type="file" accept=".xlsx,.xls,.csv" @change="handleFileChange" />
        <button type="button" @click="exportData">导出处理后数据</button>
      </label>

      <div class="meta">
        <span>当前文件：{{ fileName }}</span>
        <span>已过滤金额为 0 的数据：{{ filteredCount }} 条</span>
        <span>销售金额总数：{{ totalSalesAmount.toFixed(2) }}</span>
      </div>
    </div>

    <div v-if="importedRows.length" class="table-wrap">
      <table>
        <thead>
          <tr>
            <th v-for="key in columns" :key="key">{{ key }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in importedRows" :key="`${index}-${JSON.stringify(row)}`">
            <td v-for="key in columns" :key="`${key}-${index}`">{{ row[key] ?? '' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="empty-state">暂无数据，请手动选择订单汇总 XLSX 文件</div>
  </div>
</template>

<style scoped>
.page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
}

h1 {
  margin-top: 1rem;
  margin-bottom: 1.5rem;
}

.import-panel {
  background: #f8fafc;
  border: 1px solid #dbe7f0;
  border-radius: 16px;
  padding: 1rem 1.25rem;
  margin-bottom: 1.25rem;
}

.file-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.file-input input {
  max-width: 280px;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  color: #475569;
  font-size: 0.92rem;
}

.table-wrap {
  overflow-x: auto;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 720px;
}

th,
td {
  padding: 0.7rem 0.8rem;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
  vertical-align: top;
  white-space: nowrap;
}

th {
  background: #f1f5f9;
  color: #0f172a;
  font-size: 0.9rem;
}

td {
  color: #334155;
  font-size: 0.88rem;
}

.empty-state {
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  color: #64748b;
}
</style>