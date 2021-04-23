<template>
  <div class="app-container">
    <el-row>
      <el-col :span="18">
        <el-card class="box-card" shadow="never">
          <el-row style="margin-bottom: 10px;">
            <div class="el-input-group__prepend el-input-group-building">{{ buildingName }}</div>
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
          <el-table
            :data="bedList"
            border
            fit
            highlight-current-row
            style="width: 100%;"
            @row-click="bedClick"
          >
            <el-table-column label="床位" min-width="100px">
              <template slot-scope="scope">{{ scope.row.bedName }}</template>
            </el-table-column>
            <el-table-column label="入住号" min-width="100px">
              <template slot-scope="scope">{{ scope.row.checkinNo }}</template>
            </el-table-column>
            <el-table-column label="姓名" min-width="100px">
              <template slot-scope="scope">{{ scope.row.personName }}</template>
            </el-table-column>
            <el-table-column label="性别" min-width="100px">
              <template slot-scope="scope">{{ scope.row.gender | genderFilter }}</template>
            </el-table-column>
            <el-table-column label="年龄" min-width="100px">
              <template slot-scope="scope">{{ getAge(scope.row.birthday) + (scope.row.birthday?'岁':'') }}</template>
            </el-table-column>
            <el-table-column label="护理等级" min-width="100px">
              <template slot-scope="scope">{{ nursingLevelMap[scope.row.nursingLevelId] }}</template>
            </el-table-column>
            <el-table-column label="状态" width="110px" align="center">
              <template slot-scope="scope">{{ scope.row.status | checkinStatusFilter }}</template>
            </el-table-column>
          </el-table>
          <checkinCharge ref="formCheckinCharge" :org-id="orgId" :checkin-no="bedInfo.checkinNo" />
        </el-card>
      </el-col>
      <el-col :span="6" style="padding-right:10px;">
        <div class="bed-info">
          <div class="bed-info-title">床位信息</div>
          <div class="bed-info-content">
            <div class="input-wapper">
              <el-input v-model="bedInfo.bedName" :readonly="true">
                <template slot="prepend"><span class="input-label">床位</span></template>
              </el-input>
            </div>
            <div class="input-wapper">
              <el-input v-model="bedInfo.checkinNo" :readonly="true">
                <template slot="prepend"><span class="input-label">入住号</span></template>
              </el-input>
            </div>
            <div class="input-wapper">
              <el-input v-model="bedInfo.personName" :readonly="true">
                <template slot="prepend"><span class="input-label">姓名</span></template>
              </el-input>
            </div>
            <div class="input-wapper">
              <el-input v-model="bedInfo.gender" :readonly="true">
                <template slot="prepend"><span class="input-label">性别</span></template>
              </el-input>
            </div>
            <div class="input-wapper">
              <el-input v-model="bedInfo.nursingLevelName" :readonly="true">
                <template slot="prepend"><span class="input-label">护理等级</span></template>
              </el-input>
            </div>
            <el-row>
              <el-button v-for="item in dropdownBtn" :key="item.method" type="primary" size="mini" style="margin:5px" @click="dropdownClick(item)">
                {{ item.name }}
              </el-button>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { loginUserOrg } from '@/api/org'
import { getFloors } from '@/api/building'
import { findByOrg as findNursingLevel } from '@/api/nursinglevel'
import { getAge } from '@/utils'
import { findBedList } from '@/api/checkin'
import checkinCharge from '../bed-manager/checkin-charge/checkin-charge'
import waves from '@/directive/waves'

