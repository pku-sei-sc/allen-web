<template>
  <div class="data">
    <el-button type="primary" icon="el-icon-plus" @click="showAddData = true">添加</el-button>
    <el-button type="primary" icon="el-icon-plus" @click="showAddData2 = true">从已有数据块添加</el-button>
    <el-dialog titie="导入数据" :visible.sync = "showAddData" width="80%">
      <el-form>
        <el-form-item label="数据块名字" :label-width="formLabelWidth" >
          <el-input v-model="dataChunkPacName" auto-complete="off" style="width: 40%"/>
        </el-form-item>
      </el-form>
      <el-container>
        <el-form :model="addFormDiagnose" ref="addFormDiagnose" width="45%" label="诊断数据" >
          <h1 >诊断数据</h1>
          <el-form-item label="数据来源" :label-width="formLabelWidth" prop="source" :rules="{required: true, message: '数据来源不能为空', trigger: 'blur'}">
            <el-select v-model="addFormDiagnose.source" placeholder="请选择" size="medium" style="width: 80%">
              <el-option
                v-for="dataSource in dataSources"
                :key="dataSource.id"
                :label="dataSource.id + ': ' + dataSource.url"
                :value="dataSource.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="SQL查询语句" :label-width="formLabelWidth" prop="sqls" :rules="{required: true, message: 'SQL查询语句不能为空', trigger: 'blur'}">
            <el-input type="textarea" v-model="addFormDiagnose.sqls" auto-complete="off" style="width: 80%"/>
          </el-form-item>
          <el-form-item label="处方编号" :label-width="formLabelWidth" prop="idName" :rules="{required: true, message: '实例id名称不能为空', trigger: 'blur'}">
            <el-input v-model="addFormDiagnose.idName" auto-complete="off" style="width: 80%"/>
          </el-form-item>
          <el-form-item label="变量名称" :label-width="formLabelWidth" prop="tokenName" :rules="{required: true, message: '词语名称不能为空', trigger: 'blur'}">
            <el-input v-model="addFormDiagnose.tokenName" auto-complete="off" style="width: 80%"/>
          </el-form-item>
          <el-form-item label="诊断数据描述" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="addFormDiagnose.descriptionDiagnose" auto-complete="off" style="width: 80%"/>
          </el-form-item>
        </el-form>
        <el-form :model="addFormMedicine" ref="addFormMedicine" width="45%" label="用药数据">
          <h1>用药数据</h1>
          <el-form-item label="数据来源" :label-width="formLabelWidth" prop="source" :rules="{required: true, message: '数据来源不能为空', trigger: 'blur'}">
            <el-select v-model="addFormMedicine.source" placeholder="请选择" size="medium" style="width: 80%">
              <el-option
                v-for="dataSource in dataSources"
                :key="dataSource.id"
                :label="dataSource.id + ': ' + dataSource.url"
                :value="dataSource.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="SQL查询语句" :label-width="formLabelWidth" prop="sqls" :rules="{required: true, message: 'SQL查询语句不能为空', trigger: 'blur'}">
            <el-input type="textarea" v-model="addFormMedicine.sqls" auto-complete="off" style="width: 80%"/>
          </el-form-item>
          <el-form-item label="处方编号" :label-width="formLabelWidth" prop="idName" :rules="{required: true, message: '实例id名称不能为空', trigger: 'blur'}">
            <el-input v-model="addFormMedicine.idName" auto-complete="off" style="width: 80%"/>
          </el-form-item>
          <el-form-item label="变量名称" :label-width="formLabelWidth" prop="tokenName" :rules="{required: true, message: '词语名称不能为空', trigger: 'blur'}">
            <el-input v-model="addFormMedicine.tokenName" auto-complete="off" style="width: 80%"/>
          </el-form-item>
          <el-form-item label="用药数据描述" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="addFormMedicine.descriptionMedicine" auto-complete="off" style="width: 80%"/>
          </el-form-item>
        </el-form>
      </el-container>
      <div slot="footer" class="dialog-footer" width="80%">
        <el-button @click="showAddData = false">取 消</el-button>
        <el-button type="primary" @click="sendAddDataPac()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="将已有数据合并成数据块" :visible.sync ="showAddData2" width="50%">
      <el-form>
        <el-form-item label="数据块名字" :label-width="formLabelWidth" >
          <el-input v-model="addFormDataChunk.name" auto-complete="off" style="width: 30%"/>
        </el-form-item>
      </el-form>
        <el-container>
          <el-form :model="addFormDataChunk" ref="addFormDataChunk" width="600px" label="诊断数据" >
            <el-form-item label="诊断数据块" :label-width="formLabelWidth"  :rules="{required: true, message: '诊断数据块不能为空', trigger: 'blur'}">
              <el-select v-model="addFormDataChunk.dataChunkDiagnose" placeholder="请选择" size="medium" style="width: 80%">
                <el-option
                  v-for="dataChunk in dataChunks"
                  :key="dataChunk.id"
                  :label="dataChunk.id + ': ' + dataChunk.tokenName"
                  :value="dataChunk.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用药数据块" :label-width="formLabelWidth" :rules="{required: true, message: '用药数据块不能为空', trigger: 'blur'}">
              <el-select v-model="addFormDataChunk.dataChunkMedicine" placeholder="请选择" size="medium" style="width: 80%">
                <el-option
                  v-for="dataChunk in dataChunks"
                  :key="dataChunk.id"
                  :label="dataChunk.id + ': ' + dataChunk.tokenName"
                  :value="dataChunk.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="诊断数据描述" :label-width="formLabelWidth">
              <el-input type="textarea" v-model="addFormDataChunk.descriptionDiagnose" auto-complete="off" style="width: 80%"/>
            </el-form-item>
            <el-form-item label="用药数据描述" :label-width="formLabelWidth">
              <el-input type="textarea" v-model="addFormDataChunk.descriptionMedicine" auto-complete="off" style="width: 80%"/>
            </el-form-item>
          </el-form>
        </el-container>
        <div slot="footer" class="dialog-footer" width="80%">
          <el-button @click="showAddData2 = false">取 消</el-button>
          <el-button type="primary" @click="sendAddDataPac2()">确 定</el-button>
        </div>
    </el-dialog>

    <el-button type="primary" icon="el-icon-plus" @click="showAddDataSource = true" style="float: right">添加数据源</el-button>
    <el-dialog title="添加数据源" :visible.sync="showAddDataSource" width="80%">
      <el-form :model="addSourceForm" ref="addSourceForm">
        <el-form-item label="数据库驱动类" :label-width="formLabelWidth" prop="driverClassName" :rules="{required: true, message: '数据库驱动类不能为空', trigger: 'blur'}">
          <el-input v-model="addSourceForm.driverClassName" auto-complete="off" style="width: 80%"/>
        </el-form-item>
        <el-form-item label="数据库地址" :label-width="formLabelWidth" prop="url" :rules="{required: true, message: '数据库地址不能为空', trigger: 'blur'}">
          <el-input v-model="addSourceForm.url" auto-complete="off" style="width: 80%"/>
        </el-form-item>
        <el-form-item label="数据库用户名" :label-width="formLabelWidth">
          <el-input v-model="addSourceForm.username" auto-complete="off" style="width: 80%"/>
        </el-form-item>
        <el-form-item label="数据库密码" :label-width="formLabelWidth">
          <el-input v-model="addSourceForm.password" auto-complete="off" style="width: 80%"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAddDataSource = false">取 消</el-button>
        <el-button type="primary" @click="sendAddSource()">确 定</el-button>
      </div>
    </el-dialog>

    <el-table :data="dataChunkPacs" style="width: 100%; padding: 5px 5px; margin-top: 15px">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="数据块名称: ">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="诊断数据块描述：">
              <span>{{ props.row.descriptionDiagnose }}</span>
            </el-form-item>
            <el-form-item label="用药数据块描述：">
              <span>{{ props.row.descriptionMedicine }}</span>
            </el-form-item>
            <el-form-item label="诊断数据块 ID: ">
              <span>{{ props.row.diagnoseId }}</span>
            </el-form-item>
            <el-form-item label="用药数据块 ID: ">
              <span>{{ props.row.medicineId }}</span>
            </el-form-item>
            <el-form-item label="数据导入状态: ">
              <span>{{ props.row.status }}</span>
            </el-form-item>
            <template v-if="props.row.status === 'Finished'">
              <p/>
              <el-form-item label="诊断实例数量: ">
                <span>{{ dataChunks[getIndex(props.row.diagnoseId)].totalInstances }}</span>
              </el-form-item>
              <el-form-item label="诊断词语种类: ">
                <span>{{ dataChunks[getIndex(props.row.diagnoseId)].totalTypes }}</span>
              </el-form-item>
              <el-form-item label="诊断词语种类: ">
                <span>{{ dataChunks[getIndex(props.row.diagnoseId)].totalTokens }}</span>
              </el-form-item>
              <el-form-item label="诊断目录id: ">
                <span>{{ dataChunks[getIndex(props.row.diagnoseId)].manifestId }}</span>
              </el-form-item>
              <p/>
              <el-form-item label="用药实例数量: ">
                <span>{{ dataChunks[getIndex(props.row.medicineId)].totalInstances }}</span>
              </el-form-item>
              <el-form-item label="用药词语种类: ">
                <span>{{ dataChunks[getIndex(props.row.medicineId)].totalTypes }}</span>
              </el-form-item>
              <el-form-item label="用药词语数量: ">
                <span>{{ dataChunks[getIndex(props.row.medicineId)].totalTokens }}</span>
              </el-form-item>
              <el-form-item label="用药目录id: ">
                <span>{{ dataChunks[getIndex(props.row.medicineId)].manifestId }}</span>
              </el-form-item>
            </template>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="数据块名称" style="width: 15%"/>
      <el-table-column prop="descriptionDiagnose" label="诊断数据块描述" style="width: 25%"/>
      <el-table-column prop="descriptionMedicine" label="用药数据块描述" style="width: 25%"/>
      <el-table-column prop="status" label="数据导入状态" style="width: 10%"/>
      <el-table-column label="操作" style="width: 25%">
        <template slot-scope="scope">
          <el-button size="mini" @click="deleteData(scope.row.id)"  type="danger">删除数据块</el-button>
          <el-button size="mini" v-if="scope.row.status === 'Stopped'" @click="startImportPac(scope.row.id, true)" type="success">开始导入</el-button>
          <el-button size="mini" v-if="scope.row.status !== 'Stopped'" @click="startImportPac(scope.row.id, true)" type="danger">重新导入</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--<el-card v-for="dataChunkPac in dataChunkPacs" :key="dataChunkPac.id" class="box-card">-->
    <!--<div slot="header" class="clearfix">-->
    <!--<span>数据块：{{dataChunkPac.id}}</span>-->
    <!--<el-button @click="deleteData(dataChunkPac)" style="float: right; padding: 5px 5px; " type="danger">删除数据块</el-button>-->
    <!--<el-button v-if="dataChunkPac.status === 'Stopped'" @click="startImportPac(dataChunkPac, true)" style="float: right; padding: 5px 5px; margin-right: 10px" type="success">开始导入</el-button>-->
    <!--<el-button v-if="dataChunkPac.status !== 'Stopped'" @click="startImportPac(dataChunkPac, true)" style="float: right; padding: 5px 5px; margin-right: 10px" type="danger">重新导入</el-button>-->
    <!--</div>-->
    <!--<div class="text item">诊断数据块Id：{{ dataChunkPac.diagnoseId}}</div>-->
    <!--<div class="text item">用药数据块Id：{{ dataChunkPac.medicineId }}</div>-->
    <!--<div class="text item">诊断数据块描述：{{ dataChunkPac.descriptionDiagnose }}</div>-->
    <!--<div class="text item">用药数据块描述：{{ dataChunkPac.descriptionMedicine}}</div>-->
    <!--<div class="text item">描述：{{ dataChunkPac.dataChunkPacName}}</div>-->
    <!--<div class="text item">数据导入状态：{{ dataChunkPac.status }}</div>-->
    <!--<template v-if="dataChunkPac.status === 'Finished'">-->
    <!--<div class="text item">实例数量：{{ dataChunks[dataChunkPac.diagnoseId - 1].totalInstances }}</div>-->
    <!--<div class="text item">词语种类：{{ dataChunks[dataChunkPac.diagnoseId - 1].totalTypes }}</div>-->
    <!--<div class="text item">词语数量：{{ dataChunks[dataChunkPac.diagnoseId - 1].totalTokens }}</div>-->
    <!--<div class="text item">目录id：{{ dataChunks[dataChunkPac.diagnoseId - 1].manifestId }}</div>-->
    <!--<div class="text item">实例数量：{{ dataChunks[dataChunkPac.medicineId - 1].totalInstances }}</div>-->
    <!--<div class="text item">词语种类：{{ dataChunks[dataChunkPac.medicineId - 1].totalTypes }}</div>-->
    <!--<div class="text item">词语数量：{{ dataChunks[dataChunkPac.medicineId - 1].totalTokens }}</div>-->
    <!--<div class="text item">目录id：{{ dataChunks[dataChunkPac.medicineId - 1].manifestId }}</div>-->
    <!--</template>-->
    <!--</el-card>-->
  </div>
