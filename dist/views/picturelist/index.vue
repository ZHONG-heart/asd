<template>
  <div id="pictureList">
    <div id="handleUpImg">
      <div id="handleUpImgTitle">
        <div id="handleUpImgLeft">
          <p>上传图片</p>
        </div>
        <div id="handleUpImgRight">
          
        </div>
      </div>
      <div id="handleUpImgContent">
        <!-- action="https://jsonplaceholder.typicode.com/posts/" -->
        <el-upload
          action="blacklist/banned/upload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :before-upload="beforeAvatarUpload"
          :on-success="handleSuccessUpload"
          multiple="true">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" size="tiny">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </div>
    </div>
    <div id="historyUpload">
      <p>历史上传记录</p>
      <div class="historyImgList">
        <!-- <p>{{item.date}}</p> -->
        <div class="historyImgShow">
          <div class="historyDelate" v-for="(image,i) in list" :key="i">
            <img :src="`pic/${image.fileName}`" :key="i" :alt="image.upTime" @click="imageShow(`pic/${image.fileName}`)" :title="image.upTime">
            <el-button class="pictureButton" @click="delateImage(image.fileName)" style="position:absolute;bottom:15px;" type="danger" round size="mini">点击删除</el-button>
          </div>
        </div>
      </div>
    </div>
     <el-pagination
     style="padding-left"
          background
          layout="prev, pager, next, sizes,total"
          :total="total"
          :current-page.sync="paging.page"
          
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :page-size="paging.limit"
          :page-sizes="[10,20,30]"
          > 
      </el-pagination>
      <div v-if="imageShowTrueOrFalse" style="position:fixed;left:0%;top:0%;width:100%;height:100%;">
        <div style="width:50%;height:60%;margin:10% auto;overflow:auto;">
          <img :src="imageUrl" alt="" style="width:100%;">
        </div>
      </div>
      
  </div>
</template>
<script>
import { PictureList, delateImage } from '@/api/picturelist'
export default {
  name: 'pictureList',
  data() {
    return {
      imageUrl: '',
      dialogImageUrl: '',
      dialogVisible: false,
      list: [],
      paging: {
        limit: 10,
        page: 1

      },
      total: '1000',
      imageShowTrueOrFalse: false
    }
  },
  created() {
    this.getList();
  },
  mounted() {
    const _this = this
    document.addEventListener('click', e => {
      console.log(e.target)
      setTimeout(() => {
         if (_this.imageShowTrueOrFalse === true) {
          _this.imageShowTrueOrFalse = false
        }
      }, 100)
    })
  },
  methods: {
      handleSuccessUpload() {
        this.getList()
      },
     handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      /** **************************************分页 页数改变************************/
    handleCurrentChange(val) {
      console.log(val)
      this.paging.page = val;
      this.getList();
    },
    /** **********************************每页加载多少条数据************************/
    handleSizeChange(val) {
      console.log(val)
      this.paging.limit = val;
      this.getList();
    },
      getList() {
        PictureList(this.paging).then(Response => {
          console.log(Response)
          console.log(Response)
          this.list = Response.data.pictures
          this.total = Response.data.total
        })
      },
      delateImage(id) {
        console.log(id)
        delateImage(id).then(response => {
          this.$message({
             type: 'warning',
             message: '删除成功！'
          })
          this.getList()
        })
      },
      beforeAvatarUpload(file) {
        console.log(file)
            const isJPG = file.type === 'image/jpeg';
            const isGIF = file.type === 'image/gif';
            const isPNG = file.type === 'image/png';
            const isBMP = file.type === 'image/bmp';
            const isLt10M = file.size / 1024 / 1024 < 10;
             if (!isJPG && !isGIF && !isPNG && !isBMP) {
               this.$message.error('上传头像图片只能是 JPG/gif/png/bmp 格式!');
             }
             if (!isLt10M) {
               this.$message.error('上传图片大小不能超过10M');
             }
             return (isJPG || isBMP || isGIF || isPNG) && isLt10M;
      },
      imageShow(url) {
        this.imageUrl = url;
        console.log(url)
        const _this = this;
        setTimeout(() => {
          _this.imageShowTrueOrFalse = true;
        }, 150)
      }
  }
}
</script>
<style scoped="">
  #handleUpImg{
    height:250px;
    padding: 10px 20px 20px;
  }
  #handleUpImgTitle{
    height: 50px;
  }
  #handleUpImgLeft{
    float: left;
  }
  #handleUpImgLeft p{
    font-size: 16px;
  }
  #handleUpImgContent{
    clear: both;
    height: 200px;
    border-bottom: 1px solid #BFD5ED;
  }
  #historyUpload{
    padding: 0 20px;
  }
  .historyImgShow{
    display:flex;
    flex-wrap: wrap;
    border-bottom: 1px solid #BFD5ED;
    padding:0 0 20px;

  }
  .historyImgShow img{
    width:178px;
    height: 188px;
    margin-right: 30px;
    margin-bottom: 10px;
    border-radius:5px;
    filter: grayscale(30%);
  }
   .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .historyDelate{
    display: inline;
    position: relative;
  }
  .historyDelate:hover .el-button{
    display: block;
  }
  .el-button{
    display:none;
  }
</style>
