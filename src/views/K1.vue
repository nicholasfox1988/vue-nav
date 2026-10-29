<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import * as XLSX from 'xlsx'
import type { ExcelRow } from '../types/dataType'

const router = useRouter()

const back = (): void => {
  router.push('/')
}

const excelData = reactive<ExcelRow[]>([])
const searchText = ref('')

const normalizedSearch = computed<string>(() => searchText.value.trim())

const filteredRows = computed<ExcelRow[]>(() => {
  if (!normalizedSearch.value) {
    return excelData
  }

  const query = normalizedSearch.value.toLowerCase()

  return excelData.filter((row) => {
    const pxMatch = row.px.toLowerCase().includes(query)
    const noMatch = row.no.toLowerCase().includes(query)
    const consigneeMatch = row.consignee.toLowerCase().includes(query)

    return pxMatch || noMatch || consigneeMatch
  })
})

const querySummary = computed<string>(() => {
  if (!normalizedSearch.value) {
    return '请输入 PX 号码进行查询'
  }

  if (filteredRows.value.length === 0) {
    return '未查询到相关结果'
  }
  
  return `
    ${filteredRows.value[0].px}
    ${filteredRows.value[0].consignee}
    --->(${filteredRows.value[0].ctns} )
  `
})

const handleSearchKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Enter') {
    searchText.value = ''
  }
}

const toNumber = (value: unknown): number => {
  if (value === null || value === undefined || value === '') {
    return 0
  }

  const normalized = String(value).replace(/[,，\s]/g, '')
  const parsed = Number(normalized)

  return Number.isFinite(parsed) ? parsed : 0
}

const deliveryTotals = computed<Array<{ delivery: string, total: number }>>(() => {
  const totalsMap = new Map<string, number>()

  filteredRows.value.forEach((row) => {
    const current = totalsMap.get(row.delivery) ?? 0
    totalsMap.set(row.delivery, current + toNumber(row.ctns))
  })

  return [...totalsMap.entries()]
    .map(([delivery, total]) => ({ delivery, total }))
    .sort((a, b) => a.delivery.localeCompare(b.delivery))
})

const toDisplayText = (value: unknown): string => {
  if (value === null || value === undefined) {
    return ''
  }

  return String(value).trim()
}

const hideSelectedRows = (): void => {
  excelData.forEach((element) => {
    element.hide = element.tick
  })
}

const showAll = (): void => {
  excelData.forEach((element) => {
    element.hide = false
  })
}

const handleFileChange = async (event: Event): Promise<void> => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) {
    return
  }

  const arrayBuffer = await file.arrayBuffer()
  const workbook = XLSX.read(arrayBuffer, { type: 'array' })
  const firstSheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[firstSheetName]

  if (!sheet) {
    return
  }

  const sheetRows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    raw: false,
    blankrows: false,
    defval: ''
  }) as string[][]

  if (sheetRows.length <= 1) {
    excelData.splice(0, excelData.length)
    searchText.value = ''
    return
  }

  const processedRows: ExcelRow[] = sheetRows
    .slice(1)
    .map((row: string[]) => {
      const consignee = toDisplayText(row[0])
      const no = toDisplayText(row[1])
      const delivery = toDisplayText(row[8]) ? toDisplayText(row[7]) : '不处理'
      const date = toDisplayText(row[8])

      if (!no) {
        return null
      }

      const px = no.length > 3 ? no.slice(-3) : no
      const result: ExcelRow = {
        px,
        tick: false,
        hide: false,
        delivery: delivery || '不处理',
        ctns: toDisplayText(row[2]),
        consignee,
        no,
        date
      }

      return result
    })
    .filter((row): row is ExcelRow => row !== null)
    .sort((a, b) => a.delivery.localeCompare(b.delivery, undefined, { sensitivity: 'base' }))

  excelData.splice(0, excelData.length, ...processedRows)
  searchText.value = ''
}
</script>

<template>
  <div class="page">
    <button @click="back">← 返回主页</button>
    <input type="file" accept=".xlsx,.xls,.csv" @change="handleFileChange" />

    <div class="box1">
      <p>{{ querySummary }}</p>
      <input
        v-model="searchText"
        type="text"
        placeholder="请输入 PX 号码或姓名/单号"
        @keyup="handleSearchKeydown"
      />

      <div v-if="deliveryTotals.length" class="delivery-summary">
        <div v-for="item in deliveryTotals" :key="item.delivery" class="summary-item">
          <span>{{ item.delivery }}</span>
          <strong>{{ item.total }}</strong>
        </div>
      </div>
    </div>

    <div class="box2">
      <table id="dataTable">
        <thead>
          <tr>
            <th>px</th>
            <th>
              <button class="diaomao" @dblclick="showAll" @click="hideSelectedRows">click</button>
            </th>
            <th>Delivery</th>
            <th>Q...</th>
            <th>NAME</th>
            <th>No</th>
          </tr>
        </thead>
        <tbody id="tableBody">
          <tr
            v-for="row in excelData"
            :key="row.no + row.px"
            :class="{ 'row-checked': row.tick }"
            v-show="!row.hide"
          >
            <td>{{ row.px }}</td>
            <td><input v-model="row.tick" type="checkbox" /></td>
            <td>{{ row.delivery }}</td>
            <td>{{ row.ctns }}</td>
            <td>{{ row.consignee }}</td>
            <td>{{ row.no }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 12px;
}
.box1 {
  background-color: pink;
  border: 3px solid green;
  border-radius: 10px;
  margin: 5px;
  padding: 12px;
}
.box2 {
  background-color: rgb(192, 255, 243);
  border: 3px solid green;
  border-radius: 10px;
  margin: 5px;
  padding: 12px;
}

input[type='text'] {
  width: 100%;
  max-width: 360px;
  padding: 8px 10px;
  margin: 8px 0;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
}
.delivery-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}
.summary-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(0, 0, 0, 0.08);
}
.summary-item strong {
  color: #0f172a;
}
th {
  background-color: aqua;
  padding: 8px;
}
tr.row-checked td {
  color: #777;
  opacity: 0.6;
  text-decoration: line-through;
}
td {
  background-color: blanchedalmond;
  padding: 8px;
}
</style>