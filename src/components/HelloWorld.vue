<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li>
        <a
          href="https://vuejs.org"
          target="_blank"
        >
          Core Docs
        </a>
      </li>
      <li>
        <a
          href="https://forum.vuejs.org"
          target="_blank"
        >
          Forum
        </a>
      </li>
      <li>
        <a
          href="https://chat.vuejs.org"
          target="_blank"
        >
          Community Chat
        </a>
      </li>
      <li>
        <a
          href="https://twitter.com/vuejs"
          target="_blank"
        >
          Twitter
        </a>
      </li>
      <br>
      <li>
        <a
          href="http://vuejs-templates.github.io/webpack/"
          target="_blank"
        >
          Docs for This Template
        </a>
      </li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li>
        <a
          href="http://router.vuejs.org/"
          target="_blank"
        >
          vue-router
        </a>
      </li>
      <li>
        <a
          href="http://vuex.vuejs.org/"
          target="_blank"
        >
          vuex
        </a>
      </li>
      <li>
        <a
          href="http://vue-loader.vuejs.org/"
          target="_blank"
        >
          vue-loader
        </a>
      </li>
      <li>
        <a
          href="https://github.com/vuejs/awesome-vue"
          target="_blank"
        >
          awesome-vue
        </a>
      </li>
    </ul>
    <div id="myChart" :style="{width: '300px', height: '300px'}"></div>
    <el-button type="primary" @click="drawGraph()">确 定</el-button>
    <!--<div> {{xml}}</div>-->
  </div>
</template>

<script>
import axios from 'axios'
import _ from '../common'
import parse from 'echarts/dist/extension/dataTool'

export default {
  name: 'hello',
  data () {
    return {
      dataChunks: [],
      msg: 'Welcome to Your Vue.js App',
      xml: '123'
    }
  },
  mounted: function () {
    this.drawGraph()
  },
  methods: {
    drawLine () {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        title: {text: '在Vue中使用echarts'},
        tooltip: {},
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      })
    },
    drawGraph () {
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      axios({
        method: 'get',
        url: '../../static/les-miserables.gexf',
        responseType: 'text'
      }).then(resp => {
        _.D(resp.data)
        this.xml = resp.data
      })
      // let graph = this.$echarts.dataTool.gexf.parse(this.xml)
      let graph = parse(this.xml)
      let categories = []
      for (let i = 0; i < 9; i++) {
        categories[i] = {
          name: '系列' + i
        }
      }// 此处可修改系列名，原模板命名为系列1~系列9，此处我们修改为4个系列
      graph.nodes.forEach(function (node) {
        node.itemStyle = null
        node.value = node.symbolSize
        node.label = {normal: {show: node.symbolSize > 10}}// 此处修改显示lable的规则，如当节点大小大于10时，显示该节点大小
        node.category = node.attributes.type_class// 此处修改分类依据，可改成任意integer类型的属性
      })
      let option = {
        title: {
          text: 'Math Relations', // 此处修改图名称
          subtext: 'Default layout', // 此处修改布局名称
          top: 'bottom',
          left: 'right'
        },
        tooltip: {},
        legend: [{
          // selectedMode: 'single',
          data: categories.map(function (a) {
            return a.name
          })
        }],
        animationDuration: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            name: 'Les Miserables',
            type: 'graph',
            layout: 'circular', // 此处修改布局方法，none为随机，circular为环形
            data: graph.nodes,
            links: graph.links,
            categories: categories,
            roam: true,
            label: {
              normal: {
                position: 'right',
                formatter: '{b}'
              }
            },
            lineStyle: {
              normal: {
                curveness: 0.3
              }
            }
          }
        ]
      }
      myChart.setOption(option)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
