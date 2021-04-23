<template>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 100%; height: 50vh;overflow-y: scroll;">
      <el-form-item label="账号" prop="username">
        <el-input v-model="temp.username" clearable />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="temp.password" clearable />
      </el-form-item>
      <el-form-item label="部门">
        <treeselect v-model="temp.deptId" :multiple="false" :options="getDeptList" />
      </el-form-item>
      <el-form-item label="角色" prop="roles">
        <el-select v-model="temp.roles" multiple class="filter-item" placeholder="请选择">
          <el-option v-for="item in roles" :key="item.id" :label="item.title" :value="item.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <Upload v-model="temp.avatar" :config="config" />
      </el-form-item>
      <el-form-item label="姓名" prop="realName">
        <el-input v-model="temp.realName" clearable />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="temp.mobile" clearable />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="temp.email" clearable />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio v-model="temp.status" label="1">正常</el-radio>
        <el-radio v-model="temp.status" label="2">禁用</el-radio>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="saveData()">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Upload from '@/components/Upload/image'
import { findAll, findByUserId } from '@/api/role'
import { userInfo, save } from '@/api/user'
import { getNowTime } from '@/utils'
import { validPhone, validEmail } from '@/utils/validate'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import tree from '@/utils/tree'

export default {
  name: 'UserForm',
  components: { Upload, Treeselect },
  props: {
    orgId: {
      type: String,
      default: ''
    },
    deptList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    var checkPhone = (rule, value, callback) => {
      if (validPhone(value)) {
        callback()
      } else {
        return callback(new Error())
      }
    }
    var checkEmail = (rule, value, callback) => {
      if (validEmail(value)) {
        callback()
      } else {
        return callback(new Error())
      }
    }
    return {
      btnLoading: false,
      roles: {},
      temp: {
        id: '',
        roleIds: [],
        orgId: '',
        deptId: '',
        username: '',
        password: '',
        realName: '',
        status: '1',
        mobile: '',
        email: '',
        createTime: getNowTime(),
        avatar: []
      },
      config: {
        fileName: 'img',
        limit: 1,
        multiple: true,
        accept: 'image/*',
        action: '/system/upload?f=avatar'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      rules: {
        groupId: [{ required: true, message: '角色必选', trigger: 'change' }],
        username: [{ required: true, message: '账号必填', trigger: 'blur' }],
        mobile: [{ validator: checkPhone, message: '手机号格式错误', trigger: 'blur' }],
        email: [{ validator: checkEmail, message: '邮箱格式错误', trigger: 'blur' }]
      }

    }
  },
  computed: {
    getDeptList() {
      return tree.listToTreeSelect(this.deptList)
    }
  },
  watch: {
    dialogFormVisible: function() {
      this.resetTemp()
    },
    temp: {
      handler(newVal, oldVal) {},
      immediate: true,
      deep: true
    }
  },
  created() {
    this.getRoles()
  },
  destroyed() {

  },
  methods: {
    getRoles() {
      findAll().then(response => {
        this.roles = response.data
      })
    },
    getUserRole() {
      findByUserId(this.temp.id).then(response => {
        this.temp.roles = response.data
      })
    },
    resetTemp() {
      this.temp = {
        id: '',
        roleIds: [],
        username: '',
        password: '',
        realName: '',
        status: '1',
        mobile: '',
        email: '',
        createTime: getNowTime(),
        avatar: []
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
      userInfo(id).then(response => {
        if (response.code === 20000) {
          _this.temp.id = response.data.id
          _this.temp.roleIds = response.data.roleIds
          _this.temp.orgId = response.data.orgId
          _this.temp.deptId = response.data.deptId
          _this.temp.username = response.data.username
          _this.temp.realName = response.data.realName
          _this.temp.status = response.data.status
          _this.temp.mobile = response.data.mobile
          _this.temp.email = response.data.email
          _this.temp.password = ''
          _this.temp.avatar = response.data.avatar
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
          const d = this.temp
          if (typeof (d.avatar) === 'object') {
            d.avatar = d.avatar.join(',')
          }
          save(d).then(response => {
            if (response.code === 20000) {
              if (!d.id) {
                d.id = response.data.id
              }
              // todo
              this.$emit('updateRow', d)
              _this.dialogFormVisible = false
              _this.$message.success(response.msg)
            } else {
              _this.$message.error(response.msg)
            }
            _this.btnLoading = false
          }).catch((error) => {
            if (error) {
              this.btnLoading = false
            }
          })
        } else {
          this.btnLoading = false
        }
      })
    }
  }
}
</script>
