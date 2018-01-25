<template>
  <div class="app-container">
    <div class="main-container" v-loading="mainLoading">
      <div style="margin: 20px">
        <div>
          <el-button type="info" size="small" @click="changeState(0)">全部</el-button>
          <el-button type="info" size="small" @click="changeState(1)">待审</el-button>
          <el-button type="info" size="small" @click="changeState(2)">删除</el-button>
          <el-button type="info" size="small" @click="changeState(3)">通过</el-button>
          <el-button type="info" size="small" @click="changeState(4)">误删</el-button>
          <el-button type="info" size="small" @click="changeState(5)">漏删</el-button>
          <!-- <el-select v-model="state.timeHourpick" placeholder="请选择时间段" style="float:right; width:110px">
            <el-option v-for="item in timeSel" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-date-picker v-model="timeDayPick" :clearable="false" type="date" placeholder="选择日期" style="float:right;margin-right:30px;width:120px"  value-format="yyyy-MM-dd" @change="dateChange">
          </el-date-picker> -->
          <div class="block" style="float:right;">
            <span class="demonstration" style="font-size: 14px;color: #48576a;font-weight:900;">请选择查询范围:</span>
             <el-date-picker
                v-model="timeDayPick"
                :picker-options="pickerOptions2"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-farmat="yyyy\/MM\/dd"
                @change="dateChange"
                :clearable="false">
              </el-date-picker>
          </div>
        </div>
        <div style="margin: 15px 0;"></div>
        <el-form>
          <el-form-item label="当前状态:">
            <el-radio-group v-model="state.currentState" size="small">
              <el-radio-button label="0">不限</el-radio-button>
              <el-radio-button label="1">通过</el-radio-button>
              <el-radio-button label="2">待审</el-radio-button>
              <el-radio-button label="3">删除</el-radio-button>
              <el-radio-button label="4">通过+待审</el-radio-button>
              <el-radio-button label="5">通过+删除</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="人工审核:">
            <el-radio-group v-model="state.humanReview" size="small">
              <el-radio-button label="0">不限</el-radio-button>
              <el-radio-button label="1">未确认</el-radio-button>
              <el-radio-button label="2">已确认</el-radio-button>
              <el-radio-button label="3">已忽略</el-radio-button>
            </el-radio-group>
            <el-button v-show="!listViewOpen" size="mini" type="warning" plain style="float:right" @click="listViewOpen=true">完整选项</el-button>
          </el-form-item>
          <div v-show="listViewOpen">
            <el-form-item label="内容类型:">
              <el-radio-group v-model="state.contentType" size="small">
                <el-radio-button label="0">不限</el-radio-button>
                <el-radio-button label="1">主题</el-radio-button>
                <el-radio-button label="2">回复</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="识别类型:">
              <el-radio-group v-model="state.indentifyType" size="small">
                <el-radio-button label="0">不限</el-radio-button>
                <el-radio-button label="1">涉政</el-radio-button>
                <el-radio-button label="2">涉黄</el-radio-button>
                <el-radio-button label="3">涉恐</el-radio-button>
                <el-radio-button label="4">广告</el-radio-button>
                <el-radio-button label="5">低俗</el-radio-button>
                <el-radio-button label="6">敏感</el-radio-button>
                <el-radio-button label="7">灌水</el-radio-button>
                <el-radio-button label="8">个性</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="彩数识别:">
              <el-radio-group v-model="state.colourdataType" size="small">
                <el-radio-button label="0">不限</el-radio-button>
                <el-radio-button label="1">通过</el-radio-button>
                <el-radio-button label="2">待审</el-radio-button>
                <el-radio-button label="3">删除</el-radio-button>
              </el-radio-group>
              <el-button size="mini" type="warning" plain style="float:right" @click="listViewOpen=false">简略选项</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <sticky className="sub-navbar">
        <el-select v-model="listQuery.seachCondition" placeholder="请选择筛选条件" class="filter-item" style="float:left;margin-left:20px">
          <el-option v-for="item in seachSel" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-input style="width: 250px;float:left;margin-left:20px" class="filter-item" :placeholder="'请输入'+seachCondition" v-model="listQuery.seachContent">
        </el-input>
        <el-button class="filter-item" type="success" style="float:left;margin-left:20px;margin-top:8px" v-waves icon="search" @click="getList">搜索</el-button>
      </sticky>
      <div style="margin: 15px 0;"></div>
      <div style="margin: 15px; display: flex;justify-content:space-between;">
        <label style="float:left">总量：{{total}}</label>
        <div>
          <el-button type="primary" size="small" @click="passAllContent">全部通过</el-button>
          <el-button type="primary" size="small" @click="deleteAllContent">全部删除</el-button>
          <el-button type="primary" size="small" @click="ignoreAllContent">全部忽略</el-button>
          <el-button type="primary" size="small" @click="cancelAllContent">全部取消</el-button>
          <el-button type="success" @click="submitAllOperation">提交</el-button>
        </div>
      </div>
      <div style="margin: 15px;  display: flex;justify-content: space-between;">
        <el-checkbox v-model="checkAll">全选</el-checkbox>
        <el-button type="danger" size="small" @click="bannedAndSubmit" :disabled="banBtn">封禁跳转提交</el-button>
      </div>

      <el-row v-for="(item, index) in list" :key="index" v-loading="listLoading" style="margin:12px">
        <el-row class="detail-box" :style="{ backgroundColor: item.bgcolor}">
          <el-col :span="20" style="margin:4px">
            <el-row>
              <label>
                <a class="aTitle">{{item.location}}</a>
              </label>>
              <label>
                <a class="aTitle" :href="item.url" target="_blank" v-html="item.title">{{item.title}}</a>
              </label>
              <el-tag v-if="item.contenttype != null" type="danger">{{item.contenttype}}</el-tag>
              <el-tag v-if="item.bbsname != null" type="success">{{item.bbsname}}</el-tag>
              <el-tag v-if="item.qatag!=null" type="primary">{{item.qatag}}</el-tag>
               <el-button type="primary" @click="addMachineLabel(item.userid,item.pid)" size="mini">添加机器学习标签</el-button>
            </el-row>
            <el-row style="display: flex;align-items: center;height:22px">
              <!-- <input type="checkbox" :value="item.rowkey" v-model="item.checked"> -->
              <el-checkbox :value="item.rowkey" v-model="item.checked"></el-checkbox>
              <h5 class="infoGrey" style="margin-left:10px;cursor:pointer" v-html="item.username" v-clipboard:copy='item.usernamereal' v-clipboard:success='clipboardSuccess'>{{item.username}}</h5>
              <p class="infoGrey">(
                <router-link class="aHref" :to="{ path: '/userinfo', query: { userid: item.userid }}">{{item.userid}}</router-link>） |
                <router-link class="aHref" :to="{ path: '/ipinfo', query: { ip: item.ip }}">{{item.ip}}</router-link> | {{item.subtime}}
              </p>
            </el-row>
            <el-row>
              <el-col :span="20" style="display: flex;align-items: center;height:40px">
                <p class="infoGrey">帖子ID:{{item.pid}}</p>
                <p class="infoGrey" style="margin-left:15px">主题ID:{{item.threadid}}</p>
                <p class="infoGrey" style="margin-left:15px">提交时间:{{item.subtime}}</p>
                <p class="infoGrey" style="margin-left:30px" v-if="item.submitor != null">操作者:{{item.submitor}}</p>
              </el-col>
              <el-col :span="4" style="display: flex;justify-content: center;align-items: center;height:40px">
                <h4 class="infoGrey">{{item.state}}</h4>
              </el-col>
            </el-row>
            <el-row>
              <el-row style="border: 1px solid #d3dce6;background: #f3f3f3;height:130px;width:99%;overflow:auto;margin-top:5px;position:absolute;" v-html="item.content">
              </el-row>
            </el-row>
            <el-row style="margin-top:140px">
              <el-col :span="16" style="display: flex;align-items: center;height:30px">
                <h4 style="color: red">{{item.wordtype}}</h4>
                <el-tooltip class="item" effect="dark" :content="item.judgedetail" placement="top">
                  <p class="infoGrey" v-if="item.judgedetail.length<=30" style="margin-left:15px">{{item.judgedetail}}</p>
                  <p class="infoGrey" v-if="item.judgedetail.length>30" style="margin-left:15px">{{item.judgedetail.substring(0,30)+'...'}}</p>
                </el-tooltip>
              </el-col>
              <el-col :span="8" style="display: flex;align-items: center;margin-top:5px">
                <el-button type="primary" size="mini" @click="submitOneOperation(item,index,1)">通过</el-button>
                <el-button type="primary" size="mini" @click="submitOneOperation(item,index,2)">删除</el-button>
                <el-button type="primary" size="mini" @click="submitOneOperation(item,index,3)">忽略</el-button>
                <el-button type="primary" size="mini" @click="submitOneOperation(item,index,4)">禁ID</el-button>
                <!-- <el-button type="danger" size="mini" @click="submitOneOperation(item,index,5)">封杀用户</el-button> -->
                <a :href="item.authorurl" target="_blank" style="margin-left:10px">
                  <el-button type="danger" size="mini">封杀用户</el-button>
                </a>
                
              </el-col>
              
            </el-row>
          </el-col>
          <el-col :span="3" style="margin:4px">
            <div style="height:220px;display:flex;justify-content: center;align-items: center;position:relative;text-align:center;">
              <el-radio-group v-model="item.optinfo" @change="changeColor(item)" style="display: flex;flex-direction: column;justify-content: space-between;">
                <div>
                  <el-radio :label="1" class="infoGrey">通过</el-radio>
                </div>
                <div>
                  <el-radio :label="2" class="infoGrey">删除</el-radio>
                </div>
                <div>
                  <el-radio :label="3" class="infoGrey">忽略</el-radio>
                </div>
              </el-radio-group>
              <el-button style="position:absolute;right:20px;bottom:30px;" type="primary" @click="addMachineStudy(item.userid,item.pid)" size="mini">加入机器学习</el-button>
              
            </div>
          </el-col>
        </el-row>
      </el-row>
      <div style="margin: 15px; display: flex;justify-content:space-between;">
        <label style="float:left">总量：{{total}}</label>
        <div>
          <el-button type="primary" size="small" @click="passAllContent">全部通过</el-button>
          <el-button type="primary" size="small" @click="deleteAllContent">全部删除</el-button>
          <el-button type="primary" size="small" @click="ignoreAllContent">全部忽略</el-button>
          <el-button type="primary" size="small" @click="cancelAllContent">全部取消</el-button>
          <el-button type="success" @click="submitAllOperation">提交</el-button>
        </div>
      </div>
      <div style="margin: 15px;  display: flex;justify-content: space-between;">
        <el-checkbox v-model="checkAll">全选</el-checkbox>
        <el-button type="danger" size="small" @click="bannedAndSubmit" :disabled="banBtn">封禁跳转提交</el-button>
      </div>
      <div v-show="!listLoading" class="pagination-container" style="  display: flex;justify-content: center;align-items: center;">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[20, 50 ,100]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
      <back-to-top transitionName="fade" :customStyle="myBackToTopStyle" :visibilityHeight="300" :backPosition="50"></back-to-top>
    </div>
    <el-dialog
      title="机器学习"
      :visible.sync="centerDialogVisible"
      width="20%"
      center
      style="width:60%;position:fixed;left:20%;">
      <div style="height:50px;border-bottom:1px solid #e5e5e5e5;">
        <!-- <div style="width:20%;float:left;">
          <strong>一级标签</strong>
        </div> -->
        <div style="width:100%;text-align:right;">
          <el-button size="medium" @click="secendLabelShow=true" >问答</el-button>
          <el-button size="medium" @click="secendLabelShow=false" type="">非问答</el-button>
        </div>
      </div>
      <div style="height:70px;padding:10px 0;" v-if="secendLabelShow" >
        <!-- <div style="width:20%;float:left;">
          <strong>二级标签</strong>
        </div> -->
        <div class="handleDialogLabel" style="width:100%;height:70px;line-height:40px;">
          <!-- <span >标签一</span><span>标签二</span><span>标签三</span><span>标签四</span><span>标签五</span><span>标签六</span><span>标签七</span><span>标签八</span> -->
          <!-- <el-radio-group v-model="radio3" size="small">
            <el-radio label="轮胎" border></el-radio>
            <el-radio label="装饰用品" border></el-radio>
            <el-radio label="二手车" border></el-radio>
            <el-radio label="故障维修" border></el-radio>
          </el-radio-group>
          
          <el-radio-group v-model="radio3" size="small">
            <el-radio label="保养" border></el-radio>
            <el-radio label="保险年检" border></el-radio>
            <el-radio label="改装" border></el-radio>
            <el-radio label="买车" border></el-radio>
          </el-radio-group> -->
          <template>
          <el-radio v-model="radio3" label="轮胎">轮胎</el-radio>
          <el-radio v-model="radio3" label="装饰用品">装饰用品</el-radio>
          <el-radio v-model="radio3" label="二手车">二手车</el-radio>
          <el-radio v-model="radio3" label="故障维修">故障维修</el-radio>
          <el-radio v-model="radio3" label="保养">保养</el-radio>
          <el-radio v-model="radio3" label="保险年检">保险年检</el-radio>
          <el-radio v-model="radio3" label="改装">改装</el-radio>
          <el-radio v-model="radio3" label="买车">买车</el-radio>
          <el-radio v-model="radio3" label="油耗">油耗</el-radio>
          </template>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="centerDialogVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="centerDialogVisibleSure">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="机器学习"
      :visible.sync="delateDialogVisible"
      width="30%"
      style="width:50%;position:fixed;left:25%;"
      >
      <div style="border-bottom:1px solid #e5e5e5;padding:0 0 20px;height:30px;">
        <div style="width:75%;float:right;">
           <span  :key="i" v-for="(tag,i) in delateDialogList" :class="tag.state" @click="delateLabelClick(tag)" style="padding:5px 20px;border:1px solid #e5e5e5;border-radius:3px;margin:15px 5px;">{{tag.label}}</span>
        </div>
      </div>
      <div style="height:80px;" v-if="secendSelectShow">
        <div style="width:20%;float:left;line-height:50px;">
          <strong>原因</strong>
        </div>
        <div style="width:73%;float:right;padding:10px 0;">
          <el-select v-model="selectValue1"  @change="selectValue2Null">
            <el-option
              v-for="item in selectOptions1"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <p style="height:0px;"></p>
          <el-select v-model="selectValue2"  @change="selectValue1Null">
            <el-option
              v-for="item in selectOptions2"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        
        <el-button type="primary" @click="addMachineStudySure">确 定</el-button>
      </span>
    </el-dialog>
    <!-- <el-dialog
      :visible.sync="carouselDialogVisible"
      width="70%"
      center>
       <el-carousel height="400px" style="position:absolute;top:0;left:0;z-index:99999999;width:100%;">
         
        <el-carousel-item style="height:100%;">
          <div style="position:relative;top:-50px;height:130%;width:100%;">
            <img style="width:100%;height:100%;" :src="carouselSrc1" alt="">
          </div>
        </el-carousel-item>
        <el-carousel-item  style="height:100%;">
          <div style="position:relative;top:-50px;height:130%;width:100%;">
            <img style="width:100%;height:100%;" :src="carouselSrc2" alt="">
          </div>
        </el-carousel-item>
        <el-carousel-item  style="height:100%;">
          <div style="position:relative;top:-50px;height:130%;width:100%;">
            <img style="width:100%;height:100%;" :src="carouselSrc3" alt="">
          </div>
        </el-carousel-item>
        <el-carousel-item  style="height:100%;">
          <div style="position:relative;top:-50px;height:130%;width:100%;">
            <img style="width:100%;height:100%;" :src="carouselSrc4" alt="">
          </div>
        </el-carousel-item>
      </el-carousel>
    </el-dialog> -->

  </div>
</template>

<script>
import Sticky from '@/components/Sticky'; // 粘性header组件
import waves from '@/directive/waves.js'; // 水波纹指令
import BackToTop from '@/components/BackToTop';
import { getContentList, submitAllList, submitOneOperation, getBanurl, addManchineLabel, delateManchineLabel, blackList, grayList } from '@/api/content';
import store from '../../store';
import clip from '@/utils/clipboard' // use clipboard directly
import clipboard from '@/directive/clipboard/index.js'  // use clipboard by v-directive
// import carousel1 from './../img/carousel1.png'
// import carousel2 from './../img/carousel2.png'
// import carousel3 from './../img/carousel3.png'
// import carousel4 from './../img/carousel4.png'


export default {
  name: 'contentTemplate',
  components: { Sticky, BackToTop },
  directives: {
    waves,
    clipboard
  },
  data() {
    return {
      ManchineUserID: '',
      ManchinePID: '',
      // carouselSrc1: carousel1,
      // carouselSrc2: carousel2,
      // carouselSrc3: carousel3,
      // carouselSrc4: carousel4,
      carouselDialogVisible: true,   // / 轮播
       selectOptions1: [{
          value: '黑名单',
          label: '黑名单'
        }, {
          value: '灰名单',
          label: '灰名单'
        }],
        selectOptions2: [{
          value: '低俗',
          label: '低俗'
        }, {
          value: '广告',
          label: '广告'
        }, {
          value: '敏感',
          label: '敏感'
        }],
      defaultBlackName: [],                // 黑名单
      defaultGrayName: [],                 // 灰名单
      selectValue1: '灰名单',               // label原因默认值
      selectValue2: '低俗',               // label原因默认值
      secendSelectShow: false,         // 二级展示
      radio3: '',                     // label 单选
      secendLabelShow: false,         // 二级菜单
      centerDialogVisible: false,    // 机器学习
      delateDialogVisible: false,     // 机器学习
      delateDialogList: [{ label: '删除', state: 'clickFalse' }, { label: '不删除', state: 'clickFalse' }],   // 机器学习LIST
      pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近两周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 14);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 29);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      defaultDay: '',
      timeDayPick: this.getNowDay(),
      mainLoading: true,
      listViewOpen: false,
      list: [],
      total: null,
      banurl: null,
      banBtn: false,
      listLoading: true,
      massList: [],
      listQuery: {
        page: 1,
        limit: 50,
        seachCondition: null, //  查询种类 默认全部
        seachContent: null //  查询详情 默认全部
      },
      state: {
        currentState: 2,
        humanReview: 1,
        contentType: 0,
        indentifyType: 0,
        recognitionType: 0,
        colourdataType: 0,
        startTime: this.getNowDay() + ' 00:00:00',
        endTime: this.getNowDay() + ' 23:59:59'
      },
      seachCondition: '',
      seachContent: '',
      seachSel: [
        {
          value: 'PID',
          label: '帖子ID'
        },
        {
          value: 'SID',
          label: '主题ID'
        },
        {
          value: 'UID',
          label: '用户ID'
        }, {
          value: 'author',
          label: '用户名'
        },
        {
          value: 'PIP',
          label: '用户IP'
        },
        {
          value: 'content',
          label: '内容'
        }
      ],
      timeSel: [
        {
          value: '0000',
          label: '近2小时'
        },
        {
          value: '0024',
          label: '全天'
        },
        {
          value: '0002',
          label: '0点-2点'
        },
        {
          value: '0204',
          label: '2点-4点'
        },
        {
          value: '0406',
          label: '4点-6点'
        },
        {
          value: '0608',
          label: '6点-8点'
        },
        {
          value: '0810',
          label: '8点-10点'
        },
        {
          value: '1012',
          label: '10点-12点'
        },
        {
          value: '1214',
          label: '12点-14点'
        },
        {
          value: '1416',
          label: '14点-16点'
        },
        {
          value: '1618',
          label: '16点-18点'
        },
        {
          value: '1820',
          label: '18点-20点'
        },
        {
          value: '2022',
          label: '20点-22点'
        },
        {
          value: '2224',
          label: '22点-24点'
        }
      ],
      locationSel: [
        {
          label: '论坛、评论',
          options: [
            {
              value: '论坛',
              label: '论坛'
            },
            {
              value: '回帖',
              label: '回帖'
            },
            {
              value: '历史数据清洗',
              label: '历史数据清洗'
            }
          ]
        },
        {
          label: '问答',
          options: [
            {
              value: '提问',
              label: '提问'
            },
            {
              value: '答案',
              label: '答案'
            }
          ]
        },
        {
          label: '精华帖',
          options: [
            {
              value: '精华帖',
              label: '精华贴'
            }
          ]
        }
      ],
      myBackToTopStyle: {
        right: '50px',
        bottom: '50px',
        width: '40px',
        height: '40px',
        'border-radius': '4px',
        'line-height': '45px', // 请保持与高度一致以垂直居中
        background: '#e7eaf1' // 按钮的背景颜色
      }
    };
  },
  computed: {
    checkAll: {
      get() {
        return this.checkedCount === this.list.length;
      },
      set(value) {
        this.lists = this.list.map(item => {
          item.checked = value;
          return item;
        });
      }
    },
    checkedCount: {
      get() {
        return this.list.filter(item => item.checked).length;
      }
    }
  },
  created() {
    this.getList();
     const date = new Date();
     
      let month = date.getMonth();
      let strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = '0' + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate;
      }
      // console.log(date.getFullYear(), month, strDate)
      this.timeDayPick = [new Date(date.getFullYear(), month, strDate, '00', '00'), new Date(date.getFullYear(), month, strDate, '23', '59', 59)]
      this.defaultDay = this.timeDayPick
      if (sessionStorage.getItem('carousel') !== '1') {
        this.carouselDialogVisible = false;
      } else {
        sessionStorage.setItem('carousel', 2)
      }
      blackList().then(response => {
        this.defaultBlackName = response.data.classify
      })
      grayList().then(response => {
        this.defaultGrayName = response.data.classify
      })
  },
  methods: {
    selectValue2Null(val) {
      // if (val !== '') {
      //   this.selectValue2 = '';
      // }
      const _this = this;
      const i = this.selectValue1
      if (i === '黑名单') {
        this.selectOptions2 = this.defaultBlackName;
      } else {
        this.selectOptions2 = this.defaultGrayName;
      }
      this.selectValue2 = ''
    },
    selectValue1Null(val) {
      // if (val !== '') {
      //   this.selectValue1 = '';
      // }
    },
    getList() {
      this.listLoading = true;
      console.log(this.listQuery, this.state);
      getContentList(this.listQuery, this.state).then(response => {
        this.list = response.data.items;
        this.mainLoading = false;
        this.list = response.data.items.map(v => {
          let mainword = [];
          let maincontent = v.content;
          if (v.keyword != null && v.keyword !== '') {
            mainword = v.keyword.split('&');
            for (const word of mainword) {
              maincontent = maincontent.replace(
                new RegExp(word.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'), 'ig'),
                '<span style="color: red;font-weight: bold;background-color: yellow;">' +
                word +
                '</span>'
              );
            }
          }
          let username = v.username;
          for (const word of mainword) {
            if (word != null) {
              username = username.replace(
                new RegExp(word.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'), 'ig'),
                '<span style="color: red;font-weight: bold;background-color: yellow;">' +
                word +
                '</span>'
              );
            }
          }

          let title = v.title;
          for (const word of mainword) {
            if (word != null) {
              title = title.replace(
                new RegExp(word.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'), 'ig'),
                '<span style="color: red;font-weight: bold;background-color: yellow;">' +
                word +
                '</span>'
              );
            }
          }
          this.$set(v, 'title', title);

          this.$set(v, 'usernamereal', v.username);
          this.$set(v, 'username', username);
          this.$set(v, 'content', maincontent);
          if ((this.state.currentState === 2 || this.state.currentState === '2') && (this.state.humanReview === 1 || this.state.humanReview === '1')) {
            this.$set(v, 'checked', true);
          } else {
            this.$set(v, 'checked', false);
          }
          if (v.optinfo === 0) {
            this.$set(v, 'bgcolor', '#F0FFFF');
          } else if (v.optinfo === 1) {
            this.$set(v, 'bgcolor', '#CCE7CD');
          } else if (v.optinfo === 2) {
            this.$set(v, 'bgcolor', '#FFCCD5');
          } else if (v.optinfo === 3) {
            this.$set(v, 'bgcolor', '#D3D3D3');
          } else {
            this.$set(v, 'bgcolor', '#F0FFFF');
          }
          return v;
        });
        
        
        console.log(this.list);
        this.total = response.data.total;
        this.banurl = response.data.banurl;
        if (this.banurl === '' || this.banurl == null) {
          this.banBtn = true
        }
        this.listLoading = false;
        // 渲染完执行函数
        this.$nextTick(() => {
          this.mainLoading = false;
        })
      });
    },
    changeColor(item) {
      if (item.optinfo === 0) {
        item.bgcolor = '#F0FFFF';
      } else if (item.optinfo === 1) {
        item.bgcolor = '#CCE7CD';
      } else if (item.optinfo === 2) {
        item.bgcolor = '#FFCCD5';
      } else if (item.optinfo === 3) {
        item.bgcolor = '#D3D3D3';
      } else {
        item.bgcolor = '#F0FFFF';
      }
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      console.log('一页展示的条数变了，load一次list');
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      console.log('页数的条数变了，load一次list');
      this.getList();
    },
    passAllContent() {
      this.list.map(v => {
        this.$set(v, 'optinfo', 1);
        return v;
      });
    },
    deleteAllContent() {
      this.list.map(v => {
        this.$set(v, 'optinfo', 2);
        return v;
      });
    },
    ignoreAllContent() {
      this.list.map(v => {
        this.$set(v, 'optinfo', 3);
        return v;
      });
    },
    cancelAllContent() {
      this.list.map(v => {
        this.$set(v, 'optinfo', 0);
        return v;
      });
    },
    submitAllOperation() {
      this.massList = [];
      this.listLoading = true;
      this.list.map(v => {
        if (v.checked) {
          this.massList.push(v);
        }
        return v;
      });
      console.log(this.massList);
      this.submitor = store.state.user.name; // 获取操作者名字
      submitAllList(this.massList, this.submitor).then(response => {
        console.log(response);
        this.$notify({
          title: '成功',
          message: '批量提交成功',
          type: 'success',
          duration: 2000
        });
        const _this = this
        function code() {
          _this.getList()
        }
        setTimeout(code, 1200)
      });
    },
    submitOneOperation(row, index, opt) {
      this.submitor = store.state.user.name; // 获取操作者名字
      // row.push({ optsubmitor: this.submitor });
      // row.push({ optx: optx });
      row.optsubmitor = this.submitor;
      row.opt = opt;
      console.log(row);
      submitOneOperation(row).then(response => {
        this.list.splice(index, 1);
        console.log(response);
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success',
          duration: 2000
        });
      });
    },
    changeState(state) {
      if (state === 0) {
        this.state.currentState = 0;
        this.state.humanReview = 1;
        this.state.contentType = 0;
        this.state.indentifyType = 0;
        this.state.recognitionType = 0;
        this.state.colourdataType = 0;
      }
      if (state === 1) {
        this.state.currentState = 4;
        this.state.humanReview = 1;
        this.state.contentType = 0;
        this.state.indentifyType = 0;
        this.state.recognitionType = 0;
        this.state.colourdataType = 0;
      }
      if (state === 2) {
        this.state.currentState = 3;
        this.state.humanReview = 1;
        this.state.contentType = 0;
        this.state.indentifyType = 0;
        this.state.recognitionType = 0;
        this.state.colourdataType = 0;
      }
      if (state === 3) {
        this.state.currentState = 1;
        this.state.humanReview = 1;
        this.state.contentType = 0;
        this.state.indentifyType = 0;
        this.state.recognitionType = 0;
        this.state.colourdataType = 0;
      }
      if (state === 4) {
        this.state.currentState = 1;
        this.state.humanReview = 2;
        this.state.contentType = 0;
        this.state.indentifyType = 0;
        this.state.recognitionType = 0;
        this.state.colourdataType = 3;
      }
      if (state === 5) {
        this.state.currentState = 3;
        this.state.humanReview = 2;
        this.state.contentType = 0;
        this.state.indentifyType = 0;
        this.state.recognitionType = 0;
        this.state.colourdataType = 1;
      }
    },
    getYMDTime(date) {
      if (typeof date !== 'object') {
        console.log('不是日期对象');
        return null;
      }
      const seperator1 = '-';
      let month = date.getMonth() + 1;
      let strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = '0' + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate;
      }
      
      return date.getFullYear() + seperator1 + month + seperator1 + strDate;
    },
    getNowDay() {
      const date = new Date();
      const seperator1 = '-';
      let month = date.getMonth() + 1;
      let strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = '0' + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate;
      }
      console.log(date.getFullYear(), month, strDate)
      
      return date.getFullYear() + seperator1 + month + seperator1 + strDate;
    },
    dateChange(val) {
      const oTime = new Date().getTime()
      if (this.timeDayPick[1].getTime() - this.timeDayPick[0].getTime() > 2592010000) {
        this.$message({
          type: 'info',
          message: '选择时间要在一个月之内'
        })
        this.timeDayPick = this.defaultDay
        this.state.startTime = this.getNowDay() + ' 00:00:00'
        this.state.endTime = this.getNowDay() + ' 23:59:59'
      } else {
        const dateArr = val.split('至')
        this.state.startTime = dateArr[0];
        this.state.endTime = dateArr[1];
      }
      // this.state.timeDayPick = val
      // return this.state.timeDayPick = val;
    },
    clipboardSuccess() {
      this.$message({
        message: '复制成功',
        type: 'success',
        duration: 1500
      })
    },
    bannedAndSubmit() {
      this.massList = [];
      this.listLoading = true;
      this.list.map(v => {
        if (v.checked) {
          this.massList.push(v.usernamereal);
        }
        return v;
      });
      const list = this.massList;
      if (list.length === 0) {
        this.$notify({
          title: '警告',
          message: '未选取用户',
          type: 'warning',
          duration: 2000
        });
        this.listLoading = false;
        return
      }
      let url = '';
      getBanurl(list).then(response => {
        url = response.data.result
        window.open(url);
      })
      this.getList();
    },
    // label list delateOrNo
    delateLabelClick(val) {
      this.delateDialogList[0].state = 'clickFalse';
      this.delateDialogList[1].state = 'clickFalse';
      val.state = 'clickTrue';
      if (val.label === '删除') {
        this.secendSelectShow = true;
      } else {
        this.secendSelectShow = false;
      }
    },
    addMachineLabel(uid, pid) {
      this.secendLabelShow = false;
      this.centerDialogVisible = true;
      this.ManchineUserID = uid;
      this.ManchinePID = pid;
    },
    // 加入机器学习
    addMachineStudy(uid, pid) {
      this.delateDialogList[0].state = 'clickFalse';
      this.delateDialogList[1].state = 'clickFalse';
      this.delateDialogVisible = true;
      this.secendSelectShow = false;
      this.selectValue1 = '';
      this.selectValue2 = '';
      this.ManchineUserID = uid;
      this.ManchinePID = pid;
      this.radio3 = ''
    },
    addMachineStudySure() {
      if (this.delateDialogList[0].state === 'clickTrue') {
        this.delateDialogVisible = false;
        console.log(this.ManchinePID, this.ManchineUserID, this.selectValue1, '删除', this.selectValue2)
        if (this.selectValue2 !== '') {
           delateManchineLabel(this.ManchinePID, this.ManchineUserID, '删除', this.selectValue1, this.selectValue2).then(Response => {
            console.log(Rsponse)
          })
         } else {
          this.$message({
            message: '没有选择合适的选项',
            type: 'info'
          })
        }
      } else {
         delateManchineLabel(this.ManchinePID, this.ManchineUserID, '不删除', '').then(Response => {
          console.log(Rsponse)
        })
        this.delateDialogVisible = false;
      }
    },
    // 点击机器学习
    centerDialogVisibleSure() {
      this.centerDialogVisible = false;
      if (this.secendLabelShow) {
        if (this.radio3 !== '') {
          addManchineLabel(this.ManchinePID, this.ManchineUserID, '问答', this.radio3).then(response => {
                    console.log(Response)
                    this.$message({
                    message: 'success',
                    type: 'success'
                    })
                  })
        } else {
          this.$message({
            message: '没有选择合适的选项',
            type: 'info'
          })
        }
        // console.log(this.ManchinePID, this.ManchineUserID, '问答', this.radio3)
      } else {
        console.log(this.ManchinePID, this.ManchineUserID, '非问答', '')
        addManchineLabel(this.ManchinePID, this.ManchineUserID, '非问答', '').then(Response => {
          console.log(Response)
          this.$message({
          message: 'success',
          type: 'success'
          })
        })
      }
      this.radio3 = ''
  }
  },
  watch: {
    state: {
      handler() {
        console.log('监听')
        this.mainLoading = true;
        this.listQuery.page = 1;
        this.getList()
      },
      deep: true
    }
  }
};
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.main-container {
  border: 1px solid #d3dce6;
  margin: 80px;
  margin-top: 10px;
  background: #f3f3f3;
}

.detail-box {
  border: 1px solid #d3dce6; // background: #F0FFFF
}

.aTitle {
  color: #4682b4;
}

.aHref {
  color: #00bfff;
  text-decoration: underline;
}

.infoGrey {
  color: #808080;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.handleDialogLabel span{
  padding:3px 15px;
  border:1px solid #e5e5e5;
  margin: 5px;
  display: inline-block;
  cursor: pointer;
}
.clickTrue{
  background:#20a0ff;
  color: #ffffff;
  &:hover{
    color: #BAD8F8;
    cursor: pointer;
  }
}
.clickFalse{
  &:hover{
    color: #3A4C5F;
    cursor: pointer;
  }
}
.el-carousel__container{
  height:100%;
}
.handleDialogLabel{
  .el-radio{
    &:nth-of-type(1){
      margin-left:15px;
    }
  }
  
}
.el-dialog__titlt{
  padding-left:5px !important;
  border-left:3px solid #20a0ff !important;
  
}
</style>
