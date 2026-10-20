<script setup lang="ts">
import { ref,reactive } from 'vue'
import { useRouter } from 'vue-router'
import * as XLSX from 'xlsx'
import {type dataType } from '../types/nav'

const router = useRouter()
const back = (): void => {
  router.push('/')
}

// const fileName = ref('未选择文件')
const excelData = reactive([])

const hide = ()=> {
  excelData.forEach(element => {
      if (element.tick) element.hide = true;
  });
}

const showAll = ()=>{
  excelData.forEach(element => element.hide = false);
}

const handleFileChange = async (event: Event): Promise<void> => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  const arrayBuffer = await file.arrayBuffer()
  const workbook = XLSX.read(arrayBuffer, { type: 'array' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  // const dataRows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, blankrows: false, defval: '' }) as any[][]

  const jsonData1:dataType[] = XLSX.utils.sheet_to_json(sheet);
  const jsonData2:dataType[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  const headers:string[]= jsonData2[0];
  console.log(headers);                
  // console.log(jsonData1);
  // Process the data
  const excelData1 = jsonData1.map(row => {
      const no= row[headers[1]];
      const px = no.toString().slice(-3);
      return {
          px: px,
          tick: false,
          hide: false,
          delivery: row[headers[7]],
          ctns: row[headers[2]],
          consignee: row[headers[0]],
          // pay:row[headers[6]],
          no: no,
          date: row[headers[8]]
      };
  }).filter(row => row.no);

  excelData1.map(row => {
      if (!row.delivery || !row.date) row.delivery = "不处理";
  });

  excelData1.sort((a, b) => {
      const nameA = a['delivery'].toUpperCase(); // 忽略大小写
      const nameB = b['delivery'].toUpperCase();
      if (nameA < nameB) {
          return -1;
      }
      if (nameA > nameB) {
          return 1;
      }
      return 0;
  });

  Object.assign(excelData,excelData1)

  console.log(excelData)
}
</script>

<template>
  <div class="page">
    <button @click="back">← 返回主页</button>
    <input type="file" accept=".xlsx,.xls,.csv" @change="handleFileChange" />
    <div class="box1">
      <p>这里显示查询结果</p>
      <input type="text">
    </div>
    <div class="box2">
      <table id="dataTable">
        <thead>
          <tr>
            <th>px</th>
            <th>
                <button class="diaomao" @dblclick="showAll" @click="hide">click</button>
            </th>
            <th>Delivery</th>
            <th>Q...</th>
            <th>NAME</th>
            <th>No</th>
          </tr>
        </thead>
        <tbody id="tableBody">
          <tr v-for="(row,index) in excelData" :key="row.px" :class="{'row-checked': row.tick}"
              v-show="!row.hide">
              <td>{{ row.px }}</td>
              <td><input type="checkbox" v-model="row.tick"></td>
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
.box1{
  background-color: pink;
  border: 3 3 green;
  border-radius: 10px;
  margin: 5px;
}
.box2{
  background-color: rgb(192, 255, 243);
  border: 3 3 green;
  border-radius: 10px;
  margin: 5px;
}
button{
  display: flex;
}
th{
  background-color: aqua;
  padding: 8px;
}
tr.row-checked td {
  color: #777;
  opacity: 0.6;
  text-decoration: line-through;
}
td{
  background-color: blanchedalmond;
  padding:8px;
}
</style>