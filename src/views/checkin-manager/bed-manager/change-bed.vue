<template>
  <el-dialog title="更换床位" :visible.sync="dialogFormVisible" width="50%">
    <el-card class="box-card" shadow="never" style="padding:5px">
      <div class="box-bed">
        <span :class="{ 'box-bed-top background-blue': originalBedInfo.status == 'checking_in', 'box-bed-top background-green': originalBedInfo.status == 'already_check_in', 'box-bed-top background-orange': originalBedInfo.status == 'checkout_apply' }" />
        {{ originalBedInfo.bedName }}<br>
        {{ originalBedInfo.checkinNo }}<br>
        {{ originalBedInfo.personName }}<br>
      </div>
      <div class="change-bed-space"><span>{{ textMap[changeName] }} <i class="el-icon-d-arrow-right" /></span><br><br><br></div>
      <div class="box-bed">
        <span :class="{ 'box-bed-top background-blue': newBedInfo.status == 'checking_in', 'box-bed-top background-green': newBedInfo.status == 'already_check_in', 'box-bed-top background-orange': newBedInfo.status == 'checkout_apply' }" />
        {{ newBedInfo.bedName }}<br>
        {{ newBedInfo.checkinNo }}<br>
        {{ newBedInfo.personName }}<br>
      </div>
    </el-card>
    <el-card class="box-card" shadow="never" style="padding:5px">
      <div slot="header" class="clearfix" style="padding:5px">
        <span>请选择变更床位</span>
      </div>
      <el-row style="margin-bottom: 10px;">
        <div class="el-input-group__prepend el-input-group-building" style="margin-top:-3px;line-height:22px">{{ buildingName }}</div>
        <el-select v-model="floorId" placeholder="请选择" @change="floorChange">
          <el-option-group
            v-for="group in floors"
            :key="group.id"
            :label="group.name"
          >
            <el-option
              v-for="item in group.options"
              :ref="item.id"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-option-group>
        </el-select>
      </el-row>
      <div v-for="o in bedList" :key="o.bedId" :ref="o.bedId" class="box-bed" :class="{'box-bed box-bed-selected':newBedInfo.bedId==o.bedId}" @click="bedClick(o)">
        <span :class="{ 'box-bed-top background-blue': o.status == 'checking_in', 'box-bed-top background-green': o.status == 'already_check_in', 'box-bed-top background-orange': o.status == 'checkout_apply' }" />
        {{ o.bedName }}<br>
        {{ o.checkinNo }}<br>
        {{ o.personName }}<br>
      </div>
    </el-card>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="confirmChangeBed()">确认变更</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { findBedList, confirmChangeBed } from '@/api/checkin'

export default {
  name: 'ChangeBedForm',
  props: {
    floors: {
      type: Array,
      default: () => []
    },
    originalBedInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      btnLoading: false,
      building: {},
      changeName: '',
      bedList: [],
      buildingName: '正在加载',
      floorId: '',
      newBedInfo: {
        bedId: '',
        bedName: '',
        checkinId: '',
        checkinNo: '',
        personName: '',
        nursingLevelName: ''
      },
      textMap: {
        change: '床位变更',
        exchange: '床位互换'
      },
      nursingLevelList: [],
      nursingLevelMap: {}
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
      this.newBedInfo = {
        bedId: '',
        bedName: '',
        checkinId: '',
        checkinNo: '',
        personName: '',
        nursingLevelName: ''
      }
    },
    initFloorId() {
      if (this.floors.length > 0 && this.floors[0].options.length > 0) {
        this.buildingName = this.floorId = this.floors[0].name
        this.floorId = this.floors[0].options[0].id
        this.findBedList()
      }
    },
    floorChange(val) {
      this.buildingName = this.$refs[val][0].$parent.label
      this.floorId = val
      this.findBedList()
    },
    findBedList() {
      findBedList(this.floorId).then(response => {
        this.bedList = response.data
      })
    },
    bedClick(bed) {
      this.newBedInfo = bed
      if (this.newBedInfo.checkinId) {
        this.changeName = 'exchange'
      } else {
        this.changeName = 'change'
      }
    },
    changeBed() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.initFloorId()
    },
    confirmChangeBed() {
      this.btnLoading = true
      const _this = this
      const d = { originalCheckinId: this.originalBedInfo.checkinId, originalBedId: this.originalBedInfo.bedId, newCheckinId: this.newBedInfo.checkinId, newBedId: this.newBedInfo.bedId }
      confirmChangeBed(d).then(response => {
        if (response.code === 20000) {
          this.$emit('findBedList')
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

<style>
.el-alert__description{
  color: #606266;
}
.el-card__header{
  padding:5px;
}
.el-card__body{
  padding:0;
}
</style>
