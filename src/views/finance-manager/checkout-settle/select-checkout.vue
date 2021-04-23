<template>
  <el-dialog title="选择退住人" :visible.sync="dialogFormVisible" :modal="false">

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
      <el-table-column label="入住号" min-width="100px">
        <template slot-scope="scope">
          {{ scope.row.checkinNo }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" min-width="100px">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="床位" min-width="130px">
        <template slot-scope="scope">
          {{ scope.row.buildingName + scope.row.floorName + scope.row.bedName }}
        </template>
      </el-table-column>
      <el-table-column label="护理等级" min-width="100px">
        <template slot-scope="scope">
          {{ nursingLevelMap[scope.row.nursingLevelId] }}
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="100px">
        <template slot-scope="scope">
          {{ checkinStatus[scope.row.status] }}
        </template>
      </el-table-column>
      <el-table-column label="入住时间" min-width="100px">
        <template slot-scope="scope">
          {{ formatDate(scope.row.checkinDate, "yyyy-MM-dd") }}
        </template>
      </el-table-column>
      <el-table-column label="退住时间" min-width="100px">
        <template slot-scope="scope">
          {{ formatDate(scope.row.checkoutDate, "yyyy-MM-dd") }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120px" class-name="small-padding">
        <template slot-scope="scope">
          <el-button v-waves :loading="scope.row.select" type="danger" size="mini" @click="handleSelect(scope.$index,scope.row)">
            选择
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { findUnSettleCheckoutList } from '@/api/checkin'
import { findByOrg as findNursingLevel } from '@/api/nursinglevel'
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
      listLoading: true,
      btnLoading: false,
      dialogFormVisible: false,
      buttonDisabled: true,
      deleting: false,
      currentIndex: -1,
      listQuery: {
        page: 1,
        psize: 10,
        name: ''
      },
      nursingLevelList: [],
      nursingLevelMap: {},
      checkinStatus: {
        checking_in: '正在办理入住',
        already_check_in: '在住',
        checkout_apply: '办理退住',
        unsettled_accounts: '退住未结算',
        already_check_out: '退住'
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
    fetchList() {
      this.listLoading = true
      findUnSettleCheckoutList(this.listQuery).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchList()
    },
    handleSelectCheckout() {
      this.dialogFormVisible = true
      this.findNursingLevel()
      this.fetchList()
    },
    handleSelect(index, row) {
      this.$emit('selectCheckout', row)
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
