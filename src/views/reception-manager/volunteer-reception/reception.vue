<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="form-inline">
        <el-form-item label="">
          <el-input v-model="listQuery.unit" placeholder="单位名称" clearable size="small" />
        </el-form-item>
        <el-form-item>
          <el-button v-waves type="primary" icon="el-icon-search" size="small" @click="handleFilter">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

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
      <el-table-column label="来访单位" min-width="100px">
        <template slot-scope="scope">
          {{ scope.row.unit }}
        </template>
      </el-table-column>
      <el-table-column label="来访目的" min-width="100px">
        <template slot-scope="scope">
          {{ scope.row.purp }}
        </template>
      </el-table-column>
      <el-table-column label="来访时间" min-width="100px">
        <template slot-scope="scope">
          {{ scope.row.receptionDate | parseTime('{y}-{m}-{d}') }}
        </template>
      </el-table-column>
      <el-table-column label="来访人员" min-width="100px">
        <template slot-scope="scope">
          {{ scope.row.personnel }}
        </template>
      </el-table-column>
      <el-table-column label="来访人数" min-width="100px">
        <template slot-scope="scope">
          {{ scope.row.people }}
        </template>
      </el-table-column>
      <el-table-column label="事项" min-width="100px">
        <template slot-scope="scope">
          {{ scope.row.prepWork }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120px" class-name="small-padding">
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

    <!-- 表单 -->
    <receptionForm ref="formReception" @updateRow="updateRow" />

  </div>
</template>

<script>
import { findPage, del, delAll } from '@/api/reception'
import waves from '@/directive/waves'
import { pickerOptions, getArrByKey } from '@/utils'
import receptionForm from './form'

export default {
  name: 'Consultation',
  components: { receptionForm },
  directives: {
    waves
  },
  filters: {
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      selectedRows: null,
      listLoading: true,
      showSearch: false,
      listQuery: {
        page: 1,
        psize: 10,
        type: '2',
        unit: ''
      },
      buttonDisabled: true,
      deleting: false,
      pickerOptions: pickerOptions,
      currentIndex: -1
    }
  },
  watch: {
  },
  created() {
    this.fetchList()
  },
  methods: {
    fetchList() {
      this.listLoading = true
      findPage(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.totalRow
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
        type: '2',
        unit: ''
      }
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
    handleSelectionChange(val) {
      if (val.length > 0) {
        this.buttonDisabled = false
      } else {
        this.buttonDisabled = true
      }
      this.selectedRows = val
    },
    handleCreate() {
      this.$refs.formReception.handleCreate()
    },
    handleUpdate(index, id) {
      this.currentIndex = index
      this.$refs.formReception.handleUpdate(id)
    },
    updateRow(temp) {
      if (this.currentIndex >= 0 && temp.id) {
        this.list.splice(this.currentIndex, 1, temp)
      } else {
        if (this.list.length >= 10) {
          this.list.pop()
        }
        this.list.push(temp)
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
          if (response.code === 20000) {
            _this.list.splice(index, 1)
            _this.total = _this.total - 1
            _this.$notify.success(response.message)
          } else {
            _this.$notify.error(response.message)
          }
          _this.$set(_this.list[index], 'delete', false)
        }).catch(() => {
          _this.$set(_this.list[index], 'delete', false)
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
            if (response.code === 20000) {
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
              _this.$message.success(response.message)
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
