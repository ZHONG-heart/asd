# coding=utf-8
import sys
reload(sys)
sys.setdefaultencoding('utf8')
article_type_mapping = dict(OS_LABEL_WZLX_ID_PK='id', WZLX='type_id', LXWZ='type_text', BWSX='classify_id',
                            FLWZ='classify_text', WZID='article_id', BWQZ='weight', WDWYMC='docs_unique_name',
                            CJSJ='create_time', ZHGXSJ='last_update_time', BLZD='extended')

check_rule_mapping = dict(OS_LABEL_JCGZ_ID_PK='id', SF='identity', WDID='doc_id', CWLX='error_type',
                          CWDJ='error_level', GZNR='rule_content', MS='desc', CJSJ='create_time',
                          ZHGXSJ='last_update_time', CJID='creator_id', XGID='modifier_id', ZT='status', KC='extended')

classify_category_group_mapping = dict(OS_LABEL_LBFZ_ID_PK='id', MC='name', MS='desc',
                                       ZT='status', CJSJ='create_time', ZHGXSJ='last_update_time', YL='extended')

classify_category_group_result_mapping = dict(OS_NLP_LBFZJG_ID_PK='id', RWID='task_id',
                                              FLLXZID='classify_type_group_id', MC='name',
                                              WYMC='unique_name', MS='desc', NR='content', JG='result', ZT='status',
                                              YHFK='user_feedback', CZID='operator_id', SHID='assessor_id',
                                              CZSJ='operator_time', SHSJ='finished_time', CJSJ='create_time',
                                              ZHGXSJ='last_update_time', KC='extended')

classify_mapping = dict(OS_LABEL_FL_ID_PK='id', FLLXZID='classify_type_group_id', BJZ='value', MC='name',
                        YS='color', MS='desc', ZT='status', CJSJ='create_time', ZHGXSJ='last_update_time',
                        KC='extended')

# 15start
article_paragraph_mapping = dict(
    OS_LABEL_WZDLB_ID_PK='id', YID='source_id', MBID='target_id', WZID='article_id', DLXH='number', DLNR='content',
    SFBT='is_title', CJ='level', DLKSWZ='paragraph_start', DLJSWZ='paragraph_end', DLZS='word_counts', ZT='status',
    SJGX='event_relations', ZHGXSJ='last_update_time', YL='extended')
yunju_extract_mapping = dict(OS_LABEL_YJCQ_ID_PK='id', YJID='corpus_id',
                             YJWB='corpus_text', JG='result', CJSJ='create_time', ZHGXSJ='last_update_time',
                             BLZD='extended')
stats_label_count_mapping = dict(OS_LABEL_BZBQJS_ID_PK='id', GXSJ='data_time', JRDCKBW='not_viewed_num',
                                 JRYSCBW='finished_generate_num', JRYBZBW='finished_label_num', KZZD='extended')
service_label_mapping = dict(OS_LABEL_YWBQB_ID_PK='id', WZID='article_id', JCBQID='base_label_id',
                             JCBQ='base_label_content',
                             YWBQNR='content', ST='status', CJSJ='create_time', ZHGXSJ='last_update_time',
                             BLZD='extended')
relation_label_mapping = dict(OS_LABEL_GXBQB='id', WZID='article_id', BQID1='base_label_id1',
                              BQID2='base_label_id2', BQGXZT='status', CJSJ='create_time', ZHGXSJ='last_update_time',
                              BLZD='extended', BQGXMCB='relation_mapping_id')
relation_mapping_mapping = dict(
    OS_LABEL_GXYS_ID_PK='id', GXMC='content', CJSJ='create_time', ZHGXSJ='last_update_time', BLZD='extended')
special_label_mapping = dict(OS_LABEL_ZTBQB_ID_PK='id', WZIDLB='article_id_list', DC='word',
                             ZT='status', CJSJ='create_time', ZHGXSJ='last_update_time', BLZD='extended')
dict_relation_mapping = dict(OS_LABEL_ZDGX_ID_PK='id', JZCID='paradigm_id', FJZCID='non_paradigm_id',
                             GXID='relation_id', ZT='status', CJSJ='create_time', ZHGXSJ='last_update_time',
                             YL='extended')

dict_mapping_mapping = dict(OS_LABEL_ZDYS_ID_PK='id', CDGXM='name', ZT='status',
                            SC='deletable', CJSJ='credit_time', ZHGXSJ='last_update_time', BLZD='extended')

