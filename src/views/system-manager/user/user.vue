<template>
  <div class="app-container">
    <el-row>
      <el-col :span="4">
        <el-tree :data="getDeptList" :default-expand-all="true" @node-click="handleTreeNodeClick" />
      </el-col>
      <el-col :span="20">
        <!-- 搜索 -->
        <div v-if="showSearch" class="filter-container">
          <el-form :inline="true" :model="listQuery" class="form-inline">
            <el-form-item label="">
              <el-input v-model="listQuery.userName" placeholder="用户名" clearable size="small" />
            </el-form-item>
            <el-form-item label="">
              <el-input v-model="listQuery.phone" placeholder="手机号" clearable size="small" />
            </el-form-item>
            <el-form-item label="">
              <el-input v-model="listQuery.realName" placeholder="姓名" clearable size="small" />
            </el-form-item>
            <el-form-item label="">
              <el-select v-model="listQuery.isEnabled" placeholder="状态" clearable size="small">
                <el-option label="全部" value="-1" />
                <el-option label="正常" value="1" />
                <el-option label="禁用" value="0" />
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-date-picker v-model="dateTime" :picker-options="pickerOptions" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" align="right" clearable size="small" />
            </el-form-item>
            <el-form-item>
              <el-button v-waves type="primary" icon="el-icon-search" size="small" @click="handleFilter">搜索</el-button>
            </el-form-item>
            <el-form-item>
              <el-button v-waves type="warning" icon="el-icon-refresh" size="small" @click="handleFilterClear">重置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <el-row style="margin-bottom: 10px;">
          <el-col :xs="24" :sm="24" :lg="24">
            <el-button-group>
              <el-button type="primary" icon="el-icon-refresh" @click="handleFilterClear" />
              <el-button type="primary" icon="el-icon-plus" @click="handleCreate" />
              <el-button type="primary" icon="el-icon-search" @click="showSearch = !showSearch" />
              <el-button v-waves :loading="deleting" :disabled="buttonDisabled" type="primary" icon="el-icon-delete" @click="handleDeleteAll()" />
            </el-button-group>
          </el-col>
        </el-row>

        <!-- 表格 -->
        <el-table
          :key="tableKey"
          v-loading="listLoading"
          :data="list"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="头像" width="60px" fixed>
            <template slot-scope="scope">
              <span class="link-type" @click="handleImg(scope.row.avatar)"><img :src="scope.row.img" width="40" height="40"></span>
            </template>
          </el-table-column>
          <el-table-column label="用户名" min-width="80px" fixed>
            <template slot-scope="scope">
              <span class="link-type" @click="handleUpdate(scope.$index,scope.row.id)">{{ scope.row.username }}</span>
            </template>
          </el-table-column>
          <el-table-column label="手机" width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.mobile }}</span>
            </template>
          </el-table-column>
          <el-table-column label="邮箱" width="150px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.email }}</span>
            </template>
          </el-table-column>
          <el-table-column label="姓名" width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.realName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="110px" align="center">
            <template slot-scope="scope">
              <span :class="{'el-icon-success text-green':scope.row.status == 1,'el-icon-error text-red':scope.row.status == 2}" @click="handleModifyStatus(scope.$index,scope.row.id,scope.row.status)">{{ scope.row.status | statusFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="160px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime|parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="120px" class-name="small-padding fixed-width" fixed="right">
            <template slot-scope="scope">
              <el-tooltip content="编辑" placement="top">
                <el-button v-waves type="primary" icon="el-icon-edit-outline" circle @click="handleUpdate(scope.$index,scope.row.id)" />
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button v-waves :loading="scope.row.delete" type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.$index,scope.row.id)" />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination v-show="total>0" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.psize" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </el-col>
    </el-row>

    <!-- 表单 -->
    <userForm ref="fromAdmin" :dept-list="deptList" :org-id="listQuery.orgId" @updateRow="updateRow" />

  </div>
</template>

<script>
import { fetchList, del, change, delAll, changeAll } from '@/api/user'
import { loginUserOrg } from '@/api/org'
import { findByOrg } from '@/api/dept'
import tree from '@/utils/tree'
import waves from '@/directive/waves'
// eslint-disable-next-line no-unused-vars
import { parseTime, pickerOptions, getArrByKey } from '@/utils'
import userForm from './form'
import openWindow from '@/utils/open-window'

export default {
  name: 'User',
  components: { userForm },
  directives: {
    waves
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '1': '正常',
        '2': '禁用'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      selectedRows: null,
      listLoading: true,
      showSearch: false,
      deptList: [],
      listQuery: {
        page: 1,
        psize: 10,
        orgId: '',
        deptId: '',
        status: '1',
        username: '',
        mobile: '',
        realName: '',
        startTime: '',
        endTime: ''
      },
      buttonDisabled: true,
      deleting: false,
      dateTime: '',
      pickerOptions: pickerOptions,
      currentIndex: -1
    }
  },
  computed: {
    getDeptList() {
      return tree.listToTreeSelect(this.deptList)
    }
  },
  watch: {
    dateTime: function(val) {
      this.listQuery.startTime = val[0]
      this.listQuery.endTime = val[1]
    }
  },
  created() {
    this.getOrg()
  },
  methods: {
    getOrg() {
      loginUserOrg().then(response => {
        this.listQuery.orgId = response.data.id
        this.getDepts()
        this.fetchList()
      })
    },
    orgChange(val) {
      this.listQuery.orgId = val
      this.getDepts()
    },
    getDepts() {
      findByOrg(this.listQuery.orgId).then(response => {
        this.deptList = response.data
        this.fetchList()
      })
    },
    handleTreeNodeClick(node) {
      this.listQuery.deptId = node.id
      this.fetchList()
    },
    fetchList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchList()
    },
    handleFilterClear() {
      this.listQuery = {
        page: 1,
        psize: 10,
        status: '1',
        username: '',
        mobile: '',
        realName: '',
        startTime: '',
        endTime: ''
      }
      this.dateTime = ''
      this.fetchList()
    },
    handleSizeChange(val) {
      this.listQuery.psize = val
      this.fetchList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.fetchList()
    },
    handleModifyStatus(index, id, status) {
      if (status === '1') {
        status = '2'
      } else {
        status = '1'
      }
      this.list[index]['status'] = status
      change(id, 'status', status).then(response => {})
    },
    handleSelectionChange(val) {
      if (val.length > 0) {
        this.buttonDisabled = false
      } else {
        this.buttonDisabled = true
      }
      this.selectedRows = val
    },
    handleImg(img) {
      openWindow(img, '图片预览', '500', '400')
    },
    handleCreate() {
      this.$refs.fromAdmin.handleCreate()
    },
    handleUpdate(index, id) {
      this.currentIndex = index
      this.$refs.fromAdmin.handleUpdate(id)
    },
    updateRow(temp) {
      if (this.currentIndex >= 0 && temp.id) {
        this.list.splice(this.currentIndex, 1, temp)
      } else {
        if (this.list.length >= 10) {
          this.list.pop()
        }
        this.list.unshift(temp)
        this.total = this.total + 1
      }
      this.currentIndex = -1
    },
    handleDelete(index, id) {
      const _this = this
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.$set(_this.list[index], 'delete', true)
        del(id).then(response => {
          if (response.status === 1) {
            _this.list.splice(index, 1)
            _this.total = _this.total - 1
            _this.$notify.success(response.msg)
          } else {
            _this.$notify.error(response.msg)
          }
          _this.$set(_this.list[index], 'delete', false)
        }).catch((error) => {
          if (error) {
            _this.$set(_this.list[index], 'delete', false)
          }
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
          delAll({ ids: idstr }).then(response => {
            if (response.status === 1) {
              const delindex = []
              _this.list.forEach(function(item, index, input) {
                if (ids.indexOf(item.id) > -1) {
                  delindex.push(index)
                }
              })
              for (let i = delindex.length - 1; i >= 0; i--) {
                _this.list.splice(delindex[i], 1)
              }
              _this.total = _this.total - delindex.length
              _this.$message.success(response.msg)
            } else {
              _this.$message.error(response.msg)
            }
            _this.deleting = false
          }).catch((error) => {
            if (error) {
              _this.deleting = false
            }
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
        changeAll({ val: idstr, field: 'isEnabled', value: command }).then(response => {
          if (response.status === 1) {
            _this.list.forEach(function(item, index, input) {
              if (ids.indexOf(item.id) > -1) {
                _this.list[index]['isEnabled'] = command
              }
            })
            _this.$message.success(response.msg)
          } else {
            _this.$message.error(response.msg)
          }
        }).catch((error) => {
          if (error) {
            console.log()
          }
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
