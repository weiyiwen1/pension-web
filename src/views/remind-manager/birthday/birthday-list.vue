<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="form-inline">
        <el-form-item label="">
          <el-select v-model="listQuery.month" placeholder="请选择">
            <el-option
              v-for="item in months"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          月
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
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="入住号" min-width="70px">
        <template slot-scope="scope">
          {{ scope.row.checkinNo }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" min-width="70px">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="出生日期" min-width="90px">
        <template slot-scope="scope">
          {{ formatDate(scope.row.birthday, "yyyy-MM-dd") }}
        </template>
      </el-table-column>
      <el-table-column label="手机号" min-width="100px">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
        </template>
      </el-table-column>
      <el-table-column label="身份证" min-width="150px">
        <template slot-scope="scope">
          {{ scope.row.idcard }}
        </template>
      </el-table-column>
      <el-table-column label="床位" min-width="150px">
        <template slot-scope="scope">
          {{ scope.row.buildingName + scope.row.floorName + scope.row.bedName }}
        </template>
      </el-table-column>
      <el-table-column label="护理等级" min-width="100px">
        <template slot-scope="scope">
          {{ nursingLevelMap[scope.row.nursingLevelId] }}
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="50px">
        <template slot-scope="scope">
          {{ checkinStatus[scope.row.status] }}
        </template>
      </el-table-column>
      <el-table-column label="入住时间" min-width="100px">
        <template slot-scope="scope">
          {{ formatDate(scope.row.checkinDate, "yyyy-MM-dd") }}
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { findBirthdayList } from '@/api/checkin'
import { findByOrg as findNursingLevel } from '@/api/nursinglevel'
import waves from '@/directive/waves'
import { pickerOptions, formatDate } from '@/utils'

export default {
  name: 'BirthdayList',
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
      selectedRows: null,
      listLoading: false,
      showSearch: false,
      listQuery: {
        month: 1
      },
      months: [{
        label: '1月',
        value: 1
      }, {
        label: '2月',
        value: 2
      }, {
        label: '3月',
        value: 3
      }, {
        label: '4月',
        value: 4
      }, {
        label: '5月',
        value: 5
      }, {
        label: '6月',
        value: 6
      }, {
        label: '7月',
        value: 7
      }, {
        label: '8月',
        value: 8
      }, {
        label: '9月',
        value: 9
      }, {
        label: '10月',
        value: 10
      }, {
        label: '11月',
        value: 11
      }, {
        label: '12月',
        value: 12
      }],
      nursingLevelList: [],
      nursingLevelMap: {},
      checkinStatus: {
        checking_in: '正在办理入住',
        already_check_in: '在住',
        checkout_apply: '办理退住',
        unsettled_accounts: '退住未结算',
        already_check_out: '退住'
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
    this.findNursingLevel()
    this.fetchList()
  },
  methods: {
    fetchList() {
      this.listLoading = true
      findBirthdayList(this.listQuery).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    findNursingLevel() {
      findNursingLevel().then(response => {
        this.nursingLevelList = response.data
        if (this.nursingLevelList.length > 0) {
          for (let i = 0; i < this.nursingLevelList.length; i++) {
            const nursingLevel = this.nursingLevelList[i]
            this.nursingLevelMap[nursingLevel.id] = nursingLevel.name
          }
        }
      })
    },
    formatDate(date, format) {
      if (!date) {
        return ''
      }
      return formatDate(new Date(date), format)
    },
    handleFilter() {
      this.fetchList()
    },
    handleSelectionChange(val) {
      if (val.length > 0) {
        this.buttonDisabled = false
      } else {
        this.buttonDisabled = true
      }
      this.selectedRows = val
    },
    handleCreate() {
      this.$refs.formNursingLevel.handleCreate()
    },
    handleUpdate(index, id) {
      this.currentIndex = index
      this.$refs.formNursingLevel.handleUpdate(id)
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