dict_non_paradigm_mapping = dict(OS_LABEL_FJZC_ID_PK='id', FJZC='word',
                                 CJSJ='credit_time', ZHGXSJ='last_update_time', YL='extended')
dict_paradigm_mapping = dict(OS_LABEL_JZC_ID_PK='id', JZC='word',
                             CJSJ='credit_time', ZHGXSJ='last_update_time', YL='extended')
special_mind_mapping = dict(OS_LABEL_TB_ID_PK='id', JDGXZSID='mind_id', ZTBQMC='topic',
                            ZTBQFJDID='parent_id', PZBQXX='label_json', BWLBID='labeling_ids', CJ='level',
                            BWTJLY='reason', ZT='status', CJSJ='create_time', ZHGXSJ='last_update_time',
                            BLZD='extended')
paragraph_label_relation_mapping = dict(OS_LABEL_DLBQGX_ID_PK='id', WZID='article_id',
                                        DLID='paragraph_id', BQID='labeling_item_id', BQSX='label_type', QZBQ='weight',
                                        TSC='special', GX='relation', CJSJ='create_time', ZHGXSJ='last_update_time',
                                        BLZD='extended', ZT='status')

label_contrast_mapping = dict(OS_LABEL_BQDB_ID_PK='id', WZID='article_id', BZXX='labels', BQXX='tags',
                              BWMC='docs_unique_name', WDID='docs_id',
                              RWID='train_task_id', RWMZ='train_task_name', RWJS='train_task_desc', XLRWID='train_ids',
                              CJSJ='create_time', ZHGXSJ='last_update_time', YL='extended')

dict_rule_mapping = dict(OS_LABEL_ZDGZ_ID_PK='id', ZT='status', XC1='word1', XC2='word2',
                         GZMC='rule', CJSJ='create_time', ZHGXSJ='last_update_time', BLZD='extended')

word_vector_mapping = dict(OS_LABEL_CXL_ID_PK='id', CXLMC='words', CXLZ='vectors',
                           ZT='status', CJSJ='create_time', ZHGXSJ='last_update_time', BLZD='extended')

# 15end

docs_mapping = dict(OS_LABEL_WDMX_ID_PK='id', RWID='task_id', MC='name', WYMC='unique_name', CQJG='content',
                    HHWB='content_wrap', BQ='pre_tag', CJSJ='create_time', ZHGXSJ='last_update_time', ZT='status',
                    YLZD='extended')

docs_status_mapping = dict(OS_LABEL_WDZT_ID_PK='id', WDID='docs_id', RWLX='business_type',
                           ZT='status', SBYY='error_message', CJSJ='create_time', ZHGXSJ='last_update_time',
                           YLZD='extended')

docs_temp_mapping = dict(OS_LABEL_LSWD_ID_PK='id',
                         MC='name', WJCCMC='unique_name', WDLX='doc_type_id', RWLX='task_type_id', WDCQJG='result',
                         CJSJ='create_time', ZHGXSJ='last_update_time', ZT='status', YL='extended')

label_contrast_mapping = dict(OS_LABEL_BQDB_ID_PK='id', WZID='article_id', BZXX='labels', BQXX='tags',
                              BWMC='docs_unique_name', WDID='docs_id',
                              RWID='train_task_id', RWMZ='train_task_name', RWJS='train_task_desc', XLRWID='train_ids',
                              CJSJ='create_time', ZHGXSJ='last_update_time', YL='extended')

labeling_item_mapping = dict(OS_LABEL_BQXM_ID_PK='id', BZID='labeling_id', BZLXID='tag_id', DC='word',
                             XB='index', CX='order', FLID='classify_id', CJSJ='create_time', ZHGXSJ='last_update_time',
                             ZT='status', YL='extended')

labeling_mapping = dict(OS_LABEL_BQ_ID_PK='id', WDID='doc_id', RWID='task_id',
                        BZYID='operator_id', SHYID='assessor_id', ZT='status', YL='extended', CJSJ='create_time',
                        WCBZSJ='finished_time', WCPSSJ='assessed_time', ZHGXSJ='last_update_time')

role_mapping = dict(OS_LABEL_JS_ID_PK='role_id',
                    ZYSJ='source_name', JSMC='role_name', MS='desc', ZT='status')
role_permission_check_mapping = dict(OS_LABEL_QXYZ_ID_PK='id', JSID='role_id', ZYZID='resource_group_id',
                                     ZYZMC='resource_group_name', ZYZBM='resource_group_alias', ZYID='resource_id',
                                     ZYM='resource_name', ZYBM='resource_alias', ZT='status', YL='extended',
                                     CJSJ='create_time', ZHGXSJ='last_update_time')
