<template>
  <el-dialog title="费用统计" :visible.sync="dialogFormVisible" width="50%">
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
      <el-table-column type="selection" width="55" />
      <el-table-column label="姓名" width="100px">
        <template slot-scope="scope">
          {{ scope.row.personName }}
        </template>
      </el-table-column>
      <el-table-column label="入住号" width="110px" align="center">
        <template slot-scope="scope">
          {{ scope.row.checkinNo }}
        </template>
      </el-table-column>
      <el-table-column label="床位" width="110px" align="center">
        <template slot-scope="scope">
          {{ scope.row.floorName + '' + scope.row.bedName }}
        </template>
      </el-table-column>
      <el-table-column v-for="type in typeList" :key="type.id" :label="type.name" width="110px" align="center">
        <template slot-scope="scope">
          {{ scope.row['type'+type.id] }}
        </template>
      </el-table-column>
    </el-table>

  </el-dialog>
</template>

<script>
import { floorBillDetailStatistics } from '@/api/billdetail'
import waves from '@/directive/waves'
import { getMonth } from '@/utils'

export default {
  name: 'BillDetailStatistics',
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
      queryDate: [getMonth('s', 0), getMonth('e', 0)],
      dialogFormVisible: false,
      listLoading: true,
      showSearch: false,
      typeMap: {},
      typeList: [],
      listQuery: {
        floorId: '',
        startDate: '',
        endDate: ''
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
    fetchList(fId) {
      this.listLoading = true
      if (this.queryDate.length > 1) {
        this.listQuery.startDate = this.queryDate[0]
        this.listQuery.endDate = this.queryDate[1]
      }
      if (fId) {
        this.listQuery.floorId = fId
      }
      floorBillDetailStatistics(this.listQuery).then(response => {
        this.list = response.data.list
        this.typeList = response.data.typeList
        if (this.typeList.length > 0) {
          for (let i = 0; i < this.typeList.length; i++) {
            const type = this.typeList[i]
            this.typeMap[type.id] = type.name
          }
        }
        this.listLoading = false
      })
    },
    handleFilter() {
      this.fetchList()
    },
    handleFilterClear() {
      this.listQuery = {
        floorId: '',
        startDate: '',
        endDate: ''
      }
      this.fetchList()
    },
    chargeStatistics(fId) {
      this.dialogFormVisible = true
      this.fetchList(fId)
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
