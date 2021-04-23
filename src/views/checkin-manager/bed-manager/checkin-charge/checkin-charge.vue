<template>
  <el-dialog title="费用设置" :visible.sync="dialogFormVisible" width="70%">
    <!-- 操作 -->
    <el-row style="margin-bottom: 10px;">
      <el-col :xs="24" :sm="24" :lg="24">
        <el-button-group>
          <el-button type="primary" icon="el-icon-refresh" @click="handleFilterClear" />
          <el-button type="primary" icon="el-icon-plus" @click="handleCreate" />
        </el-button-group>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <vxe-grid
      ref="priceTable"
      border
      show-overflow
      :loading="listLoading"
      :data="list"
      :columns="tableColumn"
      :edit-config="{trigger: 'click', mode: 'cell'}"
    >
      <template v-slot:delete_row="scope">
        <vxe-button type="text" icon="el-icon-delete" value="删除" @click="handleDelete(scope.$rowIndex)" />
      </template>
    </vxe-grid>

    <!-- 表单 -->
    <selectCharge ref="formCheckinCharge" :org-id="orgId" :nursing-level-map="nursingLevelMap" :type-map="typeMap" @handleSelectCharge="handleSelectCharge" />
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="saveData()">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { findChargeByCheckinNo, del, edit, saveCheckinCharge } from '@/api/checkin'
import { findByOrg as findChargeType } from '@/api/chargetype'
import { findByOrg as findNursingLevel } from '@/api/nursinglevel'
import waves from '@/directive/waves'
import selectCharge from './select-charge'

export default {
  name: 'CheckinCharge',
  components: { selectCharge },
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
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      btnLoading: false,
      dialogFormVisible: false,
      nursingLevelMap: {},
      typeMap: {},
      typeList: [],
      chargeIntervalList: [
        {
          value: 'once',
          label: '一次性'
        },
        {
          value: 'day',
          label: '天'
        },
        {
          value: 'month',
          label: '月'
        }
      ],
      tableColumn: [
        { type: 'seq', title: '序号', width: 80 },
        { field: 'chargeTypeId', title: '统计科目', width: 160, editRender: { name: 'ElSelect', options: [], optionProps: { value: 'id', label: 'name' }}},
        { field: 'chargeInterval', title: '周期', width: 160, editRender: { name: 'ElSelect', options: [] }},
        { field: 'price', title: '单价', width: 140, editRender: { name: 'ElInput', props: { type: 'float', digits: 2 }}},
        { field: 'quantity', title: '数量', width: 140, editRender: { name: 'ElInput', props: { type: 'number' }}},
        { field: 'leaveRefund', title: '请假退费', width: 140, editRender: { name: 'ElSwitch', type: 'visible', props: { activeValue: '1', inactiveValue: '0' }}},
        { field: 'suspend', title: '是否暂停', width: 140, editRender: { name: 'ElSwitch', type: 'visible', props: { activeValue: '1', inactiveValue: '0' }}},
        { field: 'op', title: '操作', slots: { default: 'delete_row' }}
      ],
      temp: {
        id: '',
        orgId: '',
        name: '',
        chargeItemNo: '',
        chargeTypeId: '',
        leaveRefund: '',
        sort: 0
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
    findNursingLevel() {
      findNursingLevel(this.orgId).then(response => {
        const nursingLevelList = response.data
        if (nursingLevelList.length > 0) {
          for (let i = 0; i < nursingLevelList.length; i++) {
            const nursingLevel = nursingLevelList[i]
            this.nursingLevelMap[nursingLevel.id] = nursingLevel.name
          }
        }
      })
    },
    findChargeType() {
      findChargeType(this.orgId).then(response => {
        this.tableColumn[1].editRender.options = response.data
        this.typeList = response.data
        this.tableColumn[2].editRender.options = this.chargeIntervalList
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
      findChargeByCheckinNo(this.orgId, this.checkinNo).then(response => {
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
    handleSizeChange(val) {
      this.fetchList()
    },
    handleCurrentChange(val) {
      this.fetchList()
    },
    handleModifyEnabled(index, id, enabled) {
      this.list[index]['enabled'] = 1 - enabled
      edit(id, 'enabled', 1 - enabled).then(response => {})
    },
    handleSelectionChange(val) {
      if (val.length > 0) {
        this.buttonDisabled = false
      } else {
        this.buttonDisabled = true
      }
    },
    chargeSetting() {
      this.dialogFormVisible = true
      this.findChargeType()
      this.findNursingLevel()
      this.fetchList()
    },
    handleCreate() {
      this.$refs.formCheckinCharge.selectCharge()
    },
    handleSelectCharge(row) {
      row.chargeItemId = row.id
      row.id = ''
      row.quantity = 1
      row.suspend = '0'
      this.list.push(row)
    },
    updateRow(temp) {
      if (this.currentIndex >= 0 && temp.id) {
        this.list.splice(this.currentIndex, 1, temp)
      } else {
        if (this.list.length >= 10) {
          this.list.pop()
        }
        this.list.push(temp)
      }
      this.currentIndex = -1
    },
    saveData() {
      const _this = this
      const data = { orgId: this.orgId, checkinNo: this.checkinNo, checkinCharge: this.list }
      saveCheckinCharge(data).then(response => {
        if (response.code === 20000) {
          _this.dialogFormVisible = false
          _this.$message.success(response.message)
        } else {
          _this.$message.error(response.message)
        }
        _this.btnLoading = false
      }).catch(() => {
        this.btnLoading = false
      })
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
