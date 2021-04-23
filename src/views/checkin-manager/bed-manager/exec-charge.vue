<template>
  <el-dialog title="费用执行" :visible.sync="dialogFormVisible" width="50%">
    <!-- 搜索 -->
    <el-form :inline="true" class="form-inline">
      <el-form-item label="费用周期">
        <el-select v-model="chargeInterval" placeholder="请选择" @change="chargeIntervalChange">
          <el-option
            v-for="item in chargeIntervalList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="费用日期">
        <el-date-picker
          v-model="chargeDate"
          :type="dateType"
          placeholder="选择日期"
          :clearable="false"
          @change="chargeDateChange"
        />
      </el-form-item>
      <el-form-item label="执行时间">
        <el-date-picker
          v-model="nowTime"
          type="datetime"
          placeholder="选择日期时间"
          format="yyyy-MM-dd HH:mm"
          :disabled="true"
        />
      </el-form-item>
    </el-form>
    <el-alert
      v-show="warningVisible"
      title="当前选择的费用日期已执行过费用，请勿重复执行！"
      type="warning"
      effect="light"
    />
    <!-- 表格 -->
    <vxe-grid
      ref="chargeTable"
      border
      show-overflow
      :loading="listLoading"
      :data="list"
      :columns="tableColumn"
      :edit-config="{trigger: 'click', mode: 'cell'}"
    >
      <template v-slot:type_default="{ row }">
        <span>
          {{ typeMap[row.chargeTypeId] }}
        </span>
      </template>
      <template v-slot:delete_row="scope">
        <vxe-button type="text" icon="el-icon-delete" value="删除" @click="handleDelete(scope.$rowIndex)" />
      </template>
    </vxe-grid>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="confirmExecCharge()">执行</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { findExecCharge, confirmExecCharge, isExecCharge } from '@/api/checkin'
import { findByOrg as findChargeType } from '@/api/chargetype'
import { getTime } from '@/utils'
import waves from '@/directive/waves'

export default {
  name: 'ExecCharge',
  directives: {
    waves
  },
  filters: {
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      btnLoading: false,
      listLoading: false,
      buttonDisabled: true,
      dialogFormVisible: false,
      warningVisible: false,
      deleting: false,
      currentIndex: -1,
      chargeDate: getTime(),
      nowTime: getTime(),
      typeMap: {},
      typeList: [],
      tableColumn: [
        { type: 'seq', title: '序号', width: 50 },
        { field: 'checkinNo', title: '入住号', width: 100 },
        { field: 'personName', title: '姓名', width: 100 },
        { field: 'name', title: '费用名称', width: 120 },
        { field: 'chargeTypeId', title: '统计科目', width: 120, solts: { default: 'type_default' }},
        { field: 'price', title: '单价', width: 100, editRender: { name: 'ElInput', props: { type: 'float', digits: 2 }}},
        { field: 'quantity', title: '数量', width: 100, editRender: { name: 'ElInput', props: { type: 'number' }}},
        { field: 'op', title: '操作', slots: { default: 'delete_row' }}
      ],
      chargeIntervalList: [
        {
          value: 'day',
          label: '天'
        },
        {
          value: 'month',
          label: '月'
        },
        {
          value: 'once',
          label: '一次性'
        }
      ],
      chargeInterval: 'day',
      dateType: 'date'
    }
  },
  watch: {
  },
  created() {
  },
  methods: {
    findChargeType() {
      findChargeType().then(response => {
        this.tableColumn[4].editRender.options = response.data
        this.typeList = response.data
        if (this.typeList.length > 0) {
          for (let i = 0; i < this.typeList.length; i++) {
            const type = this.typeList[i]
            this.typeMap[type.id] = type.name
          }
        }
      })
    },
    isExecCharge() {
      isExecCharge({ floorId: this.floorId, chargeInterval: this.chargeInterval, date: this.chargeDate }).then(response => {
        this.warningVisible = response.data
      })
    },
    fetchList() {
      this.listLoading = true
      findExecCharge({ floorId: this.floorId, chargeInterval: this.chargeInterval }).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    chargeIntervalChange(val) {
      if (val === 'day' || val === 'once') {
        this.dateType = 'date'
      } else if (val === 'month') {
        this.dateType = 'month'
      }
      this.isExecCharge()
      this.fetchList()
    },
    chargeDateChange() {
      this.isExecCharge()
      this.fetchList()
    },
    execCharge(fId) {
      this.dialogFormVisible = true
      this.floorId = fId
      this.isExecCharge()
      this.findChargeType()
      this.fetchList()
    },
    confirmExecCharge(fId) {
      const _this = this
      const data = { date: this.chargeDate, chargeList: this.list }
      confirmExecCharge(data).then(response => {
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
      this.list.splice(index, 1)
    }
  }
}
</script>

