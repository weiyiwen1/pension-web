<template>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">

    <el-row>
      <el-col :span="16">
        <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 100%; height: 50vh;">
          <el-form-item label="名称" prop="name">
            <el-input v-model="temp.name" clearable />
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="temp.enabled">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card" style="margin-left:1vh">
          <el-select v-model="moduleId" placeholder="请选择" @change="handleChangeModule($event)">
            <el-option v-for="item in modules" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
          <el-tree
            :data="getMenuList"
            show-checkbox
            node-key="id"
            :default-checked-keys="menuChecked"
            :props="props"
            :default-expand-all="true"
            :check-strictly="true"
            @check-change="checkChange"
          />
        </el-card>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="saveData()">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getInfo, save } from '@/api/role'
import { findByOrg } from '@/api/module'
import { findByModules, findByRole } from '@/api/menu'
import tree from '@/utils/tree'

export default {
  name: 'RoleForm',
  props: {
    orgId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      btnLoading: false,
      ruleList: [],
      temp: {
        id: '',
        name: '',
        orgId: '',
        enabled: 1
      },
      props: [],
      dialogFormVisible: false,
      dialogStatus: '',
      moduleId: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      modules: [],
      menus: {},
      menuChecked: [],
      rules: {
        name: [{ required: true, message: '名称必填', trigger: 'blur' }]
      }
    }
  },
  computed: {
    getMenuList() {
      return tree.listToTreeSelect(this.menus[this.moduleId], '0', 'id', 'parentId', 'children', { 'delete': false })
    }
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
        orgId: '',
        enabled: 1
      }
    },
    getModules() {
      console.log(this.orgId)
      findByOrg(this.orgId).then(response => {
        this.modules = response.data
        if (this.modules.length > 0) {
          this.moduleId = this.modules[0].id
          var mIds = ''
          for (var i in this.modules) {
            if (mIds) {
              mIds += ',' + this.modules[i].id
            } else {
              mIds += this.modules[i].id
            }
          }
          findByModules(mIds).then(response => {
            this.menus = response.data
          })
        }
      })
    },
    handleChangeModule(id) {
      this.listLoading = true
      this.moduleId = id
    },
    getMenuChecked() {
      findByRole(this.temp.id).then(response => {
        this.menuChecked = response.data
      })
    },
    checkChange(val, isCheck, childCheck) {
      if (isCheck) {
        this.menuChecked.push(val.id)
      } else {
        var index = this.menuChecked.indexOf(val.id)
        if (index > -1) {
          this.menuChecked.splice(index, 1)
        }
      }
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.currentIndex = -1
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.getModules()
    },
    handleUpdate(id) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      const _this = this
      getInfo(id).then(response => {
        if (response.code === 20000) {
          _this.temp.id = response.data.id
          _this.temp.name = response.data.name
          _this.temp.orgId = response.data.orgId
          _this.temp.enabled = response.data.enabled
          this.getMenuChecked()
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
          d.menuIds = this.menuChecked
          save(d).then(response => {
            if (response.code === 20000) {
              if (!response.data.id) {
                d.id = response.data.id
              }
              this.$emit('updateRow', d)
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
