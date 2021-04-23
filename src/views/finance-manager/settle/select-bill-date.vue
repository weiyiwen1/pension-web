<template>
  <el-dialog title="选择账单日期" :visible.sync="dialogFormVisible" :modal="false" width="500px">

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
      <el-table-column label="时间" min-width="100px">
        <template slot-scope="scope">
          {{ formatDate(scope.row.startDate, 'yyyy-MM-dd') + ' 至 ' + formatDate(scope.row.endDate, 'yyyy-MM-dd') }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120px" class-name="small-padding">
        <template slot-scope="scope">
          <el-button v-waves :loading="scope.row.select" @click="handleSelect(scope.$index,scope.row)">
            选择
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination v-show="total>0" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.psize" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { findGeneratePage } from '@/api/bill'
import { formatDate } from '@/utils'
import waves from '@/directive/waves'

export default {
  name: 'SelectBillDate',
  directives: {
    waves
  },
  filters: {
  },
  props: {
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      btnLoading: false,
      dialogFormVisible: false,
      buttonDisabled: true,
      deleting: false,
      currentIndex: -1,
      listQuery: {
        page: 1,
        psize: 10
      }
    }
  },
  watch: {
  },
  created() {
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
      findGeneratePage(this.listQuery).then(response => {
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
        psize: 10
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
    handleSelectBillDate() {
      this.dialogFormVisible = true
      this.fetchList()
    },
    handleSelect(index, row) {
      this.$emit('handleSelectCharge', row)
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
