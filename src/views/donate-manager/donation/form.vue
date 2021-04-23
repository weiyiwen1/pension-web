<template>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 100%; height: 300px;">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="捐赠人或单位" prop="donationPeopleUnit">
            <el-input v-model="temp.donationPeopleUnit" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="捐赠时间" prop="donationTime">
            <el-date-picker v-model="temp.donationTime" type="datetime" placeholder="选择日期时间" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="联系电话" prop="linkPhone">
            <el-input v-model="temp.linkPhone" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="捐赠地点" prop="donationPlace">
            <el-input v-model="temp.donationPlace" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="捐赠物品" prop="donationGoods">
            <el-input v-model="temp.donationGoods" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="捐赠数量" prop="donationQuantity">
            <el-input v-model="temp.donationQuantity" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="捐赠负责人" prop="donationHead">
            <el-input v-model="temp.donationHead" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分发方式" prop="distributeWay">
            <el-input v-model="temp.distributeWay" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="分发人" prop="serviceContent">
            <el-input v-model="temp.distributePeople" clearable />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="saveData()">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getInfo, save } from '@/api/donation'

export default {
  name: 'DonationForm',
  data() {
    return {
      btnLoading: false,
      ruleList: [],
      temp: {
        id: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
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
        id: ''
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
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      const _this = this
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
