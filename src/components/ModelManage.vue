<template>
  <div class="model">
    <el-button type="primary" icon="el-icon-plus" @click="showAddModel = true">添加</el-button>
    <el-dialog title="新建模型" :visible.sync="showAddModel" width="80%">
      <el-form :model="addModel" ref="addModel">
        <el-form-item label="输入数据块" :label-width="formLabelWidth" prop="dataChunkIds" :rules="{required: true, message: '输入数据块不能为空', trigger: 'blur'}">
          <el-select v-model="dataChunkPacId" placeholder="请选择" size="medium" style="width: 80%">
            <el-option
              v-for="dataChunkPac in dataChunkPacs"
              :key="dataChunkPac.id"
              :label="'数据块 '+ dataChunkPac.name"
              :value="dataChunkPac.diagnoseId + '###' + dataChunkPac.medicineId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主题数目" :label-width="formLabelWidth" prop="totalTopics" :rules="{required: true, message: '主题数目不能为空', trigger: 'blur'}">
          <el-input v-model="addModel.totalTopics" auto-complete="off" style="width: 80%"/>
        </el-form-item>
        <el-form-item label="预处理规则文件" :label-width="formLabelWidth">
          <el-input v-model="addModel.ruleFile" auto-complete="off" style="width: 80%"/>
        </el-form-item>
        <el-form-item label="Alpha总和" :label-width="formLabelWidth">
          <el-input v-model="addModel.alphaSum" auto-complete="off" style="width: 80%"/>
        </el-form-item>
        <el-form-item label="Beta总和" :label-width="formLabelWidth">
          <el-input v-model="addModel.betaSum" auto-complete="off" style="width: 80%"/>
        </el-form-item>
        <el-form-item label="随机数种子" :label-width="formLabelWidth">
          <el-input v-model="addModel.randomSeed" auto-complete="off" style="width: 80%"/>
        </el-form-item>
        <el-form-item label="迭代次数" :label-width="formLabelWidth">
          <el-input v-model="addModel.numIteration" auto-complete="off" style="width: 80%"/>
        </el-form-item>
        <el-form-item label="后台打印主题间隔（迭代次数）" :label-width="formLabelWidth">
          <el-input v-model="addModel.showTopicsInterval" auto-complete="off" style="width: 80%"/>
        </el-form-item>
        <el-form-item label="后台打印主题词数（Top N）" :label-width="formLabelWidth">
          <el-input v-model="addModel.showTopicsNum" auto-complete="off" style="width: 80%"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAddModel = false">取 消</el-button>
        <el-button type="primary" @click="sendAddModel()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="展示模型" :visible.sync="show" width="90%">
      <span v-html="model"></span>
      <div slot="footer" class="dialog-footer">
        <el-button  type="primary" @click="show = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-table :data="topicModels" style="width: 100%; padding: 5px 5px; margin-top: 15px">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="数据块名称: ">
              <span>{{ dataChunkPacs[getDatachunkPacById(props.row.dataChunkIds)].name }}</span>
            </el-form-item>
            <!--<p/>-->
            <el-form-item label="Alpha总和: ">
              <span>{{props.row.alphaSum}}</span>
            </el-form-item>
            <el-form-item label="Beta总和: ">
              <span>{{ props.row.betaSum }}</span>
            </el-form-item>
            <el-form-item v-if="props.row.ruleFile != null" label="预处理规则: ">
              <span>{{ props.row.ruleFile }}</span>
            </el-form-item>
            <el-form-item label="模型随机数种子: ">
              <span>{{ props.row.randomSeed }}</span>
            </el-form-item>
            <el-form-item label="模型迭代次数: ">
              <span>{{ props.row.numIteration }}</span>
            </el-form-item>
            <el-form-item label="后台打印主题间隔（迭代次数）: ">
              <span>{{ props.row.showTopicsInterval }}</span>
            </el-form-item>
            <el-form-item label="后台打印主题词数（Top N）: ">
              <span>{{ props.row.showTopicsNum }}</span>
            </el-form-item>
            <template v-if="props.row.status === 'Finished'">
              <el-form-item label="目录id： ">
                <span>{{ props.row.manifestId }}</span>
              </el-form-item>
            </template>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="模型Id" style="width: 15%"/>
      <el-table-column prop="totalTopics" label="主题数目" style="width: 25%"/>
      <el-table-column prop="createTime" label="创建时间" style="width: 25%"/>
      <el-table-column prop="status" label="数据导入状态" style="width: 10%"/>
      <el-table-column label="操作" style="width: 25%">
        <template slot-scope="scope">
          <el-button size="mini" @click="deleteTraining(scope.row.id)" type="danger">删除模型</el-button>
          <el-button size="mini" v-if="scope.row.status === 'Stopped'" @click="startTraining(scope.row, true)" type="success">开始训练</el-button>
          <el-button size="mini" v-if="scope.row.status !== 'Stopped'" @click="startTraining(scope.row, true)"  type="danger">重新训练</el-button>
          <el-button size="mini" v-if="scope.row.status === 'Processing'" @click="queryProgress(scope.row.id)" type="info">查看进度</el-button>
          <el-button size="mini" v-if="scope.row.status === 'Finished'" @click="showModel(scope.row.id)" type="info">展示结果</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--<el-card v-for="topicModel in topicModels" :key="topicModel.id" class="box-card">-->
      <!--<div slot="header" class="clearfix">-->
        <!--<span>主题模型：{{topicModel.id}}</span>-->
        <!--<el-button @click="deleteTraining(topicModel)" style="float: right; padding: 5px 5px;" type="danger">删除模型</el-button>-->
        <!--<el-button v-if="topicModel.status === 'Stopped'" @click="startTraining(topicModel, true)" style="float: right; padding: 5px 5px; margin-right: 10px" type="success">开始训练</el-button>-->
        <!--<el-button v-if="topicModel.status !== 'Stopped'" @click="startTraining(topicModel, true)" style="float: right; padding: 5px 5px; margin-right: 10px" type="danger">重新训练</el-button>-->
        <!--<el-button v-if="topicModel.status === 'Processing'" @click="queryProgress(topicModel.id)" style="float: right; padding: 5px 5px; margin-right: 10px" type="info">查看进度</el-button>-->
      <!--</div>-->
      <!--<div class="text item">创建时间：{{ topicModel.createTime | getWholeDate }}</div>-->
      <!--<div class="text item">输入数据块：</div>-->
      <!--<div v-for="(dataChunkId, idx) in topicModel.dataChunkIds" :key="idx" class="text sql">-->
        <!--{{ dataChunkId }}-->
      <!--</div>-->
      <!--<div v-if="topicModel.ruleFile != null" class="text item">预处理规则：{{ topicModel.ruleFile }}</div>-->
      <!--<div class="text item">主题数目：{{ topicModel.totalTopics }}</div>-->
      <!--<div class="text item">Alpha总和：{{ topicModel.alphaSum }}</div>-->
      <!--<div class="text item">Beta总和：{{ topicModel.betaSum }}</div>-->
      <!--<div class="text item">模型随机数种子：{{ topicModel.randomSeed }}</div>-->
      <!--<div class="text item">模型迭代次数：{{ topicModel.numIteration }}</div>-->
      <!--<div class="text item">后台打印主题间隔（迭代次数）：{{ topicModel.showTopicsInterval }}</div>-->
      <!--<div class="text item">后台打印主题词数（Top N）：{{ topicModel.showTopicsNum }}</div>-->
      <!--<div class="text item">模型训练状态：{{ topicModel.status }}</div>-->
      <!--<template v-if="topicModel.status === 'Finished'">-->
        <!--<div class="text item">目录id：{{ topicModel.manifestId }}</div>-->
      <!--</template>-->
    <!--</el-card>-->
  </div>
