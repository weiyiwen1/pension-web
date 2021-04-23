<template>
  <el-dialog title="选择费用" :visible.sync="dialogFormVisible" :modal="false">

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
      <el-table-column label="收费项目" min-width="100px">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="统计科目" prop="chargeTypeId" :formatter="typeFormatter" min-width="100px" />
      <el-table-column label="请假退费" min-width="100px">
        <template slot-scope="scope">
          <span :class="{'el-icon-success text-green':scope.row.leaveRefund == 1,'el-icon-error text-red':scope.row.leaveRefund == 0}">{{ scope.row.leaveRefund | leaveRefundFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="护理等级" prop="nursingLevelId" :formatter="nursingLevelFormatter" min-width="100px" />
      <el-table-column label="周期" prop="chargeInterval" :formatter="chargeIntervalFormatter" min-width="100px" />
      <el-table-column label="单价" min-width="100px">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120px" class-name="small-padding">
        <template slot-scope="scope">
          <el-button v-waves :loading="scope.row.select" type="danger" @click="handleSelect(scope.$index,scope.row)">
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
import { getChargeItemByOrg } from '@/api/chargeitem'
import waves from '@/directive/waves'

export default {
  name: 'CheckinCharge',
  directives: {
    waves
  },
  filters: {
    leaveRefundFilter(leaveRefund) {
      const leaveRefundMap = {
        0: '否',
        1: '是'
      }
      return leaveRefundMap[leaveRefund]
    }
  },
  props: {
    orgId: {
      type: String,
      default: ''
    },
    checkinNo: {
      type: String,
      default: ''
    },
    nursingLevelMap: {
      type: Object,
      default: () => {}
    },
    typeMap: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      listLoading: true,
      btnLoading: false,
      dialogFormVisible: false,
      chargeIntervalMap: {
        once: '一次性',
        day: '天',
        month: '月'
      },
      typeList: [],
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
      getChargeItemByOrg(this.orgId).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    nursingLevelFormatter(val) {
      return this.nursingLevelMap[val.nursingLevelId]
    },
    chargeIntervalFormatter(val) {
      return this.chargeIntervalMap[val.chargeInterval]
    },
    typeFormatter(val) {
      return this.typeMap[val.chargeTypeId]
    },
    handleFilterClear() {
      this.fetchList()
    },
    selectCharge() {
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
