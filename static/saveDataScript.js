// ------------------------ 將 JY901 的資料存入 database ------------------------
$(function () {
    // 取得伺服器裡可以存的資料庫
    $.ajax({
        url: "/searchDB",
        type: "GET",
        data: { searchDB: "searchDB" },

        success: function (result) {
            // 解析JSON資料
            const json_db_names = JSON.parse(result);
            console.log(json_db_names.databases);

            // 遍歷資料庫名稱陣列，並動態地將其加入到select的options中
            json_db_names.databases.forEach(db => {
                $('#db_user').append($('<option>', {
                    value: db,
                    text: db
                }));
            });
        }
    });

    // 取得今天的日期
    const today = new Date().toISOString().split('T')[0];
    // 找到 dateInput 元素並設定其 value 屬性為今天的日期
    $('#dateInput').val(today);
    console.log(today);
});


// 找到 dataForm 元素並設定其 form 裡面 type="submit" 的按鈕功能
$('#dataForm').submit(function (obj) {
    obj.preventDefault(); // 防止表單預設提交行為

    // 取得 form 裡所有的值
    const dbUserValue = $('#db_user').val();
    const dateInputValue = $('#dateInput').val();
    const coverEarValue = $('#ear_side').val();
    const hzValue = $('#hertz_val').val();
    console.log('選擇的受測者資料庫: ' + dbUserValue + '\n日期: ' + dateInputValue + '\n遮蔽耳: ' + coverEarValue + '\n測聽頻率: ' + hzValue);

    // 獲取<pre>元素中的文本內容
    const logContent = document.getElementById('log').innerText;
    // 創建一個 Blob 對象，將文本內容轉換為 Blob
    const blob = new Blob([logContent], { type: 'text/plain' });
    // 創建下載連結
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);

    let tableN = '';
    if (dbUserValue == 'none') {
        alert('請選擇受測者資料庫');
    } else if (hzValue == 'none') {
        alert('請選擇測聽頻率');
    } else {
        $.ajax({
            url: "/putData", /*資料提交到putData處*/
            type: "POST",  /*采用POST或GET方法提交*/
            data: { 
                db_user: dbUserValue, 
                dateInput: dateInputValue, 
                putData: matrixJSON, 
                putPoint: pointJSON, 
                putCoverEar: coverEarValue,
                putHZ: hzValue
            },

            /*result為後端函式回傳的json*/
            success: function (result) {
                if (result.message == "Success!!") {
                    console.log(result);
                    alert(result.message);
                    tableN = result.tableName;
                    console.log(tableN);

                    // 設置下載文件名稱
                    let fileName = dbUserValue + '__' + tableN;
                    downloadLink.download = fileName + '.txt';
                    // 將下載連結點擊，觸發下載
                    downloadLink.click();
                }
                else {
                    console.log(result);
                }
            }
        });
    }
});

