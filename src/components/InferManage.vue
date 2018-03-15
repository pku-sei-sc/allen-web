<template>
  <div class="infer">
    <el-button type="primary" icon="el-icon-plus" @click="showAddModel = true">添加</el-button>
    <el-dialog title="新建推断" :visible.sync="showAddModel" width="80%">
      <el-form :model="addInfer" ref="addInfer">
        <el-form-item label="推断数据块" :label-width="formLabelWidth" prop="dataChunkId" :rules="{required: true, message: '输入数据块不能为空', trigger: 'blur'}">
          <el-select v-model="addInfer.dataChunkId" placeholder="请选择" size="medium" style="width: 80%">
            <el-option
              v-for="dataChunk in dataChunks"
              :key="dataChunk.id"
              :label="'数据块 '+ dataChunk.id"
              :value="dataChunk.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模型目录id" :label-width="formLabelWidth" prop="modelManifest" :rules="{required: true, message: '主题目录id不能为空', trigger: 'blur'}">
          <el-select v-model="addInfer.modelManifest" placeholder="请选择" size="medium" style="width: 80%">
            <el-option
              v-for="topicModel in topicModels"
              :key="topicModel.id"
              :label="'主题模型 '+ topicModel.id + ': ' + topicModel.manifestId"
              :value="topicModel.manifestId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预处理规则文件" :label-width="formLabelWidth">
          <el-input v-model="addInfer.ruleFile" auto-complete="off" style="width: 80%"/>
        </el-form-item>
        <el-form-item label="推断语言" :label-width="formLabelWidth">
          <el-input v-model="addInfer.language" auto-complete="off" style="width: 80%"/>
        </el-form-item>
        <el-form-item label="随机数种子" :label-width="formLabelWidth">
          <el-input v-model="addInfer.randomSeed" auto-complete="off" style="width: 80%"/>
        </el-form-item>
        <el-form-item label="迭代次数" :label-width="formLabelWidth">
          <el-input v-model="addInfer.numIterations" auto-complete="off" style="width: 80%"/>
        </el-form-item>
        <el-form-item label="BurnIn次数" :label-width="formLabelWidth">
          <el-input v-model="addInfer.burnIn" auto-complete="off" style="width: 80%"/>
        </el-form-item>
        <el-form-item label="Thinning系数" :label-width="formLabelWidth">
          <el-input v-model="addInfer.thinning" auto-complete="off" style="width: 80%"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAddModel = false">取 消</el-button>
        <el-button type="primary" @click="sendAddModel()">确 定</el-button>
      </div>
    </el-dialog>
    <el-card v-for="inference in inferences" :key="inference.id" class="box-card">
      <div slot="header" class="clearfix">
        <span>主题推断：{{inference.id}}</span>
        <el-button v-if="inference.status === 'Stopped'" @click="startInference(inference, true)" style="float: right; padding: 5px 5px;" type="success">开始推断</el-button>
        <el-button v-if="inference.status !== 'Stopped'" @click="startInference(inference, true)" style="float: right; padding: 5px 5px;" type="danger">重新推断</el-button>
        <!--<el-button v-if="inference.status === 'Processing'" @click="queryProgress(inference.id)" style="float: right; padding: 5px 5px; margin-right: 10px" type="info">查看进度</el-button>-->
      </div>
      <div class="text item">创建时间：{{ inference.createTime | getWholeDate }}</div>
      <div class="text item">推断数据块：{{ inference.dataChunkId }}</div>
      <div v-if="inference.ruleFile != null" class="text item">预处理规则：{{ inference.ruleFile }}</div>
      <div class="text item">主题模型目录id：{{ inference.modelManifest }}</div>
      <div class="text item">推断语言：{{ inference.language }}</div>
      <div class="text item">模型随机数种子：{{ inference.randomSeed }}</div>
      <div class="text item">模型迭代次数：{{ inference.numIterations }}</div>
      <div class="text item">BurnIn次数：{{ inference.burnIn }}</div>
      <div class="text item">Thinning系数：{{ inference.thinning }}</div>
      <div class="text item">模型训练状态：{{ inference.status }}</div>
      <template v-if="inference.status === 'Finished'">
        <div class="text item">目录id：{{ inference.manifestId }}</div>
      </template>
    </el-card>
  </div>
</template>

<script>
import _ from '../common'

export default {
  name: 'InferManage',
  data () {
    return {
      inferences: [],
      dataChunks: [],
      topicModels: [],
      showAddModel: false,
      addInfer: {
        dataChunkId: '',
        modelManifest: '',
        ruleFile: 'rule/rule.yml',
        language: null,
        randomSeed: null,
        numIterations: null,
        burnIn: null,
        thinning: null
      },
      formLabelWidth: '120px'
    }
  },
  mounted: function () {
    this.getAllInference()
    this.getAllData()
    this.getAllModel()
    setInterval(() => {
      this.getAllInference()
      this.getAllData()
      this.getAllModel()
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
    getAllInference () {
      _.get('/topics-model/inference').then(resp => {
        _.D(resp.data)
        this.inferences = resp.data.reverse()
      })
    },
    getAllModel () {
      _.get('/topics-model/training').then(resp => {
        _.D(resp.data)
        this.topicModels = []
        // this.dataChunks = resp.data.reverse()
        for (let i in resp.data) {
          if (resp.data[i].status === 'Finished') {
            this.topicModels.unshift(resp.data[i])
          }
        }
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
    sendAddModel () {
      this.$refs['addInfer'].validate(valid => {
        if (!valid) {
          return false
        }
        // let params = {
        //   dataSourceId: this.addInfer.source,
        //   sqls: sqlList,
        //   idName: this.addInfer.idName,
        //   tokenName: this.addInfer.tokenName,
        //   valueName: this.addInfer.valueName
        // }
        _.post('/topics-model/inference', this.addInfer, {}).then(resp => {
          _.D(resp.data)
          this.getAllInference()
        })

        this.showAddModel = false
      })
    },
    startInference (inference, forced) {
      _.post('/topics-model/inference/' + inference.id + '/start', {
        forced: forced
      }).then(() => {
        // this.getAllData()
        inference.status = 'Processing'
      })
    },
    queryProgress (id) {
      _.get('/topics-model/' + id).then(resp => {
        alert(resp.data)
      }).catch(e => {
        _.D(e)
        alert(e.response.data.message)
      })
    }
  }
}
</script>

<style scoped>
.infer {
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
