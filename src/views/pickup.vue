<script setup lang="ts">
import { ref } from 'vue';
import * as XLSX from 'xlsx';

interface ExcelRow {
  tick: boolean;
  name: string;
  pis: string;
  fo: string;
  no: string;
  hide: boolean;
}

const excelData = ref<ExcelRow[]>([]);

const normalizeValue = (value: unknown): string => String(value ?? '').trim();

const loadData = (event: Event) => {
  const input = event.target as HTMLInputElement | null;
  const file = input?.files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    const result = e.target?.result;
    if (!(result instanceof ArrayBuffer)) return;

    const workbook = XLSX.read(new Uint8Array(result), { type: 'array' });
    const lastSheetName = workbook.SheetNames[workbook.SheetNames.length - 1];
    const worksheet = workbook.Sheets[lastSheetName];
    const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: '' });

    const noCountMap: Record<string, number> = {};
    jsonData.forEach((row) => {
      const no = normalizeValue(row.account_no ?? row.no ?? row.Account_No ?? row['account_no']);
      if (!no) return;
      noCountMap[no] = (noCountMap[no] || 0) + 1;
    });

    excelData.value = jsonData
      .map((row) => ({
        tick: false,
        hide: false,
        name: normalizeValue(row.name ?? row.Name ?? row['name']),
        pis: normalizeValue(row.pieces ?? row.pis ?? row['pieces']),
        fo: normalizeValue(row.fo ?? row.FO ?? row['fo']),
        no: normalizeValue(row.account_no ?? row.no ?? row.Account_No ?? row['account_no']),
      }))
      .filter((row) => {
        const no = row.no;
        return !!no && (noCountMap[no] ?? 0) > 1;
      });
  };

  reader.readAsArrayBuffer(file);
};

const hide = () => {
  excelData.value.forEach((row) => {
    if (row.tick) {
      row.hide = true;
    }
  });
};

const showAll = () => {
  excelData.value.forEach((row) => {
    row.hide = false;
  });
};
</script>

<template>
  <div class="page">
    <div>
      <input type="file" id="fileInput" accept=".xlsx, .xls" @change="loadData($event)">
    </div>

    <div id="tableContainer">
      <table id="dataTable">
        <thead>
          <tr>
            <th><button class="diaomao" @dblclick="showAll" @click="hide">点击</button></th>
            <th>name</th>
            <th>Pic</th>
            <th>fo</th>
            <th>No</th>
          </tr>
        </thead>

        <tbody id="tableBody">
          <tr
            v-for="(row, index) in excelData"
            :key="index"
            :class="{ 'row-checked': row.tick }"
            v-show="!row.hide"
          >
            <td><input type="checkbox" v-model="row.tick" /></td>
            <td>{{ row.name }}</td>
            <td>{{ row.pis }}</td>
            <td>{{ row.fo }}</td>
            <td>{{ row.no }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 32px;
}

#tableContainer {
  margin-top: 20px;
  overflow: auto;
}

#dataTable {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px 10px;
  text-align: left;
}

th {
  background: #f5f5f5;
}

button {
  padding: 6px 12px;
  cursor: pointer;
}

.row-checked td {
  color: #777;
  opacity: 0.6;
  text-decoration: line-through;
}
</style>