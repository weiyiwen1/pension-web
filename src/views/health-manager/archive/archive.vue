<template>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-tabs tab-position="left" @tab-click="handleTabClick">
      <el-tab-pane label="BMI指数">
        <bmi />
      </el-tab-pane>
      <el-tab-pane label="体温">
        <temperature />
      </el-tab-pane>
      <el-tab-pane label="血压">
        <bloodPressure />
      </el-tab-pane>
      <el-tab-pane label="血糖">
        <bloodSugar />
      </el-tab-pane>
      <el-tab-pane label="心电图">
        <ecg />
      </el-tab-pane>
      <el-tab-pane label="血氧">
        <bloodOxygen />
      </el-tab-pane>
      <el-tab-pane label="血脂">
        <bloodFat />
      </el-tab-pane>
      <el-tab-pane label="心率">
        <heartRate />
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="saveData()">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getInfo, save } from '@/api/person'
import bmi from './bmi'
import temperature from './temperature'
import bloodPressure from './blood-pressure'
import bloodSugar from './blood-sugar'
import bloodOxygen from './blood-oxygen'
import bloodFat from './blood-fat'
import heartRate from './heart-rate'
import ecg from './ecg'

export default {
  name: 'PersonForm',
  components: { bmi, temperature, bloodPressure, bloodSugar, bloodOxygen, bloodFat, heartRate, ecg },
  data() {
    return {
      btnLoading: false,
      ruleList: [],
      personId: '',
      temp: {
        id: '',
        name: '',
        idcard: '',
        gender: '1',
        mobile: '',
        address: '',
        enabled: 1
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      certificateType: [
        { value: '1', label: '身份证' },
        { value: '2', label: '军官证' },
        { value: '3', label: '士兵证' },
        { value: '4', label: '其他' }
      ],
      medicalMethod: {
        nrc_medical:	'新农村合作医疗',
        lx:	'离休医保',
        self_expense:	'自费',
        emp_medical: '职工医疗保险',
        ur_medical:	'城镇居民医疗保险',
        szyb:	'省职医保'
      },
      occupation: {
        doctor: '医生',
        teacher: '教师',
        soldier:	'军人',
        other:	'其他',
        institution_personnel:	'事业单位人员',
        enterprise_workers:	'企业职工',
        be_unemployed:	'无业',
        government_personnel:	'政府机关人员',
        liberal_professions:	'自由职业',
        self_employed:	'个体户'
      },
      consultRela: {
        father_son: '父子',
        oneself: '本人',
        mother_son: '母子',
        father_daughter: '父女',
        mother_daughter: '母女',
        brotherhood: '兄弟',
        brother_sister: '兄妹',
        sisterhood: '姐妹',
        sister_brother: '姐弟',
        marriage_bonds: '夫妻',
        other: '其他'
      },
      education: [
        { value: '1', label: '文盲及半文盲' },
        { value: '2', label: '小学' },
        { value: '3', label: '初中' },
        { value: '4', label: '高中/技校/中专' },
        { value: '5', label: '大学专科及以上' },
        { value: '6', label: '本科' },
        { value: '7', label: '不详' },
        { value: '8', label: '研究生' },
        { value: '9', label: '博士' },
        { value: '10', label: '教授' }
      ],
      politicalStatus: [
        { value: '1', label: '群众' },
        { value: '2', label: '无党派民主人士' },
        { value: '3', label: '中国中产党党员' },
        { value: '4', label: '中共预备党员' },
        { value: '5', label: '共青团员' },
        { value: '6', label: '民革党员' },
        { value: '7', label: '民盟盟员' },
        { value: '8', label: '民建会员' },
        { value: '9', label: '民进会员' },
        { value: '10', label: '农工党党员' },
        { value: '11', label: '致公党党员' },
        { value: '12', label: '九三学社社员' },
        { value: '13', label: '台盟盟员' }
      ],
      marriage: [
        { value: '1', label: '未婚' },
        { value: '2', label: '已婚' },
        { value: '3', label: '离婚' },
        { value: '4', label: '丧偶' },
        { value: '5', label: '不详' },
        { value: '6', label: '其他' }
      ],
      religion: [
        { value: '1', label: '佛教' },
        { value: '2', label: '道教' },
        { value: '3', label: '基督教' },
        { value: '4', label: '伊斯兰教' },
        { value: '5', label: '天主教' },
        { value: '6', label: '其他' }
      ],
      rules: {
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
        id: '',
        name: '',
        enabled: 1
      }
    },
    handleTabClick(tab, event) {
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.currentIndex = -1
    },
    handleUpdate(id) {
      this.personId = id
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      const _this = this
      getInfo(id).then(response => {
        if (response.code === 20000) {
          _this.temp.id = response.data.id
          _this.temp.name = response.data.name
          _this.temp.idcard = response.data.idcard
          _this.temp.gender = response.data.gender
          _this.temp.mobile = response.data.mobile
          _this.temp.address = response.data.address
          _this.temp.enabled = response.data.enabled
          _this.temp.certificateType = _this.certificateType[0].value
        }
      })
    },
    saveData() {
      this.btnLoading = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const _this = this
          const d = this.temp
          save(d).then(response => {
            if (response.code === 20000) {
              this.$emit('updateRow', response.data)
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
.el-dialog{width:70%}
</style>
