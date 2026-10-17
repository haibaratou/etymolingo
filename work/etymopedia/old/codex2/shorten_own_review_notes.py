"""Shorten only this chat's own batch 028 review notes, keeping defects."""
import csv
from pathlib import Path
import illustration_csv

path = Path(__file__).resolve().parent / 'prompt_rows_028.csv'
with path.open(encoding='utf-8-sig', newline='') as stream:
    rows = list(csv.DictReader(stream))
count = 0
for index, row in enumerate(rows[:33], 1):
    if index == 25:
        note = '生成サービスの安全ブロックで未生成。request_id=a53284e9-4e20-4e75-bb64-f5a022447a01。'
    elif index == 7:
        note = '余分なパン棚あり。修正版の上書き指示待ち。'
    elif index == 13:
        note = '指定の人物全身が描かれていない。要修正。'
    elif index >= 31:
        note = '実画像・第一語義・日英解説を照合。3背景512px検品の最終確認待ち。'
    else:
        note = '実画像・第一語義・日英解説を照合。白/紺/桃背景512px検品。'
    if row['検品メモ'] != note:
        illustration_csv.update_row('028', index, {'検品メモ': note})
        count += 1
print(count)
