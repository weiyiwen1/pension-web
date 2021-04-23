<template>
  <el-table
    :data="tableData"
    border
    style="width: 800px"
  >
    <el-table-column prop="type" label="类型" />
    <el-table-column prop="time" label="用餐时间" />
    <el-table-column prop="limit" label="期限" />
  </el-table>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        { type: '普通饮食', time: '早餐', limit: '2020-09-11 至 2020-11-30' },
        { type: '普通饮食', time: '午餐', limit: '2020-09-11 至 2020-11-30' },
        { type: '普通饮食', time: '晚餐', limit: '2020-09-11 至 2020-11-30' }
      ]
    }
  }
}
</script>
