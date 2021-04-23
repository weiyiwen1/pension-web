<template>
  <el-dialog title="费用查询" :visible.sync="dialogFormVisible" width="50%">
    <!-- 搜索 -->
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
    >
      <el-table-column label="费用名称" width="110px" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="统计科目" prop="chargeTypeId" :formatter="typeFormatter" min-width="100px" />
      <el-table-column label="周期" prop="chargeInterval" :formatter="chargeIntervalFormatter" min-width="100px" />
      <el-table-column label="单价" width="110px" align="center">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column label="数量" width="110px" align="center">
        <template slot-scope="scope">
          {{ scope.row.quantity }}
        </template>
      </el-table-column>
      <el-table-column label="金额" width="110px" align="center">
        <template slot-scope="scope">
          {{ scope.row.amount }}
        </template>
      </el-table-column>
    </el-table>

  </el-dialog>
</template>

<script>
import { findByCheckinNo } from '@/api/billdetail'
import { findByOrg as findChargeType } from '@/api/chargetype'
import waves from '@/directive/waves'
import { getMonth } from '@/utils'

export default {
  name: 'ChargeQuery',
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
      queryDate: [getMonth('s', 0), getMonth('e', 0)],
      dialogFormVisible: false,
      listLoading: true,
      showSearch: false,
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
      buttonDisabled: true,
      deleting: false,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '本月',
          onClick(picker) {
            picker.$emit('pick', [getMonth('s', 0), getMonth('e', 0)])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      currentIndex: -1
    }
  },
  watch: {
  },
  created() {
  },
  methods: {
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
    fetchList(checkinNo) {
      this.listLoading = true
      if (this.queryDate.length > 1) {
        this.listQuery.startDate = this.queryDate[0]
        this.listQuery.endDate = this.queryDate[1]
      }
      if (checkinNo) {
        this.listQuery.checkinNo = checkinNo
      }
      findByCheckinNo(this.listQuery).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    chargeIntervalFormatter(val) {
      return this.chargeIntervalMap[val.chargeInterval]
    },
    typeFormatter(val) {
      return this.typeMap[val.chargeTypeId]
    },
    handleFilter() {
      this.fetchList()
    },
    handleFilterClear() {
      this.listQuery = {
        checkinNo: '',
        startDate: '',
        endDate: ''
      }
      this.fetchList()
    },
    chargeQuery(checkinNo) {
      this.dialogFormVisible = true
      this.findChargeType()
      this.fetchList(checkinNo)
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
