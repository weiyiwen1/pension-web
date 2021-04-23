<template>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form ref="dataForm" :roles="roles" :model="temp" label-position="left" label-width="70px" style="width: 100%; height: 50vh;overflow-y: scroll;">
      <el-form-item label="上级">
        <treeselect v-model="temp.parentId" :multiple="false" :options="getDeptList" />
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="temp.name" clearable />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="saveData()">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getinfo, save } from '@/api/dept'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import tree from '@/utils/tree'
export default {
  name: 'DeptForm',
  components: { Treeselect },
  props: {
    deptList: {
      type: Array,
      default: () => []
    },
    orgId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      btnLoading: false,
      menuTop: [{ 'id': '0', 'label': '顶级' }],
      pid: [],
      temp: {
        id: '',
        parentId: '0',
        name: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      roles: {
        name: [{ required: true, message: '名称必填', trigger: 'blur' }],
        permission: [{ required: true, message: '标识必填', trigger: 'blur' }],
        url: [{ required: true, message: '路径必填', trigger: 'blur' }],
        type: [{ required: true, message: '类型必填', trigger: 'blur' }]
      }
    }
  },
  computed: {
    getDeptList() {
      return this.menuTop.concat(tree.listToTreeSelect(this.deptList))
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
  },
  destroyed() {

  },
  methods: {
    resetTemp() {
      this.temp = {
        id: '',
        parentId: '0',
        name: ''
      }
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.currentIndex = -1
      this.pid = []
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(id) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      const _this = this
      getinfo(id).then(response => {
        if (response.code === 20000) {
          _this.temp.id = response.data.id
          _this.temp.parentId = response.data.parentId
          _this.temp.name = response.data.name
          _this.pid = tree.getParentsId(this.deptList, id)
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
          save(d).then(response => {
            if (response.code === 20000) {
              if (!d.id) {
                d.id2 = response.data.id
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
    },
    handleChange(value) {
      if (value.length) {
        this.temp.parentId = value[value.length - 1]
      }
    }
  }
}
</script>