export default {
  name: 'BedList',
  components: { checkinCharge },
  directives: {
    waves
  },
  filters: {
    genderFilter(gender) {
      const genderMap = {
        1: '男',
        2: '女'
      }
      return genderMap[gender]
    },
    checkinStatusFilter(checkinStatus) {
      const checkinStatusMap = {
        checking_in: '正在办理入住',
        already_check_in: '在住',
        checkout_apply: '申请退住',
        unsettled_accounts: '退住未结算',
        already_check_out: '已退住'
      }
      return checkinStatusMap[checkinStatus]
    }
  },
  data() {
    return {
      contextMenuTarget: document.body,
      contextMenuVisible: false,
      orgId: '',
      bedList: [],
      buildingName: '正在加载',
      floors: [],
      floorId: '',
      bedInfo: {
        bedId: '',
        bedName: '',
        checkinId: '',
        checkinNo: '',
        personName: '',
        nursingLevelName: ''
      },
      nursingLevelList: [],
      nursingLevelMap: {},
      dropdownBtn: []
    }
  },
  watch: {
  },
  created() {
    this.loginUserOrg()
    this.findNursingLevel()
  },
  methods: {
    loginUserOrg() {
      loginUserOrg().then(response => {
        this.orgId = response.data.id
        this.getFloors()
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
    getFloors() {
      getFloors(this.orgId).then(response => {
        this.floors = response.data
        if (this.floors.length > 0 && this.floors[0].options.length > 0) {
          this.buildingName = this.floorId = this.floors[0].name
          this.floorId = this.floors[0].options[0].id
          this.findBedList()
        }
      })
    },
    findBedList() {
      findBedList(this.floorId).then(response => {
        this.bedList = response.data
        if (this.bedInfo.bedId) {
          for (let i = 0; i < this.bedList.length; i++) {
            if (this.bedInfo.bedId === this.bedList[i].bedId) {
              this.bedClick(this.bedList[i])
              break
            }
          }
        }
      })
    },
    getAge(birthday) {
      return getAge(birthday)
    },
    floorChange(val) {
      this.buildingName = this.$refs[val][0].$parent.label
      this.floorId = val
      this.findBedList()
    },
    bedClick(bed) {
      this.bedInfo = bed
      this.bedInfo.nursingLevelName = this.nursingLevelMap[this.bedInfo.nursingLevelId]
      this.dropdownBtn = [{
        method: 'checkin',
        name: '入住登记'
      }]
      if (this.bedInfo.status === 'checking_in') {
        this.dropdownBtn = []
      } else if (this.bedInfo.status === 'already_check_in' || this.bedInfo.status === 'checkout_apply') {
        this.dropdownBtn = [{
          method: 'checkinCharge',
          name: '费用设置'
        }]
      }
    },
    dropdownClick(btn) {
      if (btn.method === 'checkin') {
        this.checkin()
      } else if (btn.method === 'baseInfo') {
        this.baseInfo()
      } else if (btn.method === 'personRelation') {
        this.personRelation()
      } else if (btn.method === 'confirmCheckin') {
        this.confirmCheckin()
      } else if (btn.method === 'checkinCharge') {
        this.checkinCharge()
      } else if (btn.method === 'checkoutManager') {
        this.checkoutManager()
      } else if (btn.method === 'leaveManager') {
        this.leaveManager()
      } else if (btn.method === 'changeBed') {
        this.changeBed()
      } else if (btn.method === 'chargeQuery') {
        this.chargeQuery()
      }
    },
    execCharge() {
      this.$refs.formExecCharge.execCharge(this.floorId)
    },
    chargeStatistics() {
      this.$refs.formChargeStatistics.chargeStatistics(this.floorId)
    },
    checkin() {
      this.$refs.formCheckin.handleCreate()
    },
    baseInfo() {
      this.$refs.formCheckin.handleUpdate(this.bedInfo.checkinId)
    },
    personRelation() {
      this.$refs.formPersonRelation.personRelation()
    },
    confirmCheckin() {
      this.$refs.formConfirmCheckin.handleCreate()
    },
    checkinCharge() {
      this.$refs.formCheckinCharge.chargeSetting()
    },
    checkoutManager() {
      this.$refs.formCheckoutManager.checkoutManager()
    },
    leaveManager() {
      this.$refs.formLeaveRecord.leaveRecord()
    },
    changeBed() {
      this.$refs.formChangeBed.changeBed()
    },
    chargeQuery() {
      this.$refs.formChargeQuery.chargeQuery(this.bedInfo.checkinNo)
    },
    updateRow(temp) {
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
  .box-bed{
    width:140px;
    height:140px;
    font-size: 14px;
    line-height:25px;
    border-radius:4px;
    border:1px solid #DCDFE6;
    background-color: rgb(255, 255, 255);
    margin-right:2vh;
    margin-bottom:2vh;
    display:inline-block;
    padding:12px;
    cursor:pointer;
    position: relative;
  }
  .box-bed-selected{
    background-color: #D9ECFF;
  }
  .change-bed-space{
    width:100px;
    height:100px;
    background-color: rgb(255, 255, 255);
    display:inline-block;
    padding:12px;
    position: relative;
  }
  .change-bed-space span{
    display:block;
    top:38px;
    left:2px;
    width:80px;
    height:30px;
    border-radius: 2px;
    position:absolute;
    color:orange;
    font-weight: bold;
  }
  .box-bed-top{
    display:block;
    top:2px;
    left:2px;
    width:10px;
    height:10px;
    border-radius: 2px;
    position:absolute;
  }
  .box-female{
    color:orchid;
  }
  .box-male{
    color:royalblue;
  }
  .background-blue{
    background-color:#79BBFF;
  }
  .background-green{
    background-color:#67C23A;
  }
  .background-orange{
    background-color:#E6A23C;
  }
  .background-red{
    background-color:#F56C6C;
  }
  .background-gray{
    background-color:#909399;
  }
	.text-red{
		color: red;
		cursor: pointer;
	}
	.text-green{
		color: green;
		cursor: pointer;
	}
  .right-menu {
    font-size: 12px;
    padding-left:4px;
    position: fixed;
    background: #fff;
    border: solid 1px #909399;
    border-radius: 3px;
    z-index: 999;
    display: none;
  }
  .right-menu a {
    width: 100px;
    height: 28px;
    line-height: 28px;
    text-align: left;
    display: block;
    color: #1a1a1a;
  }
  .right-menu a:hover {
    background: #eee;
    color: #fff;
  }
  html,
  body {
      height: 100%;
  }
  .right-menu {
      border: 1px solid #eee;
      box-shadow: 0 0.5em 1em 0 rgba(0,0,0,.1);
      border-radius: 1px;
  }
  a {
      text-decoration: none;
  }
  .right-menu a {
      padding: 2px;
  }
  .right-menu a:hover {
      background: #42b983;
  }
  .el-select>.el-input{
    display: inline-block;
  }
  .el-input-group-building{
    min-width: 78px;
    padding:5px 20px;
    display: inline-block;
    margin-top: -1px;
    margin-right: -7px;
  }
  .input-wapper{
    width:100%;
    margin-bottom:10px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .input-label{
    display: block;
    text-align: right;
    width:40px;
    line-height:24px;
    font-size: 12px;
  }
  .bed-info{
    border-radius: 4px;
    margin:45px 0 0 15px;
    border:1px solid #dfe6ec;
  }
  .bed-info-title{
    font-size: 14px;
    color:#606266;
    line-height:43px;
    text-align:center;
    border-bottom:1px solid #dfe6ec;
  }
  .bed-info-content{
    padding:15px;
  }
</style>
