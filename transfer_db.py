# coding=utf-8
# author: zhong
import pymysql
from collections import OrderedDict
import os
import dmPython
import sys

reload(sys)
sys.setdefaultencoding('utf8')
labelingModelMapping = OrderedDict(OS_LABEL_BQ_ID_PK='id', WDID='doc_id', RWID='task_id', BZYID='operator_id',
                                   SHYID='assessor_id', ZT='status', CJSJ='create_time', YL='extended',
                                   WCBZSJ='finished_time', WCPSSJ='assessed_time', ZHGXSJ='last_update_time')
TABLE_MAPPING = {"labeling": "OS_LABEL_BQ"}

default_data = [
    dict(
        field_mapping=labelingModelMapping
    )
]


class TransferDB(object):
    dm_conn = dmPython.connect(user='SYSDBA', password='SYSDBA', server='100.100.25.21', port='5235', local_code=1)
    dm_cursor = dm_conn.cursor()

    sql_conn = pymysql.connect(host='mysql', user='root', password='root', database='contract', port=3306,
                               charset='utf8')
    sql_cursor = sql_conn.cursor()

    def __init__(self, order_dict={}, old_table='', new_table=''):

        self.order_dict = order_dict
        self.old_table = old_table
        self.new_table = new_table
        self.dict_items = self.order_dict.items()
        self.rows = None
        self.query_data()

    def query_data(self):
        sql = "SELECT {} from {}".format(
            ",".join(map(lambda item: '{}.{}'.format(self.old_table, item[1]), self.dict_items)), self.old_table)
        print sql
        self.sql_cursor.execute(sql)
        self.rows = self.sql_cursor.fetchall()
        self.transfer_data()

    def transfer_data(self):
        identity_insert = "SET IDENTITY_INSERT {} ON".format(self.new_table)
        self.dm_cursor.execute(identity_insert)
        i = 0
        init_sql = "INSERT INTO {} ({}) VALUES ".format(self.new_table,
                                                        ",".join(map(lambda item: item[0], self.dict_items)))
        insert_sql = ''
        for row in self.rows:
            i += 1
            if not insert_sql:
                insert_sql = init_sql
            insert_sql += "( {} ),".format(
                ",".join(map(lambda item: self.sql_param_convert(str(item)), row)))
            # if i % 10 == 0:
            #     print insert_sql
            #     try:
            #         self.dm_cursor.execute(insert_sql[0:-1])
            #         self.dm_conn.commit()
            #     except Exception as e:
            #         print "insert SQL error: {}".format(str(e))
            #     insert_sql = ''
            try:
                print insert_sql
                self.dm_cursor.execute(insert_sql[0:-1])
                self.dm_conn.commit()
            except Exception as e:
                print "insert SQL error: {}".format(str(e))
            finally:
                insert_sql = ''

    @staticmethod
    def sql_param_convert(item):
        if item == "None":
            return "Null"
        return "'{}'".format(item)
