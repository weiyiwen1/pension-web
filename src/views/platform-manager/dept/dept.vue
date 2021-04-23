<template>
  <div class="app-container">
    <!-- tab -->
    <el-row style="margin-bottom: 10px;">
      <el-select v-model="orgId" placeholder="请选择" @change="orgChange">
        <el-option v-for="item in orgs" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </el-row>
    <!-- 操作 -->
    <el-row style="margin-bottom: 10px;">
      <el-col :xs="24" :sm="24" :lg="24">
        <el-button-group>
          <el-button type="primary" icon="el-icon-refresh" @click="handleFilterClear" />
          <el-button type="primary" icon="el-icon-plus" @click="handleCreate" />
          <el-button v-waves :loading="deleting" :disabled="buttonDisabled" type="primary" icon="el-icon-delete" @click="handleDeleteAll()" />
        </el-button-group>
      </el-col>
    </el-row>
    <!-- 表格 -->

    <vxe-table
      :data="getDeptList"
      :tree-config="{children: 'children', expandAll: true}"
      :checkbox-config="{labelField: 'name'}"
      @checkbox-change="handleSelectionChange"
    >
      <vxe-table-column type="checkbox" title="名称" tree-node />
      <vxe-table-column title="操作" width="100" show-overflow>
        <template v-slot="{ row }">
          <vxe-button type="text" icon="el-icon-edit-outline" value="编辑" @click="handleUpdate(row.id)" />
          <vxe-button type="text" icon="el-icon-delete" value="编辑" @click="handleDelete(row.id)" />
        </template>
      </vxe-table-column>
    </vxe-table>
    <!-- 表单 -->
    <deptForm ref="formDept" :dept-list="list" :org-id="orgId" @updateRow="updateRow" />
  </div>
</template>

<script>
import { findByOrg, del, change, delBatch, changeAll } from '@/api/dept'
import { findAll } from '@/api/org'
import waves from '@/directive/waves' // 水波纹指令
import { getArrByKey } from '@/utils'
import tree from '@/utils/tree'
import deptForm from './form'

export default {
  name: 'Dept',
  components: { deptForm },
  directives: {
    waves
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: '禁用',
        1: '正常'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      selectedRows: null,
      listLoading: true,
      expandAll: true,
      orgId: '',
      orgs: [],
      tabActive: '',
      buttonDisabled: true,
      deleting: false,
      typeList: [{
        label: '菜单',
        value: '1'
      }, {
        label: '按钮',
        value: '2'
      }]
    }
  },
  computed: {
    getDeptList() {
      return tree.listToTreeMulti(this.list, '0', 'id', 'parentId', 'children', { 'delete': false })
    }
  },
  watch: {
  },
  created() {
    this.getOrgs()
  },
  methods: {
    orgChange(val) {
      console.log(val)
      this.fetchList()
    },
    formatType({ cellValue }) {
      const item = this.typeList.find(item => item.value === cellValue)
      return item ? item.label : ''
    },
    getOrgs() {
      findAll().then(response => {
        this.orgs = response.data
        if (this.orgs.length > 0) {
          this.orgId = this.orgs[0].id
        }
        this.fetchList()
      })
    },
    fetchList() {
      this.listLoading = true
      findByOrg(this.orgId).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    handleFilterClear() {
      this.listQuery = {
        name: ''
      }
      this.fetchList()
    },
    handleSelectionChange(val) {
      if (val.records.length > 0) {
        this.buttonDisabled = false
      } else {
        this.buttonDisabled = true
      }
      this.selectedRows = val.records
    },
    handleCreate() {
      this.$refs.formDept.handleCreate()
    },
    handleUpdate(id) {
      this.$refs.formDept.handleUpdate(id)
    },
    handleModifyStatus(id, enable) {
      const enableObj = { 'enable': 1 - enable }
      this.list = tree.upadteArr(this.list, 'id', id, enableObj)
      change(id, 'enable', 1 - enable).then(response => {})
    },
    updateRow(temp) {
      this.fetchList()
    },
    handleDelete(id) {
      const _this = this
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const delObj = { 'delete': true }
        _this.list = tree.upadteArr(_this.list, 'id', id, delObj)
        del(id).then(response => {
          if (response.code === 20000) {
            _this.$notify.success(response.message)
            _this.fetchList()
          } else {
            _this.$notify.error(response.message)
          }
          const delObj = { 'delete': false }
          _this.list = tree.upadteArr(_this.list, 'id', id, delObj)
        }).catch(() => {
          const delObj = { 'delete': false }
          _this.list = tree.upadteArr(_this.list, 'id', id, delObj)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleDeleteAll() {
      const _this = this
      if (this.selectedRows.length > 0) {
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.deleting = true
          const ids = getArrByKey(_this.selectedRows, 'id')
          const idstr = ids.join(',')
          delBatch({ ids: idstr }).then(response => {
            if (response.code === 20000) {
              _this.$message.success(response.message)
              _this.fetchList()
            } else {
              _this.$message.error(response.message)
            }
            _this.deleting = false
          }).catch(() => {
            _this.deleting = false
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        _this.$message.error('请选择要删除的数据')
      }
    },
    handleCommand(command) {
      const _this = this
      if (this.selectedRows.length > 0) {
        const ids = getArrByKey(this.selectedRows, 'id')
        const idstr = ids.join(',')
        changeAll({ val: idstr, field: 'status', value: command }).then(response => {
          if (response.status === 1) {
            _this.$message.success(response.msg)
            _this.fetchList()
          } else {
            _this.$message.error(response.msg)
          }
        }).catch(() => {
        })
      } else {
        _this.$message.error('请选择要操作的数据')
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
	.text-red{
		color: red;
		cursor: pointer;
	}
	.text-green{
		color: green;
		cursor: pointer;
	}
</style>
