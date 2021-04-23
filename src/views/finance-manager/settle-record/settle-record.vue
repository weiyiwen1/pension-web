<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="form-inline">
        <el-form-item label="">
          <el-input v-model="listQuery.checkinNo" placeholder="入住号" clearable size="small" />
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
      <el-table-column label="入住号" width="130px">
        <template slot-scope="scope">
          {{ scope.row.checkinNo }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="100px">
        <template slot-scope="scope">
          {{ scope.row.personName }}
        </template>
      </el-table-column>
      <el-table-column label="入住状态" width="110px">
        <template slot-scope="scope">
          {{ checkinStatus[scope.row.checkinStatus] }}
        </template>
      </el-table-column>
      <el-table-column label="结算号" min-width="100px">
        <template slot-scope="scope">
          {{ scope.row.billNo }}
        </template>
      </el-table-column>
      <el-table-column label="结算类型" min-width="100px">
        <template slot-scope="scope">
          {{ billType[scope.row.billType] }}
        </template>
      </el-table-column>
      <el-table-column label="结算金额" min-width="80px">
        <template slot-scope="scope">
          {{ scope.row.amount }}
        </template>
      </el-table-column>
      <el-table-column label="结算后余额" min-width="100px">
        <template slot-scope="scope">
          {{ scope.row.balanceSnapshot }}
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="100px">
        <template slot-scope="scope">
          {{ billStatus[scope.row.status] }}
        </template>
      </el-table-column>
      <el-table-column label="结算人" min-width="160px">
        <template slot-scope="scope">
          {{ scope.row.settleName }}
        </template>
      </el-table-column>
      <el-table-column label="结算时间" min-width="160px">
        <template slot-scope="scope">
          {{ formatDate(scope.row.settleTime, "yyyy-MM-dd hh:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120px" class-name="small-padding">
        <template slot-scope="scope">
          <el-button v-waves :loading="scope.row.detail" size="mini" @click="handleDetail(scope.$index,scope.row)">
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination v-show="total>0" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.psize" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

  </div>
</template>

<script>
import { findSettlePage, del } from '@/api/bill'
import waves from '@/directive/waves'
import { pickerOptions, formatDate } from '@/utils'

export default {
  name: 'MeterRule',
  components: { },
  directives: {
    waves
  },
  filters: {
  },
  data() {
    return {
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
      checkinStatus: {
        checking_in: '正在办理入住',
        already_check_in: '在住',
        checkout_apply: '办理退住',
        unsettled_accounts: '退住未结算',
        already_check_out: '退住'
      },
      billType: {
        normal: '普通结算',
        checkout: '退住结算'
      },
      billStatus: {
        wait_settle: '待结算',
        settled: '已结算',
        canceled: '已取消'
      },
      buttonDisabled: true,
      deleting: false,
      pickerOptions: pickerOptions,
      currentIndex: -1
    }
  },
  watch: {
  },
  created() {
    this.fetchList()
  },
  methods: {
    formatDate(date, format) {
      if (!date) {
        return ''
      }
      return formatDate(new Date(date), format)
    },
    fetchList() {
      this.listLoading = true
      findSettlePage(this.listQuery).then(response => {
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
      this.$refs.formMeterRule.handleCreate()
    },
    handleUpdate(index, id) {
      this.currentIndex = index
      this.$refs.formMeterRule.handleUpdate(id)
    },
    updateRow(temp) {
      if (this.currentIndex >= 0 && temp.id) {
        this.list.splice(this.currentIndex, 1, temp)
      } else {
        if (this.list.length >= 10) {
          this.list.pop()
        }
        this.list.push(temp)
        this.total = this.total + 1
      }
      this.currentIndex = -1
    },
    handleDelete(index, id) {
      const _this = this
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.$set(_this.list[index], 'delete', true)
        del(id).then(response => {
          if (response.code === 20000) {
            _this.list.splice(index, 1)
            _this.total = _this.total - 1
            _this.$notify.success(response.message)
          } else {
            _this.$notify.error(response.message)
          }
          _this.$set(_this.list[index], 'delete', false)
        }).catch(() => {
          _this.$set(_this.list[index], 'delete', false)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
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
