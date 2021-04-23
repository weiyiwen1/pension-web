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
      <el-table-column type="selection" width="55" />
      <el-table-column label="退住类型" width="100px">
        <template slot-scope="scope">
          {{ scope.row.checkoutType | typeFilter }}
        </template>
      </el-table-column>
      <el-table-column label="退住时间" width="110px" align="center">
        <template slot-scope="scope">
          {{ scope.row.checkoutDate | dateformat('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column label="死亡时间" width="110px" align="center">
        <template slot-scope="scope">
          {{ scope.row.deathDate | dateformat('YYYY-MM-DD') }}
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
          <el-tooltip content="确认退住" placement="top">
            <el-button v-if="scope.row.status=='checkout_apply'" v-waves type="primary" size="mini" @click="handleConfirm(scope.$index,scope.row.id)">确认退住</el-button>
          </el-tooltip>
          <el-tooltip content="取消" placement="top">
            <el-button v-if="scope.row.status=='checkout_apply'" v-waves :loading="scope.row.delete" type="danger" size="mini" @click="handleCancel(scope.$index,scope.row.id)">取消</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 表单 -->
    <checkoutForm ref="formChargeType" :checkin-no="checkinNo" @updateRow="updateRow" />
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { findByCheckinNo, cancel } from '@/api/checkout'
import checkoutForm from './checkout-form'
import waves from '@/directive/waves'

export default {
  name: 'ChargeType',
  components: { checkoutForm },
  directives: {
    waves
  },
  filters: {
    enabledFilter(enabled) {
      const enabledMap = {
        0: '禁用',
        1: '正常'
      }
      return enabledMap[enabled]
    },
    typeFilter(type) {
      const typeMap = {
        'normal': '正常退住',
        'death': '死亡退住'
      }
      return typeMap[type]
    },
    statusFilter(status) {
      const statusMap = {
        'checkout_apply': '申请退住',
        'unsettled_accounts': '退住未结算',
        'already_check_out': '已退住',
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
      listLoading: true,
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
      findByCheckinNo(this.checkinNo).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    handleFilter() {
      this.fetchList()
    },
    handleFilterClear() {
      this.fetchList()
    },
    checkoutManager() {
      this.dialogFormVisible = true
      this.fetchList()
    },
    closeDialog() {
      this.$emit('findBedList')
      this.dialogFormVisible = false
    },
    handleApply() {
      this.$refs.formChargeType.handleApply()
    },
    handleConfirm(index, id) {
      this.currentIndex = index
      this.$refs.formChargeType.handleConfirm(id)
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
      this.$confirm('此操作将取消该退住申请, 是否继续?', '提示', {
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
