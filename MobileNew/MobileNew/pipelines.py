# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://doc.scrapy.org/en/latest/topics/item-pipeline.html
import pymysql
import json


class MobilenewPipeline(object):
    def process_item(self, item, spider):
        return item


class MysqlPipeline(object):
    def __init__(self):
        self.conn = pymysql.connect(host="qdm168866545.my3w.com" ,port=3306,user="qdm168866545",password="zhong1023",database="qdm168866545_db" , charset='utf8')
        self.cursor = self.conn.cursor()

    def process_item(self,item,spider):
        insert_sql = """
            insert into Mobile(CreateTime,Brand,Model,IssueDate,System,Keyboard,NetWorkType,Camera,MobileDesign,ScreenSize,Url)
            values(\'%s\',\'%s\',\'%s\',\'%s\',\'%s\',\'%s\',\'%s\',\'%s\',\'%s\',\'%s\',\'%s\')
        """ % (item["CreateTime"],item["Brand"],item["Model"],item["IssueDate"],item["System"],item["Keyboard"],item["NetWorkType"],item["Camera"],item["MobileDesign"],item["ScreenSize"],item["Url"])
        print(insert_sql)
        self.cursor.execute(insert_sql)