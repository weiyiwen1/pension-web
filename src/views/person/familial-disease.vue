<template>
  <el-table
    :data="tableData"
    border
    style="width: 500px"
  >
    <el-table-column prop="name" label="疾病" />
    <el-table-column prop="n1" label="父亲">
      <template>
        <el-checkbox />
      </template>
    </el-table-column>
    <el-table-column prop="n2" label="父亲">
      <template>
        <el-checkbox />
      </template>
    </el-table-column>
    <el-table-column prop="n3" label="兄弟姐妹">
      <template>
        <el-checkbox />
      </template>
    </el-table-column>
    <el-table-column prop="n4" label="子女">
      <template>
        <el-checkbox />
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        { name: '高血压' },
        { name: '糖尿病' },
        { name: '冠心病' },
        { name: '慢阻肺' },
        { name: '恶性肿瘤' },
        { name: '脑卒中' },
        { name: '重性精神病' },
        { name: '结核病' },
        { name: '肝炎' },
        { name: '其他传染病' },
        { name: '职业病' },
        { name: '其他' },
        { name: '脑梗死' },
        { name: '阿兹海默症' }
      ]
    }
  }
}
</script>