</template>

<script>
import _ from '../common'

export default {
  name: 'DataManage',
  data () {
    return {
      dataChunkPacs: [],
      dataChunks: [],
      dataSources: [],
      showAddData: false,
      showAddData2: false,
      showAddDataSource: false,
      addFormDiagnose: {
        source: '',
        sqls: '',
        idName: '',
        tokenName: '',
        valueName: null,
        descriptionDiagnose: ''
      },
      addFormMedicine: {
        source: '',
        sqls: '',
        idName: '',
        tokenName: '',
        valueName: null,
        descriptionMedicine: ''
      },
      addSourceForm: {
        driverClassName: 'com.mysql.jdbc.Driver',
        url: 'jdbc:mysql://',
        username: '',
        password: ''
      },
      addFormDataChunk: {
        name: '',
        dataChunkDiagnose: '',
        dataChunkMedicine: '',
        descriptionDiagnose: '',
        descriptionMedicine: ''
      },
      formLabelWidth: '150px',
      timer: null,
      showSQL: false,
      dataChunkPacName: '',
      showMoreInfo: false
    }
  },
  mounted: function () {
    this.getAllDataPac()
    this.getAllData()
    this.getAllSource()
    this.timer = setInterval(() => {
      this.getAllData()
      this.getAllSource()
    }, 5000)
  },
  beforeDestroy: function () {
    clearInterval(this.timer)
  },
  filters: {
    getDate: val => {
      return _.getTimeStr(val)
    },
    getWholeDate: val => {
      return _.getTimeStr(val) + ' ' + _.getHourTime(val)
    }
  },
  methods: {
    getAllData () {
      _.get('/input/data').then(resp => {
        _.D(resp.data)
        // this.dataChunks = []
        this.dataChunks = resp.data.reverse()
        // for (let i in resp.data) {
        //   this.dataChunks.push(resp.data[i])
        // }
      })
    },
    getIndex (dataChunkId) {
      for (let index = 0; index < this.dataChunks.length; index++) {
        if (this.dataChunks[index].id === dataChunkId) {
          return index
        }
      }
    },
    getAllDataPac () {
      _.get('/input/datapac').then(resp => {
        _.D(resp.data)
        this.dataChunkPacs = resp.data.reverse()
      })
    },
    getAllSource () {
      _.get('/input/data-source').then(resp => {
        _.D(resp.data)
        this.dataSources = resp.data.reverse()
      })
    },
    sendAddDataPac () {
      this.$refs['addFormDiagnose'].validate(valid1 => {
        this.$refs['addFormMedicine'].validate(
          valid2 => {
            if (!valid1 || !valid2) {
              return false
            }
            let sqListDiagnose = this.addFormDiagnose.sqls.split('\n').filter(str => str.trim().length > 0)
            let sqListMedicine = this.addFormMedicine.sqls.split('\n').filter(str => str.trim().length > 0)
            _.D(sqListDiagnose)
            _.D(sqListMedicine)
            if (sqListDiagnose.length === 0) {
              this.addFormDiagnose.sqls = ''
              this.$refs['addFormDiagnose'].validate(() => {})
              return false
            }
            if (sqListMedicine.length === 0) {
              this.addFormMedicine.sqls = ''
              this.$refs['addFormMedicine'].validate(() => {})
              return false
            }
            let params = {}
            if (sqListDiagnose.length > 1 && sqListMedicine.length > 1) {
              params = {
                dataSourceId1: this.addFormDiagnose.source,
                sqls1: sqListDiagnose,
                idName1: this.addFormDiagnose.idName,
                tokenName1: this.addFormDiagnose.tokenName,
                valueName1: this.addFormDiagnose.valueName,
                dataSourceId2: this.addFormMedicine.source,
                sqls2: sqListMedicine,
                idName2: this.addFormMedicine.idName,
                tokenName2: this.addFormMedicine.tokenName,
                valueName2: this.addFormMedicine.valueName,
                descriptionDiagnose: this.addFormDiagnose.descriptionDiagnose,
                descriptionMedicine: this.addFormMedicine.descriptionMedicine,
                dataChunkPacName: this.dataChunkPacName
              }
            } else if (sqListDiagnose.length > 1) {
              params = {
                dataSourceId1: this.addFormDiagnose.source,
                sql1: sqListDiagnose,
                idName1: this.addFormDiagnose.idName,
                tokenName1: this.addFormDiagnose.tokenName,
                valueName1: this.addFormDiagnose.valueName,
                dataSourceId2: this.addFormMedicine.source,
                sql2: sqListMedicine[0],
                idName2: this.addFormMedicine.idName,
                tokenName2: this.addFormMedicine.tokenName,
                valueName2: this.addFormMedicine.valueName,
                descriptionDiagnose: this.addFormDiagnose.descriptionDiagnose,
                descriptionMedicine: this.addFormMedicine.descriptionMedicine,
                dataChunkPacName: this.dataChunkPacName
              }
            } else if (sqListMedicine.length > 1) {
              params = {
                dataSourceId1: this.addFormDiagnose.source,
                sql1: sqListDiagnose[0],
                idName1: this.addFormDiagnose.idName,
                tokenName1: this.addFormDiagnose.tokenName,
                valueName1: this.addFormDiagnose.valueName,
                dataSourceId2: this.addFormMedicine.source,
                sql2: sqListMedicine,
                idName2: this.addFormMedicine.idName,
                tokenName2: this.addFormMedicine.tokenName,
                valueName2: this.addFormMedicine.valueName,
                descriptionDiagnose: this.addFormDiagnose.descriptionDiagnose,
                descriptionMedicine: this.addFormMedicine.descriptionMedicine,
                dataChunkPacName: this.dataChunkPacName
              }
            } else {
              params = {
                dataSourceId1: this.addFormDiagnose.source,
                sql1: sqListDiagnose[0],
                idName1: this.addFormDiagnose.idName,
                tokenName1: this.addFormDiagnose.tokenName,
                valueName1: this.addFormDiagnose.valueName,
                dataSourceId2: this.addFormMedicine.source,
                sql2: sqListMedicine[0],
                idName2: this.addFormMedicine.idName,
                tokenName2: this.addFormMedicine.tokenName,
                valueName2: this.addFormMedicine.valueName,
                descriptionDiagnose: this.addFormDiagnose.descriptionDiagnose,
                descriptionMedicine: this.addFormMedicine.descriptionMedicine,
                dataChunkPacName: this.dataChunkPacName
              }
            }
            _.post('/input/dataPac', params, {}).then(resp => {
              _.D(resp.data)
              this.getAllData()
              this.getAllDataPac()
            })
            this.showAddData = false
          })
      })
    },
    sendAddDataPac2 () {
      this.$refs['addFormDataChunk'].validate(valid => {
        if (!valid) {
          return false
        }
        let params = this.addFormDataChunk
        _.post('/input/dataPac2', params, {}).then(resp => {
          _.D(resp.data)
          this.getAllData()
          this.getAllDataPac()
        })
        this.showAddData2 = false
      })
    },
    sendAddData () {
      this.$refs['addFormDiagnose'].validate(valid => {
        if (!valid) {
          return false
        }
        let sqlList = this.addFormDiagnose.sqls.split('\n').filter(str => str.trim().length > 0)
        _.D(sqlList)
        if (sqlList.length === 0) {
          this.addFormDiagnose.sqls = ''
          this.$refs['addFormDiagnose'].validate(() => {})
          return false
        }
        let params = {}
        if (sqlList.length > 1) {
          params = {
            dataSourceId: this.addFormDiagnose.source,
            sqls: sqlList,
            idName: this.addFormDiagnose.idName,
            tokenName: this.addFormDiagnose.tokenName,
            valueName: this.addFormDiagnose.valueName
          }
        } else {
          params = {
            dataSourceId: this.addFormDiagnose.source,
            sql: sqlList[0],
            idName: this.addFormDiagnose.idName,
            tokenName: this.addFormDiagnose.tokenName,
            valueName: this.addFormDiagnose.valueName
          }
        }
        _.post('/input/data', params, {}).then(resp => {
          _.D(resp.data)
          this.getAllData()
        })

        this.showAddData = false
      })
    },
    deleteData (id) {
      _.post('/input/datapac/' + id + '/delete', {}).then(
        () => {
          this.getAllDataPac()
          this.getAllData()
        }
      )
    },
    sendAddSource () {
      this.$refs['addSourceForm'].validate(valid => {
        if (!valid) {
          return false
        }
        _.post('/input/data-source', {
          driverClassName: this.addSourceForm.driverClassName,
          url: this.addSourceForm.url,
          username: this.addSourceForm.username,
          password: this.addSourceForm.password
        }).then(resp => {
          _.D(resp.data)
          this.getAllSource()
        })
        this.showAddDataSource = false
      })
    },
    startImport (dataChunk, forced) {
      _.post('/input/data/' + dataChunk.id + '/start', {
        forced: forced
      }).then(() => {
        // this.getAllData()
        dataChunk.status = 'Processing'
      })
    },
    startImportPac (id, forced) {
      _.post('/input/datapac/' + id + '/start', {
        forced: forced
      }).then(() => {
        // this.getAllData()
        this.dataChunkPacs[id].status = 'Processing'
      })
    },
    queryProgress (id) {
      _.get('/input/data/' + id + '/progress').then(resp => {
        alert(JSON.stringify(resp.data))
      }).catch(e => {
        _.D(e)
        alert(e.response.data.message)
      })
    }
  }
}
</script>

<style scoped>
.data {
  text-align: left;
  ;
}
.text {
  font-size: 14px;
}

.sql {
  margin-left: 10px;
  margin-bottom: 10px;
}

.item {
  margin-bottom: 14px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.box-card {
  /*width: 480px;*/
  margin-bottom: 10px;
  margin-top: 10px;
}
</style>
