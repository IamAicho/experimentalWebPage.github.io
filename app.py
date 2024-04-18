import sys

# 設定標準輸出編碼為 UTF-8
sys.stdout.reconfigure(encoding="utf-8")

from flask import Flask, render_template, request, jsonify
import pymysql
import json
from datetime import datetime

# 創建Flask物件app並初始化
app = Flask(__name__)


# 通過python裝飾器的方法定義路由地址
@app.route("/")
# 定義方法 **用jinjia2引擎來渲染頁面**，并回傳一個index.html頁面
# Flask在程序文件夾中的templates子文件夹中尋找模板。
def root():
    return render_template("index.html")


@app.route("/searchDataPage")
def searchDataPage():
    return render_template("searchDataPage.html")


# app的路由地址"/searchDB"即為ajax中定義的url地址，采用POST、GET方法均可提交
@app.route("/searchDB", methods=["POST", "GET"])
def searchDB():
    try:
        connect_server = pymysql.connect(
            host="localhost",
            port=3306,
            user="root",
            passwd="0989982912",
            charset="utf8",
        )
        with connect_server.cursor() as cursor:
            cursor.execute("SHOW DATABASES")
            all_databases = cursor.fetchall()  # 獲取所有資料庫名稱

            # 使用filter來選出含有 "db_jy901" 的資料庫名稱
            db_names = [db[0] for db in all_databases if "db_jy901" in db[0]]
            print(db_names)
            # 將資料庫名稱轉換為JSON格式
            json_db_names = json.dumps({"databases": db_names})
            return json_db_names  # 回傳JSON格式的資料庫名稱

    except pymysql.Error as e:
        return f"Error: {e}"
    finally:
        cursor.close()
        connect_server.close()  # 確保連接被關閉


# app的路由地址"/putData"即為ajax中定義的url地址，采用POST、GET方法均可提交
@app.route("/putData", methods=["POST", "GET"])
def putData():
    # 從前端拿數據：由于POST、GET獲取資料的方式不同，需要使用if陳述句進行判斷
    if request.method == "POST":
        db_user = request.form.get("db_user")
        dateInput = request.form.get("dateInput")
        putData = request.form.get("putData")
        putPoint = request.form.get("putPoint")
        putCoverEar = request.form.get("putCoverEar")
        putHZ = request.form.get("putHZ")
    if request.method == "GET":
        db_user = request.args.get("db_user")
        dateInput = request.args.get("dateInput")
        putData = request.args.get("putData")
        putPoint = request.args.get("putPoint")
        putCoverEar = request.args.get("putCoverEar")
        putHZ = request.args.get("putHZ")
    print(db_user)
    print(dateInput)
    # 將日期字串轉換為datetime物件
    date_obj = datetime.strptime(dateInput, "%Y-%m-%d")
    # 取得月份和日期，並格式化成"tableMMDD"的字串格式
    formatted_date = date_obj.strftime("table%m%d")
    print(formatted_date)  # 印出轉換後的字串

    # 解析 JSON 字符串為 Python 中的數據結構
    matrix_data = json.loads(putData)
    matrix_point = json.loads(putPoint)

    print(putCoverEar)
    print(putHZ)

    try:
        connect_server = pymysql.connect(
            host="localhost",
            port=3306,
            user="root",
            passwd="0989982912",
            charset="utf8",
        )
        with connect_server.cursor() as cursor:
            # 列出資料庫中所有的資料表
            cursor.execute(f"SHOW TABLES IN `{db_user}`")
            tables = cursor.fetchall()
            # 將資料表名稱轉換成list
            existing_tables = [table[0] for table in tables]

            n = 1
            new_table_name = f"{formatted_date}_{n}"
            while new_table_name in existing_tables:
                n += 1
                new_table_name = f"{formatted_date}_{n}"

            cursor.execute(
                f"CREATE TABLE `{db_user}`.`{new_table_name}` (len INT AUTO_INCREMENT PRIMARY KEY)"
            )
            # 新增欄位
            cursor.execute(f"ALTER TABLE `{db_user}`.`{new_table_name}` ADD time FLOAT")
            cursor.execute(f"ALTER TABLE `{db_user}`.`{new_table_name}` ADD x_axis FLOAT")
            cursor.execute(f"ALTER TABLE `{db_user}`.`{new_table_name}` ADD z_axis FLOAT")
            connect_server.commit()

            # 將 data 放進 table
            sql_insert = f"""
            INSERT INTO `{db_user}`.`{new_table_name}`
            (`len`,`time`,`x_axis`,`z_axis`)
            VALUES
            (%s,%s,%s,%s)
            """
            for row1 in matrix_data:
                r = ", ".join(map(str, row1))  # 轉換每一行為字符串
                array_r = json.loads("[" + r + "]")
                val = (array_r[0], array_r[1], array_r[2], array_r[3])
                cursor.execute(sql_insert, val)
            connect_server.commit()

            # 找到對應的 len 並將 point 的值放進去
            # 新增欄位
            cursor.execute(
                f"ALTER TABLE `{db_user}`.`{new_table_name}` ADD point VARCHAR(255)"
            )
            # 選擇資料庫
            cursor.execute(f"USE `{db_user}`")
            # 根據傳入的 matrix_point 進行資料更新
            for len_val, point_val in matrix_point:
                sql_update = f"UPDATE `{new_table_name}` SET point = '{point_val}' WHERE len = {len_val}"
                cursor.execute(sql_update)

            # 將遮蔽耳和側聽頻率的資料放進第一和第二個的 point 欄位裡面
            cursor.execute(f"UPDATE `{new_table_name}` SET point = '{putCoverEar}' WHERE len = 1")
            cursor.execute(f"UPDATE `{new_table_name}` SET point = '{putHZ}' WHERE len = 2")
            connect_server.commit()



        return {"message": "Success!!", "tableName": new_table_name}
    except pymysql.Error as e:
        return f"Error: {e}"
    finally:
        cursor.close()
        connect_server.close()  # 確保連接被關閉