role_resource_con_mapping = dict(
    OS_LABEL_JSZY_ID_PK='id', JSID='role_id', ZYID='resource_id', QX='auth', ZT='status')
tag_type_mapping = dict(OS_LABEL_BQLX_ID_PK='id', MC='name', MS='desc',
                        YL='extended', CJSJ='create_time', ZHGXSJ='last_update_time', ZT='status')
tags_mapping = dict(OS_LABEL_BQMX_ID_PK='id', BQLXID='tag_type_id',
                    MC='name', MS='desc', SJLX='data_type', YS='color', XB='index', ZT='status', YL='extended',
                    CJSJ='create_time', ZHGXSJ='last_update_time')

tasks_mapping = dict(OS_LABEL_RW_ID_PK='id', BQLXID='tag_type_id', RWLX='task_type', FPFS='assign_mode',
                     RWMC='task_name',
                     CJZID='creator_id', GCID='project_id', YL='extended', MS='desc', ZT='status', CJSJ='create_time',
                     ZHGXSJ='last_update_time')

train_evaluate_mapping = dict(OS_LABEL_XLPG_ID_PK='id', PGLX='evaluate_type',
                              XLRWID='train_id', RWLB='tasks', MXXX='model_info', PGJG='result', PGSBYY='error_message',
                              BLZD='extend', PGZT='status', CJSJ='create_time', ZHGXSJ='last_update_time', XLMC='name',
                              XLMS='description')

train_field_state_mapping = dict(OS_LABEL_XLZDZT_ID_PK='id', XLID='train_id', ZDID='field_id',
                                 ZT='status', BLZD='extend', CJSJ='create_time', ZHGXSJ='last_update_time')

train_mapping = dict(OS_LABEL_XL_ID_PK='id', RWIDLB='task_ids', BQLXID='tag_type_id',
                     MXLJ='model_paths', CWXX='error_message', CSJG='test_result', BB='version', MXXX='model_info',
                     ZT='status', CJSJ='create_time', ZHGXSJ='last_update_time')
train_state_mapping = dict(OS_LABEL_XLZT_ID_PK='id',
                           XLID='train_id', WBQNR='content', BQ='tag')
train_task_mapping = dict(OS_LABEL_XLRW_ID_PK='id',
                          XLRWMC='name', XLRWMS='description', BZBQLX='tag_type_id', ZT='status', XLID='train_id',
                          CJSJ='create_time', ZHGXSJ='last_update_time')

user_role_con_mapping = dict(
    OS_LABEL_YHJS_ID_PK='id', JSID='role_id', YHID='user_id', ZT='status')

users_mapping = dict(OS_LABEL_YH_ID_PK='userid', YHNC='nickname', DLZHM='username',
                     YHMM='password', YL='extended', CJSJ='create_time', ZHGXSJ='last_update_time', ZT='status')

labelingModelMapping = dict(OS_LABEL_BQ_ID_PK='id', WDID='doc_id', RWID='task_id', BZYID='operator_id',
                                   SHYID='assessor_id', ZT='status', CJSJ='create_time', YL='extended',
                                   WCBZSJ='finished_time', WCPSSJ='assessed_time', ZHGXSJ='last_update_time')
