<template>
  <el-table
    :data="tableData"
    border
    style="width: 800px"
  >
    <el-table-column prop="name" label="疾病名称" />
    <el-table-column prop="medicine" label="药品名称" />
    <el-table-column prop="usage" label="用法" />
    <el-table-column prop="frequency" label="频次" />
    <el-table-column prop="quantity" label="用量" />
    <el-table-column prop="date" label="日期" />
  </el-table>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        { name: '冠心病', medicine: '阿司匹林', usage: '口服', quantity: '1片', frequency: '一日3次', date: '' },
        { name: '冠心病', medicine: '阿托伐他汀钙片', usage: '口服', quantity: '1片', frequency: '一日1次', date: '' }
      ]
    }
  }
}
</script>
