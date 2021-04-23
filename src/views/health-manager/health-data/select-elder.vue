<template>
  <el-dialog title="选择老人" :modal="false" :visible.sync="dialogFormVisible">
    <!-- 搜索 -->
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="form-inline">
        <el-form-item label="">
          <el-input v-model="listQuery.name" placeholder="姓名" clearable size="small" />
        </el-form-item>
        <el-form-item>
          <el-button v-waves type="primary" icon="el-icon-search" size="small" @click="handleFilter">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="姓名" min-width="80px">
        <template slot-scope="scope"> {{ scope.row.name }} </template>
      </el-table-column>
      <el-table-column label="性别" min-width="50px">
        <template slot-scope="scope">{{ scope.row.gender | genderFilter }}</template>
      </el-table-column>
      <el-table-column label="身份证" min-width="160px">
        <template slot-scope="scope"> {{ scope.row.idcard }} </template>
      </el-table-column>
      <el-table-column label="手机号" min-width="100px">
        <template slot-scope="scope"> {{ scope.row.mobile }} </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120px" class-name="small-padding">
        <template slot-scope="scope">
          <el-button v-waves type="primary" @click="confirmSelect(scope.row)">选择</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination v-show="total>0" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.psize" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

  </el-dialog>
</template>

<script>
import { findPage } from '@/api/elder'
import waves from '@/directive/waves'
import { pickerOptions, calcAge } from '@/utils'

export default {
  name: 'Elder',
  components: { },
  directives: {
    waves
  },
  filters: {
    genderFilter(gender) {
      const genderMap = {
        1: '男',
        2: '女'
      }
      return genderMap[gender]
    }
  },
  data() {
    return {
      gender: {
        1: '男',
        2: '女'
      },
      tableKey: 0,
      list: null,
      total: null,
      selectedRows: null,
      listLoading: true,
      showSearch: false,
      listQuery: {
        page: 1,
        psize: 10,
        orgId: '',
        name: ''
      },
      dialogFormVisible: false,
      buttonDisabled: true,
      deleting: false,
      pickerOptions: pickerOptions,
      currentIndex: -1
    }
  },
  watch: {
  },
  created() {
  },
  methods: {
    fetchList() {
      this.listLoading = true
      findPage(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.totalRow
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchList()
    },
    handleFilterClear() {
      this.listQuery = {
        page: 1,
        psize: 10,
        orgId: '',
        name: ''
      }
      this.fetchList()
    },
    handleSizeChange(val) {
      this.listQuery.psize = val
      this.fetchList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.fetchList()
    },
    handleCreate() {
      this.dialogFormVisible = true
      this.fetchList()
    },
    confirmSelect(elder) {
      elder.age = calcAge(elder.birthday)
      elder.genderName = this.gender[elder.gender]
      console.log(elder)
      this.$emit('confirmSelectElder', elder)
      this.dialogFormVisible = false
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
	.text-red{
		color: red;
		cursor: pointer;
	}
	.text-green{
		color: green;
		cursor: pointer;
	}
</style>
