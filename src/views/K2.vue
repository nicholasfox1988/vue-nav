<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import * as XLSX from 'xlsx'

import type { ExcelRow } from '../types/dataType'

const router = useRouter()

const back = (): void => {
  router.push('/')
}

const excelData = reactive<ExcelRow[]>([])
let deliveryTotals:object={}
let speakText:string=''

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

const speak = (text:string):void=>{
  const msg = new SpeechSynthesisUtterance(text)
  window.speechSynthesis.speak(msg)
}

const handleSearchKeydown = (): void => {
  const search= document.getElementById('searchText') as HTMLInputElement
  const result = document.getElementById('result') as HTMLParagraphElement
  // const [{ px,consignee,ctns,delivery }] = excelData.filter(row=> row.px===(search).value.trim().toLowerCase())
  const x = excelData.filter(row=> row.px===(search).value.trim().toLowerCase())

  if(x.length===0){
    result.innerText = `未找到该 PX 号码`
    speakText='找不到'
    speak(speakText)
  }else{
    result.innerText = `${x[0].px}--${x[0].delivery}--${x[0].consignee}--${x[0].ctns} `
    speakText=x[0].delivery    
    speak(speakText)
  }
  search.value=''
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
  //将excelData中的delivery字段值作为键，对应的数量作为值，存入deliveryTotals对象中
  deliveryTotals = excelData.reduce((acc:any, cur:any) => {
    acc[cur.delivery] = (acc[cur.delivery] || 0) + Number(cur.ctns)
    return acc
  }, {} as any)   
}
</script>

<template>
  <div class="page">
    <button @click="back">← 返回主页</button>
    <input type="file" accept=".xlsx,.xls,.csv" @change="handleFileChange" />

    <div class="box1">
      <p id="result">查询结果</p>
      <input
        id="searchText"
        type="text"
        placeholder="请输入 PX 号码或姓名/单号"
        @keyup.enter="handleSearchKeydown"
        autocomplete="off"
      />

      <div v-if="deliveryTotals" class="delivery-summary">
        <div v-for="(value,key,index) in deliveryTotals" :key="index" class="summary-item">
          <span>{{ key }}</span>
          <strong>{{ value }}</strong>
        </div>
      </div>
    </div>

    <div class="box2">
      <table id="dataTable">
        <thead>
          <tr>
            <th>px</th>
            <th>
              <button @dblclick="showAll" @click="hideSelectedRows">点</button>
            </th>
            <th>delivery</th>
            <th>ctns</th>
            <th>name</th>
            <th>no</th>
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