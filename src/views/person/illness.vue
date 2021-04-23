<template>
  <el-table
    :data="tableData"
    border
    style="width: 500px"
  >
    <el-table-column prop="name" label="疾病" />
    <el-table-column prop="date" label="日期">
      <template slot-scope="scope">
        <el-date-picker v-model="scope.row.date" type="date" placeholder="选择日期" />
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        { name: '高血压', date: '2020-01-03' },
        { name: '糖尿病', date: '' },
        { name: '冠心病', date: '' },
        { name: '慢阻肺', date: '' },
        { name: '恶性肿瘤', date: '' },
        { name: '脑卒中', date: '' },
        { name: '重性精神病', date: '' },
        { name: '结核病', date: '' },
        { name: '肝炎', date: '' },
        { name: '其他传染病', date: '' },
        { name: '职业病', date: '' },
        { name: '其他', date: '' },
        { name: '脑梗死', date: '' },
        { name: '阿兹海默症', date: '' }
      ]
    }
  }
}
</script>
