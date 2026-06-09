#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
从 docx 文件中提取图片到指定目录
使用方法: python extract_images.py
"""

import zipfile
import os

# 配置
docx_path = r'./端午节攻略/2026端午广州龙舟珠海三日图文攻略(1).docx'
extract_dir = r'./images/from-docx'

def extract_images():
    if not os.path.exists(docx_path):
        print('错误: 找不到文件 {}'.format(docx_path))
        return

    # 确保目标目录存在
    if not os.path.exists(extract_dir):
        os.makedirs(extract_dir)
        print('创建目录: {}'.format(extract_dir))

    extracted = []
    with zipfile.ZipFile(docx_path, 'r') as z:
        for name in z.namelist():
            # 只处理 word/media/ 下的文件，跳过目录本身
            if name.startswith('word/media/') and not name.endswith('/'):
                filename = os.path.basename(name)
                target = os.path.join(extract_dir, filename)
                # 直接写入文件
                with open(target, 'wb') as f:
                    f.write(z.read(name))
                extracted.append(filename)
                print('已提取: {}'.format(filename))

    print('\n共提取 {} 个图片文件到: {}'.format(len(extracted), extract_dir))
    if extracted:
        print('文件列表: {}'.format(', '.join(extracted)))

if __name__ == '__main__':
    extract_images()