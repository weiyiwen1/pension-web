<template>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="650px">

    <el-row>
      <el-alert title="当前床位" :description="building.name + '/' + floor.name + '/' + room.name + '/' + bed.name" type="success" :closable="false" style="color:#606266;margin-bottom:20px;" />
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="70px" style="width: 100%;">
        <el-row>
          <el-form-item label="身份证" prop="idcard">
            <el-input v-model="temp.idcard" clearable @change="idcardChange" />
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="temp.name" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="temp.gender">
                <el-radio label="1">男</el-radio>
                <el-radio label="2">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="入住号" prop="checkinNo">
              <el-input v-model="temp.checkinNo" :disabled="true" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入住时间" prop="expectDate">
              <el-date-picker
                v-model="temp.expectDate"
                type="date"
                :disabled="temp.id != null"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="出生日期" prop="birthday">
              <el-date-picker
                v-model="temp.birthday"
                type="date"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="政治面貌" prop="political">
              <el-select v-model="temp.political" placeholder="请选择">
                <el-option
                  v-for="(value, key) in political"
                  :key="key"
                  :label="value"
                  :value="key"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="护理等级" prop="nursingLevelId">
              <el-select v-model="temp.nursingLevelId" placeholder="请选择">
                <el-option
                  v-for="item in nursingLevelList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="temp.mobile" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="地址" prop="address">
            <el-input v-model="temp.address" clearable />
          </el-form-item>
        </el-row>
      </el-form>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="saveData()">{{ dialogStatus=='create'?'登记':'保存' }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getInfo, getPersonByIdcard, saveCheckin } from '@/api/checkin'
import { findByOrg as findNursingLevel } from '@/api/nursinglevel'
import { getBedGradation } from '@/api/bed'
import { formatDate } from '@/utils'

export default {
  name: 'CheckinForm',
  props: {
    orgId: {
      type: String,
      default: ''
    },
    bedId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      btnLoading: false,
      building: {},
      floor: {},
      room: {},
      bed: {},
      nursingLevelList: [],
      temp: {
        personId: '',
        checkinId: '',
        checkinNo: '保存自动生成',
        name: '',
        idcard: '',
        gender: '',
        orgId: '',
        mobile: '',
        buildingId: '',
        floorId: '',
        roomId: '',
        bedId: '',
        expectDate: '',
        nursingLevelId: '',
        address: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '基本信息',
        create: '入住登记'
      },
      political: {
        political_1: '中共党员',
        political_2: '中工预备党员',
        political_3: '共青团员',
        political_4: '民革党员',
        political_5: '民盟盟员',
        political_6: '民建会员',
        political_7: '民进会员',
        political_8: '农工党党员',
        political_9: '致公党党员',
        political_10: '九三学社社员',
        political_11: '台盟盟员',
        political_12: '无党派人士',
        political_13: '群众'
      },
      rules: {
        idcard: [{ required: true, message: '身份证必填', trigger: 'blur' }],
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
      this.temp = {
        personId: '',
        checkinId: '',
        checkinNo: '保存自动生成',
        name: '',
        idcard: '',
        gender: '',
        orgId: '',
        mobile: '',
        buildingId: '',
        floorId: '',
        roomId: '',
        bedId: '',
        expectDate: '',
        birthday: '',
        political: '',
        nursingLevelId: '',
        address: ''
      }
    },
    findNursingLevel() {
      findNursingLevel().then(response => {
        this.nursingLevelList = response.data
      })
    },
    getBedGradation() {
      getBedGradation(this.bedId).then(response => {
        this.building = response.data.building
        this.floor = response.data.floor
        this.room = response.data.room
        this.bed = response.data.bed
      })
    },
    idcardChange(val) {
      getPersonByIdcard(val).then(response => {
        if (response.data) {
          this.temp.personId = response.data.id
          this.temp.name = response.data.name
          this.temp.gender = response.data.gender
          this.temp.mobile = response.data.mobile
          this.temp.address = response.data.address
          this.temp.birthday = response.data.birthday
          this.temp.political = response.data.political
        }
      })
    },
    handleChangeModule(id) {
      this.listLoading = true
      this.moduleId = id
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.currentIndex = -1
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.getBedGradation()
      this.findNursingLevel()
    },
    handleUpdate(id) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      const _this = this
      this.getBedGradation()
      this.findNursingLevel()
      getInfo(id).then(response => {
        if (response.code === 20000) {
          _this.temp = response.data
        }
      })
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    saveData() {
      this.btnLoading = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const _this = this
          this.temp.orgId = this.orgId
          this.temp.buildingId = this.building.id
          this.temp.floorId = this.floor.id
          this.temp.roomId = this.room.id
          this.temp.bedId = this.bed.id
          this.temp.birthday = formatDate(this.temp.birthday, 'yyyy-MM-dd hh:mm:ss')
          const d = this.temp
          d.menuIds = this.menuChecked
          saveCheckin(d).then(response => {
            if (response.code === 20000) {
              if (!response.data.id) {
                d.id = response.data.id
              }
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
        } else {
          this.btnLoading = false
        }
      })
    }
  }
}
</script>

<style>
.el-alert__description{
  color: #606266;
}
</style>
