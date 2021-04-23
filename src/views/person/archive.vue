<template>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-tabs tab-position="left" @tab-click="handleTabClick">
      <el-tab-pane label="基本信息">
        <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="90px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名">
                <el-input v-model="temp.name" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性别">
                <el-radio-group v-model="temp.gender">
                  <el-radio label="1">男</el-radio>
                  <el-radio label="2">女</el-radio>
                  <el-radio label="9">未知</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="证件类型">
                <el-select v-model="temp.certificateType" placeholder="请选择">
                  <el-option v-for="item in certificateType" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="证件号">
                <el-input v-model="temp.idcard" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="出生日期">
                <el-date-picker v-model="temp.birthday" type="date" placeholder="选择日期" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="文化程度">
                <el-select v-model="temp.education" placeholder="请选择">
                  <el-option v-for="item in education" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="政治面貌">
                <el-select v-model="temp.political" placeholder="请选择">
                  <el-option v-for="item in politicalStatus" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="婚姻状况">
                <el-select v-model="temp.marriage" placeholder="请选择">
                  <el-option v-for="item in marriage" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="宗教">
                <el-select v-model="temp.religion" placeholder="请选择">
                  <el-option v-for="item in religion" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="民族">
                <el-input v-model="temp.nation" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="身高">
                <el-input v-model="temp.height" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="体重">
                <el-input v-model="temp.weight" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="国籍">
                <el-input v-model="temp.nationality" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="籍贯">
                <el-input v-model="temp.nativePlace" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="户籍地址">
                <el-input v-model="temp.householdAddress" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="现居住地址">
                <el-input v-model="temp.liveAddredd" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
       <el-tab-pane name="personRela" label="家属信息">
        <personRela ref="personRela" :person-id="personId" />
       </el-tab-pane>
       <el-tab-pane label="现病史">
        <illness />
       </el-tab-pane>
       <el-tab-pane label="用药史">
        <medicine />
       </el-tab-pane>
       <el-tab-pane label="既往史">
        <illness />
       </el-tab-pane>
       <el-tab-pane label="家族史">
        <familialDisease />
       </el-tab-pane>
       <el-tab-pane label="营养膳食">
        <dining />
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
import personRela from './person-relation/person-relation'
import illness from './illness'
import medicine from './medicine'
import familialDisease from './familial-disease'
import dining from './dining'

export default {
  name: 'PersonForm',
  components: { personRela, illness, medicine, familialDisease, dining },
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
      if (tab.name === 'personRela') {
        this.$refs.personRela.personRelation()
      }
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.currentIndex = -1
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
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
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
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
