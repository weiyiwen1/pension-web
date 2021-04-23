<template>
  <el-dialog title="退住管理" :visible.sync="dialogFormVisible">

    <!-- 操作 -->
    <el-row style="margin-bottom: 10px;">
      <el-col :xs="24" :sm="24" :lg="24">
        <el-button-group>
          <el-button type="primary" icon="el-icon-plus" @click="handleApply" />
        </el-button-group>
      </el-col>
    </el-row>

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
      <el-table-column label="请假开始时间" width="160px" align="center">
        <template slot-scope="scope">
          {{ scope.row.leaveTime | dateformat('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column label="预计请假天数" width="110px">
        <template slot-scope="scope">
          {{ scope.row.expectDays }}
        </template>
      </el-table-column>
      <el-table-column label="销假时间" width="110px" align="center">
        <template slot-scope="scope">
          {{ scope.row.backTime | dateformat('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column label="实际请假天数" width="110px">
        <template slot-scope="scope">
          {{ scope.row.realDays }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="110px" align="center">
        <template slot-scope="scope">
          {{ scope.row.status | statusFilter }}
        </template>
      </el-table-column>
      <el-table-column label="原因" width="110px" align="center">
        <template slot-scope="scope">
          {{ scope.row.reason }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180px" class-name="small-padding">
        <template slot-scope="scope">
          <el-tooltip content="确认" placement="top">
            <el-button v-if="scope.row.status=='apply'" v-waves type="primary" size="mini" @click="handleConfirm(scope.$index,scope.row.id)">确认请假</el-button>
          </el-tooltip>
          <el-tooltip content="销假" placement="top">
            <el-button v-if="scope.row.status=='leaving'" v-waves type="primary" size="mini" @click="handleReportBack(scope.$index,scope.row.id)">销假</el-button>
          </el-tooltip>
          <el-tooltip content="取消" placement="top">
            <el-button v-if="scope.row.status!=='returned' && scope.row.status!=='cancel'" v-waves :loading="scope.row.delete" type="danger" size="mini" @click="handleCancel(scope.$index,scope.row.id)">取消</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination v-show="total>0" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.psize" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <!-- 表单 -->
    <leaveForm ref="formLeave" :checkin-no="checkinNo" @updateRow="updateRow" />
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { findPage, cancel } from '@/api/leave'
import leaveForm from './leave-form'
import waves from '@/directive/waves'

export default {
  name: 'ChargeType',
  components: { leaveForm },
  directives: {
    waves
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        'apply': '申请',
        'leaving': '请假中',
        'returned': '已销假',
        'cancel': '已取消'
      }
      return statusMap[status]
    }
  },
  props: {
    checkinNo: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tableKey: 0,
      dialogFormVisible: false,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        psize: 10
      },
      buttonDisabled: true,
      deleting: false,
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
      findPage(this.checkinNo).then(response => {
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
    leaveRecord() {
      this.dialogFormVisible = true
      this.fetchList()
    },
    closeDialog() {
      this.$emit('findBedList')
      this.dialogFormVisible = false
    },
    handleApply() {
      this.$refs.formLeave.handleApply()
    },
    handleConfirm(index, id) {
      this.currentIndex = index
      this.$refs.formLeave.handleConfirm(id)
    },
    handleReportBack(index, id) {
      this.currentIndex = index
      this.$refs.formLeave.handleReportBack(id)
    },
    updateRow(temp) {
      if (this.currentIndex >= 0 && temp.id) {
        this.list.splice(this.currentIndex, 1, temp)
      } else {
        if (this.list.length >= 10) {
          this.list.pop()
        }
        this.list.unshift(temp)
      }
      this.currentIndex = -1
    },
    handleCancel(index, id) {
      const _this = this
      this.$confirm('此操作将取消该请假申请, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.currentIndex = index
        _this.$set(_this.list[index], 'delete', true)
        cancel(id).then(response => {
          if (response.code === 20000) {
            _this.updateRow(response.data)
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