</template>

<script>
import _ from '../common'

export default {
  name: 'ModelManage',
  data () {
    return {
      dataChunkPacs: [],
      topicModels: [],
      dataChunks: [],
      dataSources: [],
      showAddModel: false,
      addModel: {
        dataChunkIds: [],
        totalTopics: '',
        ruleFile: 'rule/rule.yml',
        alphaSum: 50,
        betaSum: 200,
        randomSeed: 0,
        numIteration: 1000,
        showTopicsInterval: 100,
        showTopicsNum: 7
      },
      model: '',
      show: false,
      formLabelWidth: '120px',
      dataChunkPacId: null,
      timer: null
    }
  },
  mounted: function () {
    this.getAllDataPac()
    this.getAllModel()
    this.getAllData()
    this.timer = setInterval(() => {
      this.getAllData()
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
    getAllModel () {
      _.get('/topics-model/training').then(resp => {
        _.D(resp.data)
        this.topicModels = resp.data.reverse()
      })
    },
    getAllDataPac () {
      _.get('/input/datapac').then(resp => {
        _.D(resp.data)
        this.dataChunkPacs = resp.data.reverse()
      })
    },
    getAllData () {
      _.get('/input/data').then(resp => {
        _.D(resp.data)
        this.dataChunks = []
        // this.dataChunks = resp.data.reverse()
        for (let i in resp.data) {
          if (resp.data[i].status === 'Finished') {
            this.dataChunks.unshift(resp.data[i])
          }
        }
      })
    },
    getAllSource () {
      _.get('/input/data-source').then(resp => {
        _.D(resp.data)
        this.dataSources = resp.data.reverse()
      })
    },
    getDatachunkPacById (Ids) {
      if (Ids.length !== 2) {
        return 0
      }
      let id1 = Ids[0]
      let id2 = Ids[1]
      for (let i = 0; i < this.dataChunkPacs.length; i++) {
        if (this.dataChunkPacs[i].medicineId === id1 && this.dataChunkPacs[i].diagnoseId === id2) {
          return i
        } else if (this.dataChunkPacs[i].medicineId === id2 && this.dataChunkPacs[i].diagnoseId === id1) {
          return i
        }
      }
      return 0
    },
    sendAddModel () {
      let words = this.dataChunkPacId.split('###')
      this.addModel.dataChunkIds = [words[0], words[1]]
      this.$refs['addModel'].validate(valid => {
        if (!valid) {
          return false
        }
        // let params = {
        //   dataSourceId: this.addModel.source,
        //   sqls: sqlList,
        //   idName: this.addModel.idName,
        //   tokenName: this.addModel.tokenName,
        //   valueName: this.addModel.valueName
        // }
        _.post('/topics-model/training', this.addModel, {}).then(resp => {
          _.D(resp.data)
          this.getAllModel()
        })

        this.showAddModel = false
      })
    },
    startTraining (topicModel, forced) {
      _.post('/topics-model/training/' + topicModel.id + '/start', {
        forced: forced
      }).then(() => {
        // this.getAllData()
        topicModel.status = 'Processing'
      })
    },
    deleteTraining (id) {
      _.post('/topics-model/training/' + id + '/delete', {}).then(
        () => {
          this.getAllModel()
        }
      )
    },
    queryProgress (id) {
      _.get('/topics-model/' + id).then(resp => {
        alert(resp.data.currentIteration + '/' + resp.data.totalIteration)
      }).catch(e => {
        _.D(e)
        alert(e.response.data.message)
      })
    },
    showModel (id) {
      _.get('/topics-model/training/' + id + '/show').then(resp => {
        _.D(resp.data)
        this.model = resp.data
        this.show = true
      })
    },
    formatDate (date, fmt) {
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
      }
      for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          let str = o[k] + ''
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length))
        }
      }
      return fmt
    }
  }
}
</script>

<style scoped>
.model {
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
  margin: 10px 0;
  /*float: left;*/
}
</style>
