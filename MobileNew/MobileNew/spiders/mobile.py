import scrapy
import re
from urllib import parse
from scrapy.http import Request
from MobileNew.items import MobileItemLoader,MobilenewItem
import os
# import urllib2
import requests
import datetime
class MobileSpider(scrapy.Spider):
    name = "mobile"
    allowed_domains = ["shouji.tenaa.com.cn"]
    start_urls = ["http://shouji.tenaa.com.cn/Mobile/MobileNew.aspx"]


    def parse(self, response):
        parse_url = []
        gsmUrl = response.css("table#tblGSM a::attr(href)").extract()

        cdmaUrl = response.css("table#tblCDMA a::attr(href)").extract()

        g3Url = response.css("table#tblTD a::attr(href)").extract()

        g4Url = response.css("table#tblG4 a::attr(href)").extract()
        parse_url = gsmUrl + cdmaUrl + g3Url + g4Url
        parse_url = set(parse_url)

        for url in parse_url:
            newUrl = parse.urljoin(response.url,url)
            yield Request(url=newUrl,callback=self.parse_detail,meta={"postUrl":newUrl})

    def parse_detail(self,response):
        # mobileItem = MobileItemLoader(item=MobilenewItem(),response=response)
        IssueDate = response.css("table#tblMsg td::text").extract()
        issueDate = IssueDate[len(IssueDate)-1]
        ScreenSize = response.css("table#tblParameter tr:nth-of-type(11) td:nth-of-type(2)::text").extract_first("")
        match_obj = re.match(".*屏幕尺寸:(.*)\(英寸.*",ScreenSize)
        if match_obj:
            ScreenSize=match_obj.group(1)
        else:
            print("正则Error")
        # mobileItem.add_value("Url",response.url)
        # mobileItem.add_css("Brand","#lblPP::text")
        # mobileItem.add_css("Model","#lblXH::text")
        # mobileItem.add_value("IssueDate",issueDate[5:])
        # mobileItem.add_css("System","table#tblSenior tr:nth-of-type(4) td:nth-of-type(2)")
        # mobileItem.add_css("Keyboard","table#tblBasis tr:last-child td:nth-of-type(2)")
        # mobileItem.add_css("NetWorkType","table#tblParameter tr:nth-of-type(9) td:nth-of-type(2)")
        # mobileItem.add_css("Camera","table#tblSenior tr:nth-of-type(7) td:nth-of-type(2)")
        # mobile_item_data = mobileItem.load_item()
        # yield mobile_item_data

        mobileItem = MobilenewItem()
        mobileItem["Url"] = response.url
        mobileItem["Brand"] = response.css("#lblPP::text").extract_first("")
        mobileItem["Model"] = response.css("#lblXH::text").extract_first("")
        mobileItem["IssueDate"] = issueDate[5:]
        mobileItem["System"] = response.css("table#tblSenior tr:nth-of-type(4) td:nth-of-type(2)::text").extract_first("")
        mobileItem["Keyboard"] = response.css("table#tblBasis tr:last-child td:nth-of-type(2)::text").extract_first("")
        mobileItem["NetWorkType"] = response.css("table#tblParameter tr:nth-of-type(9) td:nth-of-type(2)::text").extract_first("")
        mobileItem["Camera"] = response.css("table#tblSenior tr:nth-of-type(7) td:nth-of-type(2)::text").extract_first("")
        mobileItem["MobileDesign"] = response.css("table#tblParameter tr:nth-of-type(13) td:nth-of-type(2)::text").extract_first("")
        mobileItem["ScreenSize"] = ScreenSize
        mobileItem["CreateTime"] = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        #下载图片
        imgUrl = response.css("table#tblPicMore a::attr(href)").extract()
        for newImgUrl in imgUrl:
            newUrl = parse.urljoin(response.url, newImgUrl)
            yield Request(url=newUrl, callback=self.download_img, meta={"FileName":mobileItem["Model"]})
        yield mobileItem

    def download_img(self,response):
        #图片相对地址
        url = response.css("#img_Big::attr(src)").extract_first("")
        #应保存的文件名字
        filePath = response.meta.get("FileName","")
        #拼接后的url地址
        postUrl = parse.urljoin(response.url,url)
        #请求图片地址
        res = requests.get(postUrl)

        #拼接图片本地存储地址
        path = "images/"+filePath + "/"
        #判断地址是否存在
        isExists = os.path.exists(path)
        #地址存在就忽略，否则创建新文件夹
        if not isExists:
            os.makedirs(path)
            print("创建文件夹")
        else:
            print("已创建")
        #截取字符串作为保存的文件名字
        SaveFileName = url.split("/")
        SaveFileName = SaveFileName[len(SaveFileName)-1]
        #保存文件
        with open(path + SaveFileName,"wb") as fd:
            fd.write(res.content)
