#!/bin/bash
# مزامنة الموقع: نسخ الملف المرجعي الوحيد download/dameen.html إلى public/
# يُشغَّل بعد كل تعديل على التطبيق ليظهر فوراً على الموقع
set -e
SRC="/home/z/my-project/download/dameen.html"
DST="/home/z/my-project/public/dameen.html"
cp "$SRC" "$DST"
echo "تمت المزامنة: $(stat -c%s "$DST") بايت — $(date '+%Y-%m-%d %H:%M:%S')"