default_data = [
    dict(
        field_mapping=labelingModelMapping,
        old_table='labeling',
        new_table='OS_LABEL_BQ',
    ),
    dict(
        field_mapping=users_mapping,
        old_table='users',
        new_table='OS_LABEL_YH'
    ),
    dict(
        field_mapping=user_role_con_mapping,
        old_table='user_role_con',
        new_table='OS_LABEL_YHJS'
    ),
    dict(
        field_mapping=train_task_mapping,
        old_table='train_task',
        new_table='OS_LABEL_XLRW'
    ),
    dict(
        field_mapping=train_state_mapping,
        old_table='train_state',
        new_table='OS_LABEL_XLZT'
    ),
    dict(
        field_mapping=train_mapping,
        old_table='train',
        new_table='OS_LABEL_XL'
    ),
    dict(
        field_mapping=train_field_state_mapping,
        old_table='train_field_state',
        new_table='OS_LABEL_XLZDZT'
    ),
    dict(
        field_mapping=train_evaluate_mapping,
        old_table='train_evaluate',
        new_table='OS_LABEL_XLPG'
    ),
    dict(
        field_mapping=tasks_mapping,
        old_table='tasks',
        new_table='OS_LABEL_RW'
    ),
    dict(
        field_mapping=tag_type_mapping,
        old_table='tag_type',
        new_table='OS_LABEL_BQLX'
    ),
    dict(
        field_mapping=role_resource_con_mapping,
        old_table='role_resource_con',
        new_table='OS_LABEL_JSZY'
    ),
    dict(
        field_mapping=role_permission_check_mapping,
        old_table='role_permission_check',
        new_table='OS_LABEL_QXYZ'
    ),
    dict(
        field_mapping=role_mapping,
        old_table='role',
        new_table='OS_LABEL_JS'
    ),
    dict(
        field_mapping=labeling_mapping,
        old_table='labeling',
        new_table='OS_LABEL_BQ'
    ),
    dict(
        field_mapping=labeling_item_mapping,
        old_table='labeling_item',
        new_table='OS_LABEL_BQXM'
    ),
    dict(
        field_mapping=label_contrast_mapping,
        old_table='label_contrast',
        new_table='OS_LABEL_BQDB'
    ),
    dict(
        field_mapping=docs_temp_mapping,
        old_table='docs_temp',
        new_table='OS_LABEL_LSWD'
    ),
    dict(
        field_mapping=docs_status_mapping,
        old_table='docs_status',
        new_table='OS_LABEL_WDZT'
    ),
    dict(
        field_mapping=docs_mapping,
        old_table='docs',
        new_table='OS_LABEL_WDMX'
    ),
    dict(
        field_mapping=word_vector_mapping,
        old_table='word_vector',
        new_table='OS_LABEL_CXL'
    ),
    dict(
        field_mapping=dict_rule_mapping,
        old_table='dict_rule',
        new_table='OS_LABEL_ZDGZ'
    ),
    dict(
        field_mapping=label_contrast_mapping,
        old_table='label_contrast',
        new_table='OS_LABEL_BQDB'
    ),
    dict(
        field_mapping=paragraph_label_relation_mapping,
        old_table='paragraph_label_relation',
        new_table='OS_LABEL_DLBQGX'
    ),
    dict(
        field_mapping=special_mind_mapping,
        old_table='special_mind',
        new_table='OS_LABEL_TB'
    ),
    dict(
        field_mapping=dict_paradigm_mapping,
        old_table='dict_paradigm',
        new_table='OS_LABEL_JZC'
    ),
    dict(
        field_mapping=dict_non_paradigm_mapping,
        old_table='dict_non_paradigm',
        new_table='OS_LABEL_FJZC'
    ),
    dict(
        field_mapping=dict_mapping_mapping,
        old_table='dict_mapping',
        new_table='OS_LABEL_ZDYS'
    ),
    dict(
        field_mapping=dict_relation_mapping,
        old_table='dict_relation',
        new_table='OS_LABEL_ZDGX'
    ),
    dict(
        field_mapping=special_label_mapping,
        old_table='special_label',
        new_table='OS_LABEL_ZTBQB'
    ),
    dict(
        field_mapping=relation_mapping_mapping,
        old_table='relation_mapping',
        new_table='OS_LABEL_GXYS'
    ),
    dict(
        field_mapping=relation_label_mapping,
        old_table='relation_label',
        new_table='OS_LABEL_GXBQB'
    ),
    dict(
        field_mapping=service_label_mapping,
        old_table='service_label',
        new_table='OS_LABEL_YWBQB'
    ),
    dict(
        field_mapping=stats_label_count_mapping,
        old_table='stats_label_count',
        new_table='OS_LABEL_BZBQJS'
    ),
    dict(
        field_mapping=classify_mapping,
        old_table='classify',
        new_table='OS_LABEL_FL'
    ),
    dict(
        field_mapping=article_paragraph_mapping,
        old_table='article_paragraph',
        new_table='OS_LABEL_WZDLB'
    ),
    dict(
        field_mapping=article_type_mapping,
        old_table='article_type',
        new_table='OS_LABEL_WZLX'
    ),
    dict(
        field_mapping=check_rule_mapping,
        old_table='check_rule',
        new_table='OS_LABEL_JCGZ'
    ),
    dict(
        field_mapping=classify_category_group_mapping,
        old_table='classify_category_group',
        new_table='OS_LABEL_LBFZ'
    ),
    dict(
        field_mapping=classify_category_group_result_mapping,
        old_table='classify_category_group_result',
        new_table='OS_LABEL_LBFZJG'
    )
]

from transfer_db import TransferDB

for item in default_data:
    TransferDB(item['field_mapping'], item['old_table'], item['new_table'])
