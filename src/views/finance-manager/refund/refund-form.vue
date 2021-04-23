<template>
  <el-dialog title="退费" :visible.sync="dialogFormVisible" width="70%">
    <el-row>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>已执行费用</span>
          </div>
          <div class="filter-container">
            <el-form :inline="true" :model="listQuery" class="form-inline">
              <el-form-item label="">
                <el-date-picker
                  v-model="queryDate"
                  type="daterange"
                  align="left"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                />
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
            <el-table-column label="收费项目" width="110px" align="left">
              <template slot-scope="scope">
                {{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column label="价格" width="80px" align="left">
              <template slot-scope="scope">
                {{ scope.row.price }}
              </template>
            </el-table-column>
            <el-table-column label="数量" width="80px" align="left">
              <template slot-scope="scope">
                {{ scope.row.quantity }}
              </template>
            </el-table-column>
            <el-table-column label="金额" width="80px" align="left">
              <template slot-scope="scope">
                {{ scope.row.amount }}
              </template>
            </el-table-column>
            <el-table-column label="费用日期" width="110px" align="left">
              <template slot-scope="scope">
                {{ scope.row.startDate }}
              </template>
            </el-table-column>
            <el-table-column label="执行时间" width="110px" align="left">
              <template slot-scope="scope">
                {{ scope.row.createTime }}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="150px" class-name="small-padding">
              <template slot-scope="scope">
                <el-button v-waves :loading="scope.row.delete" type="danger" size="mini" @click="handleSelect(scope.$index,scope.row)">选择</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>已选退费项</span>
          </div>
          <!-- 表格 -->
          <el-table
            :key="tableKey"
            v-loading="selectedListLoading"
            :data="selectedList"
            border
            fit
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column label="收费项目" width="110px" align="left">
              <template slot-scope="scope">
                {{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column label="价格" width="80px" align="left">
              <template slot-scope="scope">
                {{ scope.row.price }}
              </template>
            </el-table-column>
            <el-table-column label="数量" width="80px" align="left">
              <template slot-scope="scope">
                {{ scope.row.quantity }}
              </template>
            </el-table-column>
            <el-table-column label="金额" width="80px" align="left">
              <template slot-scope="scope">
                {{ scope.row.amount }}
              </template>
            </el-table-column>
            <el-table-column label="费用日期" width="110px" align="left">
              <template slot-scope="scope">
                {{ scope.row.startDate }}
              </template>
            </el-table-column>
            <el-table-column label="执行时间" width="110px" align="left">
              <template slot-scope="scope">
                {{ scope.row.createTime }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="refund()">确认退费</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { findByCheckinNo, confirmRefund } from '@/api/billdetail'
import { findByOrg as findChargeType } from '@/api/chargetype'
import { pickerOptions, formatDate } from '@/utils'
import waves from '@/directive/waves'
import { getMonth } from '@/utils'

export default {
  name: 'RefundForm',
  directives: {
    waves
  },
  props: {
    checkinNo: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      btnLoading: false,
      tableKey: 0,
      list: null,
      selectedList: [],
      total: null,
      selectedRows: null,
      selectedListLoading: false,
      listLoading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      pickerOptions: pickerOptions,
      queryDate: [getMonth('s', 0), getMonth('e', 0)],
      typeMap: {},
      typeList: [],
      listQuery: {
        checkinNo: '',
        startDate: '',
        endDate: ''
      },
      chargeIntervalMap: {
        once: '一次性',
        day: '天',
        month: '月'
      },
      roles: {
        name: [{ required: true, message: '名称必填', trigger: 'blur' }]
      }
    }
  },
  computed: {
  },
  watch: {
    dialogFormVisible: function() {
      this.resetTemp()
    }
  },
  created() {
  },
  destroyed() {

  },
  methods: {
    resetTemp() {
    },
    findChargeType() {
      findChargeType().then(response => {
        this.typeList = response.data
        if (this.typeList.length > 0) {
          for (let i = 0; i < this.typeList.length; i++) {
            const type = this.typeList[i]
            this.typeMap[type.id] = type.name
          }
        }
      })
    },
    fetchList() {
      this.listLoading = true
      if (this.queryDate.length > 1) {
        this.listQuery.startDate = this.queryDate[0]
        this.listQuery.endDate = this.queryDate[1]
      }
      this.listQuery.checkinNo = this.checkinNo
      findByCheckinNo(this.listQuery).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    handleFilter() {
      this.fetchList()
    },
    formatDate(date, format) {
      if (!date) {
        return ''
      }
      return formatDate(new Date(date), format)
    },
    chargeIntervalFormatter(val) {
      return this.chargeIntervalMap[val.chargeInterval]
    },
    typeFormatter(val) {
      return this.typeMap[val.chargeTypeId]
    },
    handleRefund(id) {
      this.dialogFormVisible = true
      this.findChargeType()
      this.fetchList()
    },
    handleSelect(index, row) {
      this.selectedList.push(row)
      this.list.splice(index, 1)
    },
    refund() {
      this.btnLoading = true
      const _this = this
      const data = this.selectedList
      confirmRefund(data).then(response => {
        if (response.code === 20000) {
          this.$emit('fetchCheckinList')
          _this.dialogFormVisible = false
          _this.$message.success(response.message)
        } else {
          _this.$message.error(response.message)
        }
        _this.btnLoading = false
      }).catch(() => {
        this.btnLoading = false
      })
    }
  }
}
</script>
