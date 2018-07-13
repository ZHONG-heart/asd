# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://doc.scrapy.org/en/latest/topics/items.html

import scrapy
from scrapy.loader import ItemLoader
from scrapy.loader.processors import MapCompose ,TakeFirst, Join


class MobilenewItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    CreateTime = scrapy.Field()
    Brand = scrapy.Field()
    Model = scrapy.Field()
    IssueDate = scrapy.Field()
    System = scrapy.Field()
    Keyboard = scrapy.Field()
    NetWorkType = scrapy.Field()
    Camera = scrapy.Field()
    MobileDesign = scrapy.Field()
    ScreenSize = scrapy.Field()
    Url = scrapy.Field()


class MobileItemLoader(ItemLoader):
    default_output_processor = TakeFirst()