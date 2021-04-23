<template>
  <div class="app-container">
    <role-form
      ref="form"
      :is-add="false"
    ></role-form>
    <el-header style="text-align: left;height:40px;margin:0px;padding:0px;">
      <el-input
        v-model="params.PatientName"
        size="small"
        placeholder="请输入姓名"
        style="width: 200px;"
        class="filter-item"
        clearable
      />
      <el-button
        size="small"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查询</el-button>
      <el-button
        size="small"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleCreate"
      >
        添加</el-button>
    </el-header>
    <div>
      <el-main style="margin:0px;padding:0px;">
        <el-table
          v-loading="listLoading"
          :data="this.rowsData"
          :header-cell-style="{background:'#eef1f6',color:'#606266'}"
          :cell-style="{padding:'3px 0'}"
          style="width: 100%;"
          size="small"
          border
        >
          <el-table-column
            prop="PatientName"
            label="一卡通编号"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="Gender"
            label="一卡通持有人"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="Birthday"
            label="刷卡类型"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="Telephone"
            label="操作时间"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="CardNO"
            width="150"
            label="操作机号"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="SecurityCardNo"
            label="备注"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="140"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="handleEdit(scope.row)"
              >编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :page-size="12"
          layout=" prev, pager, next,total"
          :total="tableData.records"
        ></el-pagination>
      </el-main>
    </div>
    <!--form-->
    <el-dialog
      title="编辑门禁信息"
      :visible.sync="dialogFormVisible"
      width="40%"
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        size="mini"
      >
        <el-form-item
          label="一卡通编号"
          :label-width="formLabelWidth"
          prop="PatientName"
        >
          <el-input
            v-model="form.PatientName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="一卡通持有人"
          :label-width="formLabelWidth"
          prop="Gender"
        >
          <el-input
            v-model="form.Gender"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="刷卡类型"
          :label-width="formLabelWidth"
          prop="Birthday"
        >
          <el-input
            v-model="form.Birthday"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="操作时间"
          :label-width="formLabelWidth"
          prop="Telephone"
        >
          <el-input
            v-model="form.Telephone"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="操作机号"
          :label-width="formLabelWidth"
          prop="CardNO"
        >
          <el-input
            v-model="form.CardNO"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="备注"
          :label-width="formLabelWidth"
          prop="SecurityCardNo"
        >
          <el-input
            v-model="form.SecurityCardNo"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="dialogFormVisible = false"
          size="small"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm('form')"
          size="small"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style>
.app-container button {
  padding: 8px 12px 8px 12px;
}
.el-header {
  line-height: 40px;
}
</style>
<script>
export default {
  components: {},
  data() {
    return {
      listLoading: false, //列表加载效果
      tableData: [], //列表数据
      dialogFormVisible: false, //控制form是否显示
      params: {
        rows: 10,
        page: 1,
        PatientName: "",
        HospitalId: "",
      },
      rowsData: [
        {
          PatientName: "10895001",
          Gender: "申桂玺",
          Birthday: "进",
          CardNO: "1001",
          HealthCardNo:
            "763D77FE2ACC8D93956A5039C97663B74C0715803B2E00E0ED88C0F069F715DB",
          SecurityCardNo: "1001",
          Telephone: "2020-12-12 09:40",
          IsDefault: 0,
          InHospitalNo: null,
        },
        {
          PatientName: "10895002",
          Gender: "彭建亭",
          Birthday: "进",
          CardNO: "1001",
          HealthCardNo:
            "763D77FE2ACC8D93956A5039C97663B74C0715803B2E00E0ED88C0F069F715DB",
          SecurityCardNo: "1001",
          Telephone: "2020-12-11 06:45",
          IsDefault: 0,
          InHospitalNo: null,
        },
        {
          PatientName: "10895007",
          Gender: "杜志新",
          Birthday: "进",
          CardNO: "1001",
          HealthCardNo:
            "763D77FE2ACC8D93956A5039C97663B74C0715803B2E00E0ED88C0F069F715DB",
          SecurityCardNo: "1001",
          Telephone: "2020-12-09 19:38",
          IsDefault: 0,
          InHospitalNo: null,
        },
        {
          PatientName: "10895008",
          Gender: "田桂启",
          Birthday: "进",
          CardNO: "1001",
          HealthCardNo:
            "763D77FE2ACC8D93956A5039C97663B74C0715803B2E00E0ED88C0F069F715DB",
          SecurityCardNo: "1001",
          Telephone: "2020-12-09 07:48",
          IsDefault: 0,
          InHospitalNo: null,
        },
        {
          PatientName: "10895003",
          Gender: "侯玉美",
          Birthday: "进",
          CardNO: "1001",
          HealthCardNo:
            "763D77FE2ACC8D93956A5039C97663B74C0715803B2E00E0ED88C0F069F715DB",
          SecurityCardNo: "1001",
          Telephone: "2020-12-09 12:25",
          IsDefault: 0,
          InHospitalNo: null,
        },
      ],
      //form表单数据
      form: {
        HospitalId: 0,
      },
      //表单验证规则
      rules: {
        PatientName: {
          required: true,
          message: "请输入患者姓名",
          trigger: "blur",
        },
        CardNO: { required: true, message: "请输入身份证号", trigger: "blur" },
        Telephone: {
          required: true,
          message: "请输入联系方式",
          trigger: "blur",
        },
      },
      formLabelWidth: "100px",
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.params.page = val;
    },
    handleFilter() {},
    handleCreate() {
      this.dialogFormVisible = true;
    },
    handleEdit(row) {
      this.form = JSON.parse(JSON.stringify(row));
      this.dialogFormVisible = true;
    },
    handleDelete(row) {
      this.$confirm("此操作将删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {})
        .catch((e) => {
          // this.$message({type: 'info',message: '已取消删除'});
        });
    },
    submitForm(formName) {
      this.dialogFormVisible = false;
    },
  },
  created() {},
};
</script>

