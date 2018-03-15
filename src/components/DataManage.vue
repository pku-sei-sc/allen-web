<template>
  <div class="data">
    <el-button type="primary" icon="el-icon-plus" @click="showAddData = true">添加</el-button>
    <el-dialog title="导入数据" :visible.sync="showAddData" width="80%">
      <el-form :model="addForm" ref="addForm">
        <el-form-item label="数据来源" :label-width="formLabelWidth" prop="source" :rules="{required: true, message: '数据来源不能为空', trigger: 'blur'}">
          <el-select v-model="addForm.source" placeholder="请选择" size="medium" style="width: 80%">
            <el-option
              v-for="dataSource in dataSources"
              :key="dataSource.id"
              :label="dataSource.id + ': ' + dataSource.url"
              :value="dataSource.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SQL查询语句" :label-width="formLabelWidth" prop="sqls" :rules="{required: true, message: 'SQL查询语句不能为空', trigger: 'blur'}">
          <el-input type="textarea" v-model="addForm.sqls" auto-complete="off" style="width: 80%"/>
        </el-form-item>
        <el-form-item label="实例id名称" :label-width="formLabelWidth" prop="idName" :rules="{required: true, message: '实例id名称不能为空', trigger: 'blur'}">
          <el-input v-model="addForm.idName" auto-complete="off" style="width: 80%"/>
        </el-form-item>
        <el-form-item label="词语名称" :label-width="formLabelWidth" prop="tokenName" :rules="{required: true, message: '词语名称不能为空', trigger: 'blur'}">
          <el-input v-model="addForm.tokenName" auto-complete="off" style="width: 80%"/>
        </el-form-item>
        <el-form-item label="属性值名称" :label-width="formLabelWidth">
          <el-input v-model="addForm.valueName" auto-complete="off" style="width: 80%"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAddData = false">取 消</el-button>
        <el-button type="primary" @click="sendAddData()">确 定</el-button>
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
    <el-card v-for="dataChunk in dataChunks" :key="dataChunk.id" class="box-card">
      <div slot="header" class="clearfix">
        <span>数据块：{{dataChunk.id}}</span>
        <el-button v-if="dataChunk.status === 'Stopped'" @click="startImport(dataChunk, true)" style="float: right; padding: 5px 5px;" type="success">开始导入</el-button>
        <el-button v-if="dataChunk.status !== 'Stopped'" @click="startImport(dataChunk, true)" style="float: right; padding: 5px 5px;" type="danger">重新导入</el-button>
        <el-button v-if="dataChunk.status === 'Processing'" @click="queryProgress(dataChunk.id)" style="float: right; padding: 5px 5px; margin-right: 10px" type="info">查看进度</el-button>
      </div>
      <div class="text item">创建时间：{{ dataChunk.createTime | getWholeDate }}</div>
      <div class="text item">数据源：{{ dataChunk.dataSourceId }}</div>
      <div class="text item">SQL：</div>
      <div v-for="(sql, idx) in dataChunk.sqls" :key="idx" class="text sql">
        {{ sql }}
      </div>
      <div class="text item">实例id名称：{{ dataChunk.idName }}</div>
      <div class="text item">词语名称：{{ dataChunk.tokenName }}</div>
      <div class="text item">属性值名称：{{ dataChunk.valueName != null ? dataChunk.valueName : '(无)'}}</div>
      <div class="text item">数据导入状态：{{ dataChunk.status }}</div>
      <template v-if="dataChunk.status === 'Finished'">
        <div class="text item">实例数量：{{ dataChunk.totalInstances }}</div>
        <div class="text item">词语种类：{{ dataChunk.totalTypes }}</div>
        <div class="text item">词语数量：{{ dataChunk.totalTokens }}</div>
        <div class="text item">目录id：{{ dataChunk.manifestId }}</div>
      </template>
    </el-card>
  </div>
</template>

<script>
import _ from '../common'

export default {
  name: 'DataManage',
  data () {
    return {
      dataChunks: [],
      dataSources: [],
      showAddModel: false,
      showAddDataSource: false,
      addForm: {
        source: '',
        sqls: '',
        idName: '',
        tokenName: '',
        valueName: null
      },
      addSourceForm: {
        driverClassName: 'com.mysql.jdbc.Driver',
        url: 'jdbc:mysql://',
        username: '',
        password: ''
      },
      formLabelWidth: '120px'
    }
  },
  mounted: function () {
    this.getAllData()
    this.getAllSource()
    setInterval(() => {
      this.getAllData()
      this.getAllSource()
    }, 5000)
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
    getAllSource () {
      _.get('/input/data-source').then(resp => {
        _.D(resp.data)
        this.dataSources = resp.data.reverse()
      })
    },
    sendAddData () {
      this.$refs['addForm'].validate(valid => {
        if (!valid) {
          return false
        }
        let sqlList = this.addForm.sqls.split('\n').filter(str => str.trim().length > 0)
        _.D(sqlList)
        if (sqlList.length === 0) {
          this.addForm.sqls = ''
          this.$refs['addForm'].validate(() => {})
          return false
        }
        let params = {}
        if (sqlList.length > 1) {
          params = {
            dataSourceId: this.addForm.source,
            sqls: sqlList,
            idName: this.addForm.idName,
            tokenName: this.addForm.tokenName,
            valueName: this.addForm.valueName
          }
        } else {
          params = {
            dataSourceId: this.addForm.source,
            sql: sqlList[0],
            idName: this.addForm.idName,
            tokenName: this.addForm.tokenName,
            valueName: this.addForm.valueName
          }
        }
        _.post('/input/data', params, {}).then(resp => {
          _.D(resp.data)
          this.getAllData()
        })

        this.showAddModel = false
      })
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