# ----------------------- searchDataPage -----------------------
@app.route("/searchTable", methods=["POST", "GET"])
def searchTable():
    if request.method == "POST":
        selected_db = request.form.get("db_user")
    if request.method == "GET":
        selected_db = request.args.get("db_user")

    try:
        connect_server = pymysql.connect(
            host="localhost",
            port=3306,
            user="root",
            passwd="0989982912",
            charset="utf8",
            database=selected_db,
        )
        with connect_server.cursor() as cursor:
            cursor.execute("SHOW TABLES")
            all_tables = cursor.fetchall()  # 獲取所有資料表名稱
            table_names = [table[0] for table in all_tables]
            print(table_names)
            json_table_names = json.dumps({"tables": table_names})
            return json_table_names

    except pymysql.Error as e:
        return f"Error: {e}"
    finally:
        cursor.close()
        connect_server.close()  # 確保連接被關閉


@app.route("/getTableData", methods=["POST", "GET"])
def getTableData():
    selected_db = request.form.get("db_user")
    selected_table = request.form.get("table_name")
    try:
        connect_server = pymysql.connect(
            host="localhost",
            port=3306,
            user="root",
            passwd="0989982912",
            charset="utf8",
            database=selected_db,
        )
        with connect_server.cursor() as cursor:
            cursor.execute(f"SELECT * FROM `{selected_table}`")
            data = cursor.fetchall()
            if data == ():
                return {"message": "None!!"}
            else:
                print(type(data))
                # data_matrix = [list(row) for row in data]
                # return {"message": "Success!!", "data": data_matrix}
                return {"message": "Success!!", "data": data}

    except pymysql.Error as e:
        return f"Error: {e}"
    finally:
        cursor.close()
        connect_server.close()  # 確保連接被關閉


if __name__ == "__main__":
    # 定義app在8000埠運行
    app.run(host="localhost", port=8000, debug=True)
