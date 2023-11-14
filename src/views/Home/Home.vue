<template>
  <div class="home">
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div
            class="card-panel-icon-wrapper"
            style="background-color: antiquewhite"
          >
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-171"></use>
            </svg>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">注册人数</div>
            <div class="card-panel-number">{{ countRegister }}</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div
            class="card-panel-icon-wrapper"
            style="background-color: rgba(0, 123, 100, 0.21)"
          >
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-xunjiantongji"></use>
            </svg>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">今日注册</div>
            <div class="card-panel-number">{{ todayRegister }}</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div
            class="card-panel-icon-wrapper"
            style="background-color: rgba(68, 166, 227, 0.2)"
          >
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zaixianwenzhen"></use>
            </svg>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">当前在线</div>
            <div class="card-panel-number">{{ currentOnline }}</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div
            class="card-panel-icon-wrapper"
            style="background-color: rgba(237, 92, 177, 0.2);"
          >
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-lishixiaoxi"></use>
            </svg>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">消息总量</div>
            <div class="card-panel-number">{{ countMsg }}</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <v-chart class="chart" :option="option" />
  </div>
</template>

<script>
import '../../assets/styles/iconfont/iconfont'
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import { ToolboxComponent } from "echarts/components";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import store from '../../store/index'
use([
  ToolboxComponent,
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);
export default {
  name: "Home",
  data() {
    return {
      countRegister: 0,
      currentOnline: 0,
      todayRegister: 0,
      countMsg: 0,
      token: store.state.LoginModule.userinfo.token,
      option: {
        title: {
          left: "3%",
          top: "5%",
          text: "最近一周注册人数统计", //标题文本，支持使用 \n 换行。
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          align: "right", //文字在前图标在后
          left: "3%",
          top: "15%",
          data: ["近一周"],
        },
        grid: {
          top: "30%",
          left: "5%",
          right: "5%",
          bottom: "5%",
          containLabel: true,
        },

        toolbox: {
          feature: {
            saveAsImage: {}, //保存为图片
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: "20%",
          axisTick: {
            alignWithLabel: true, //保证刻度线和标签对齐
          },
          data: [], //x坐标的名称
        },
        yAxis: {
          type: "value",
          boundaryGap: true,
          // splitNumber: 4, //纵坐标数
          interval: 1, //强制设置坐标轴分割间隔
        },

        series: [
          {
            name: "近一周",
            type: "line", //折线图line;柱形图bar;饼图pie
            stack: "总量",
            areaStyle: {
              //显示区域颜色---渐变效果
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgb(13, 156, 251)", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#ffffff", // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
            itemStyle: {
              color: "rgb(13, 156, 251)", //改变折线点的颜色
              lineStyle: {
                color: "rgb(13, 156, 251)", //改变折线颜色
              },
            },
            data: [],
          },
        ],
      },
    };
  },
  created() {
    this.getTodayRegisters()
    this.getCountMsg()
    this.getCountRegisters()
    this.getCurrentOnline()
    this.getWeekCounts();
  },
  methods: {
    getWeekCounts() {
      this.axios.get("user/getWeekCounts", {
        headers: {
          'token': this.token,
        }
      }).then(response=>{
        var res = response.data;
        var data = [];
        var Xdata = [];
        for(const key in res) {
          Xdata.push(key);
          data.push(res[key]);
        }
        this.option.xAxis.data = Xdata;
        this.option.series[0].data = data;
      })
    },
    getTodayRegisters() {
      this.axios.get("user/getTodayRegisters", {
        headers: {
          'token': this.token,
        }
      }).then(response=>{
        this.todayRegister = response.data;
      })
    },
    getCountRegisters() {
      this.axios.get("user/getCountRegisters", {
        headers: {
          'token': this.token,
        }
      }).then(response=>{
        this.countRegister = response.data;
      })
    },
    getCurrentOnline() {
      this.axios.get("converse/getCurrentOnline", {
        headers: {
          'token': this.token,
        }
      }).then(response=>{
        this.currentOnline = response.data;
      })
    },
    getCountMsg() {
      this.axios.get("converse/getCountMsg", {
        headers: {
          'token': this.token,
        }
      }).then(response=>{
        this.countMsg = response.data;
      })
    },
  },
};
</script>
<style scoped>
.icon {
  width: 48px;
  height: 48px;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.card-panel-icon-wrapper {
  text-align: center;
}
.home {
  margin: 40px;
}
.el-row {
  margin: 20px !important;
}
.chart {
  height: 400px;
}
.panel-group {
  margin-top: 18px;
}

.card-panel-col {
  margin-bottom: 32px;
}

.card-panel {
  display: flex;
  height: 108px;
  font-size: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.05);
}

.card-panel-description {
  flex: 1;
  font-weight: bold;
  margin: 26px;
}
.card-panel-text {
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
  margin-bottom: 10px;
}
.card-panel-number {
  color: rgba(0, 0, 0, 0.65);
  font-size: 20px;
  margin-bottom: 10px;
}

.card-panel-icon-wrapper {
  flex: 1;
  border-radius: 6px;
  padding-top: 26px;
}
</style>