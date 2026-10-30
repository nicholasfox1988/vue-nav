<script setup lang="ts">
import { reactive} from 'vue'
import { useRouter } from 'vue-router'
import * as XLSX from 'xlsx'
import type { ExcelRow } from '../types/yunData'

const router = useRouter()

const back = (): void => {
  router.push('/')
}

let excelData = reactive<ExcelRow[]>([])

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
  const workbook = XLSX.read(arrayBuffer)
  const firstSheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[firstSheetName]

  if (!sheet) {
    return
  }
  const sheetRows = XLSX.utils.sheet_to_json(sheet)
  // console.log(sheetRows)
  const holdRows=sheetRows.filter((row: any) => row.hold===true || row.account_no.includes('AION'))
  .sort((a: any, b: any) => a.account_no.localeCompare(b.account_no))
  // console.log(holdRows)
  document.getElementById('p')!.innerHTML ='Hold:'+ holdRows.map((row: any) => row.name).join(',')
  const midData = sheetRows.map((row: any) => {
    return{
      name:row.name,
      pic:row.pieces,
      fo:row.fo,
      no:row.account_no,
      delivery:row['delivery type'],
      tick:false,
      hide:false
    }
  })
  .filter(row=>row.delivery.toUpperCase()==='K')
  .sort((a,b)=>a.pic-b.pic)
  Object.assign(excelData, midData)
}
</script>

<template>
  <div class="page">
    <div class="box1">
      <button @click="back">← 返回主页</button>
      <input type="file" accept=".xlsx,.xls,.csv" @change="handleFileChange" />
      <p id="p">Hold:</p>
    </div>
    <div class="table-container">
      <table id="dataTable">
        <thead>
          <tr>
            <th>
              <button @dblclick="showAll" @click="hideSelectedRows">click</button>
            </th>
            <th>name</th>
            <th>pic</th>
            <th>fo</th>
            <th>no</th>
            <th>d</th>
          </tr>
        </thead>
        <tbody id="tableBody">
          <tr
            v-for="row in excelData"
            :key="row.fo + row.name"
            :class="{ 'row-checked': row.tick }"
            v-show="!row.hide"
          >
            <td><input v-model="row.tick" type="checkbox" /></td>
            <td>{{ row.name }}</td>
            <td>{{ row.pic }}</td>
            <td>{{ row.fo }}</td>
            <td>{{ row.no }}</td>
            <td>{{ row.delivery }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.table-container {
  height: 550px; /* 必须设置容器高度 */
  overflow-y: auto;
  position: relative;
}

table {
  border-collapse: collapse;
  width: 100%;
  border-collapse: collapse;
  max-width: 800px;
  margin: 20px 0;
}
th {
  position: sticky;
  top: 0;
  background-color: aqua;
  padding: 8px;
  z-index: 1;
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