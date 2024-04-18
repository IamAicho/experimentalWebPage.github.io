$(function () {
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
                $('#db_user2').append($('<option>', {
                    value: db,
                    text: db
                }));
            });
        }
    });
});

$('#db_user2').change(function () {
    const selectedDB = $(this).val();
    $.ajax({
        url: "/searchTable",
        type: "GET",
        data: { db_user: selectedDB },

        success: function (result) {
            $('#tableSelect').empty();
            $('#tableSelect').append($('<option>', {
                value: "none",
                text: "請選擇資料表"
            }));
            const json_table_names = JSON.parse(result);
            console.log(json_table_names.tables);
            if (json_table_names.tables.length == 0) {
                alert("此資料庫沒有資料表");
            } else {
                json_table_names.tables.forEach(table => {
                    $('#tableSelect').append($('<option>', {
                        value: table,
                        text: table
                    }));
                });
            }

        }
    });
});

// 找到 getForm 元素並設定其 form 裡面 type="submit" 的按鈕功能
$('#getForm').submit(function (obj) {
    obj.preventDefault(); // 防止表單預設提交行為

    const selectedDB = $('#db_user2').val();
    const selectedTable = $('#tableSelect').val();
    console.log('選擇的受測者資料庫: ' + selectedDB + '\n選擇的受測者資料表: ' + selectedTable);



    if (selectedDB == 'none') {
        alert('請選擇受測者的資料庫');
    } else if (selectedTable == 'none') {
        alert('請選擇受測者的資料表');
    }
    else {
        $.ajax({
            url: "/getTableData", /*資料提交到getTable處*/
            type: "POST",  /*采用POST或GET方法提交*/
            data: { db_user: selectedDB, table_name: selectedTable },

            /*result為後端函式回傳的json*/
            success: function (result) {
                console.log(result.message);
                let data = [];
                // let arrL = [];
                let arrTime = [];
                let arrX = [];
                let arrZ = [];
                let matrixPoint = [];
                if (result.message == "Success!!") {
                    // alert(result.message);
                    for (i = 0; i < result.data.length; i++) {
                        data[i] = result.data[i];
                    }
                    for (i = 0; i < data.length; i++) {
                        arrTime[i] = data[i][1];
                        arrX[i] = data[i][2];
                        arrZ[i] = data[i][3];
                        // if (data[i][4] != null && data[i][4] != "xR" && data[i][4] != "xL" && data[i][4] != "xRL" && data[i][4] != "500Hz" && data[i][4] != "2000Hz") {
                        //     console.log(arrTime[i]);
                        //     matrixPoint.push([arrTime[i], data[i][4]])
                        // }
                        if (data[i][4] == "U" || data[i][4] == "L" || data[i][4] == "D" || data[i][4] == "R") {
                            matrixPoint.push([arrTime[i], data[i][4]])
                        }
                    }
                    console.log(matrixPoint);
                    console.log(data[0][4]);
                    if (data[0][4] == "xR") {
                        $('#coverSide').text("右耳");
                    } else if (data[0][4] == "xL") {
                        $('#coverSide').text("左耳");
                    } else if (data[0][4] == "xRL") {
                        $('#coverSide').text("雙耳");
                    } else {
                        $('#coverSide').text("無遮蔽");
                    }
                    console.log(data[1][4]);
                    $('#hertz').text(data[1][4]);

                    plotJY901(arrTime, arrZ, arrX);
                    for (let i = 0; i < matrixPoint.length; i++) {
                        let valueY, colorY, pointName;
                        if (matrixPoint[i][1].includes('U')) {
                            valueY = 48;
                            colorY = 'blue'
                            pointName = '上方(+48)'
                        } else if (matrixPoint[i][1].includes('L')) {
                            valueY = 45;
                            colorY = 'chocolate'
                            pointName = '左方(+45)'
                        } else if (matrixPoint[i][1].includes('D')) {
                            valueY = -10;
                            colorY = 'blue'
                            pointName = '下方(-10)'
                        } else if (matrixPoint[i][1].includes('R')) {
                            valueY = -45;
                            colorY = 'chocolate'
                            pointName = '右方(-45)'
                        }
                        Plotly.addTraces("plotJY901", {
                            x: [matrixPoint[i][0]], // 標記的 x 座標
                            y: [valueY], // 標記的 y 座標
                            mode: 'markers',
                            marker: {
                                color: colorY, // 標記點的顏色
                                size: 10 // 標記點的大小
                            },
                            // name: `Point (${pointAll[i]})` // 標記的名稱
                            name: pointName // 標記的名稱
                        });
                    }


                    displayPoint(matrixPoint);
                    displayData(matrixPoint, arrTime, arrX, arrZ);
                }
                else {
                    console.log(result);
                }
            }
        });
    }


});

function plotJY901(time, dataZ, dataX) {
    let data = [{
        x: time,
        y: dataX,
        // name: 'DataX',
        name: '垂直角度',
        marker: {
            color: 'blue',
        }
    },
    {
        x: time,
        y: dataZ,
        // name: 'DataZ',
        name: '水平角度\n',
        marker: {
            color: 'chocolate'
        }
    }];

    let layout = {
        title: {
            text: '感測器訊號圖',
            font: {
                family: '標楷體', // 字體家族
                size: 36, // 字體大小
                color: 'black', // 字體顏色
                weight: 'bold' // 字體粗細（加粗）
            }
        },
        xaxis: {
            title: {
                text: '時間(秒)',
                font: { family: '標楷體', size: 28, weight: 'bold' }
            },
            tickfont: {
                size: 18,
                family: 'Times New Roman',
            },
        },
        yaxis: {
            title: {
                text: '角度',
                font: { family: '標楷體', size: 28, weight: 'bold' }
            },
            range: [-90, 90],
            tickfont: {
                size: 18,
                family: 'Times New Roman',
            },
        },
        legend: {
            font: {
                family: 'Times New Roman',
                size: 16,
                color: 'black'
            },
        },
        margin: {
            // t: 80,
        },
    };

    Plotly.newPlot('plotJY901',
        data,
        layout);
}

// dataTime, dataX, dataZ 接為一個陣列，而 dataPoint = [ time, point ] 的矩陣
function displayPoint(dataPoint) {
    $('#detailsContainer').empty();
    console.log(dataPoint);

    // map 函式來取得所有元素的第 0 個值。
    let pointTime = dataPoint.map(function (item) {
        return item[0];
    });
    // map 函式來取得所有元素的第 1 個值。
    let pointDirection = dataPoint.map(function (item) {
        return item[1];
    });
    console.log(pointTime); // 包含所有第0個值的陣列
    console.log(pointDirection); // 包含所有第1個值的陣列

    // let tablePoint = $('<table></table>');
    // // 建立表頭
    // let thead = $('<thead></thead>');
    // let headerRow = $('<tr></tr>');
    // let header1 = $('<th></th>').text('順序');
    // let header2 = $('<th></th>').text('時間');
    // let header3 = $('<th></th>').text('方向');
    // headerRow.append(header1);
    // headerRow.append(header2);
    // headerRow.append(header3);
    // thead.append(headerRow);
    // // 將<thead>加入表格
    // tablePoint.append(thead);

    // for (let i = 0; i < pointTime.length; i++) {
    //     let row = $('<tr></tr>');
    //     let cell1 = $('<td></td>').text(i + 1);
    //     let cell2 = $('<td></td>').text(pointTime[i]);
    //     let cell3 = $('<td></td>').text(pointDirection[i]);
    //     row.append(cell1);
    //     row.append(cell2);
    //     row.append(cell3);
    //     tablePoint.append(row);
    // }
    // // 在指定的容器中顯示表格
    // $('#detailsContainer').append(tablePoint);

}

// dataTime, dataX, dataZ 接為一個陣列，而 dataPoint = [ time, point ] 的矩陣
function displayData(dataPoint, dataTime, dataX, dataZ) {
    $('#dataContainer').empty();

    // map 函式來取得所有元素的第 0 個值。
    let pointTime = dataPoint.map(function (item) {
        return item[0];
    });
    // map 函式來取得所有元素的第 1 個值。
    let pointDirection = dataPoint.map(function (item) {
        return item[1];
    });

    let tablePoint = $('<table></table>');
    // 建立表頭
    let thead = $('<thead></thead>');
    let headerRow = $('<tr></tr>');
    let header1 = $('<th></th>').text('順序');
    let header2 = $('<th></th>').text('播放時間');
    let header3 = $('<th></th>').text('播放方向');
    let header4 = $('<th></th>').text('判斷方向');
    let header6 = $('<th></th>').text('反應時間');
    let header5 = $('<th></th>').text('T/F');
    headerRow.append(header1);
    headerRow.append(header2);
    headerRow.append(header3);
    headerRow.append(header4);
    headerRow.append(header6);
    headerRow.append(header5);
    thead.append(headerRow);
    // 將<thead>加入表格
    tablePoint.append(thead);

    let sumTrue = 0;
    let reactionTimeArr = [];
    for (let i = 0; i < pointDirection.length; i++) {
        console.log((i + 1) + ". " + pointDirection[i]);
        let row = $('<tr></tr>');
        let cell1 = $('<td></td>').text(i + 1);
        let cell2 = $('<td></td>').text(pointTime[i]);
        let cell3 = $('<td></td>').text(pointDirection[i]);
        let cell4;
        let valueToFind = pointTime[i];
        // 取得 valueToFind 此值在整個陣列中的索引位置
        let index = dataTime.indexOf(valueToFind);
        console.log("播放時的X軸角度:" + dataX[index]);
        console.log("播放時的Z軸角度:" + dataZ[index]);

        $('#detailsContainer').append(pointDirection[i] + "，");

        // 取得陣列中指定範圍的子陣列
        let subDataX = dataX.slice(index, index + 600);
        let subDataZ = dataZ.slice(index, index + 600);
        let subTime = dataTime.slice(index, index + 600);

        let maxDifferenceX = -Infinity;
        let maxDifferenceZ = -Infinity;
        let farthestValueX;
        let farthestValueZ;
        let farthestTimeX;
        let farthestTimeZ;
        // 抓取相差最大的角度值
        for (let j = 0; j < subDataX.length; j++) {
            const differenceX = Math.abs(dataX[index] - subDataX[j]);
            const differenceZ = Math.abs(dataZ[index] - subDataZ[j]);
            if (differenceX > maxDifferenceX) {
                maxDifferenceX = differenceX;
                farthestValueX = subDataX[j];
                farthestTimeX = subTime[subDataX.indexOf(farthestValueX)];
            }
            if (differenceZ > maxDifferenceZ) {
                maxDifferenceZ = differenceZ;
                farthestValueZ = subDataZ[j];
                farthestTimeZ = subTime[subDataZ.indexOf(farthestValueZ)];
            }
        }
        console.log('X軸6秒內相差最大的角度：' + farthestValueX + ", \n此秒數為:" + farthestTimeX + ", \n差值為:" + maxDifferenceX);
        console.log('Z軸6秒內相差最大的角度：' + farthestValueZ + ", \n此秒數為:" + farthestTimeZ + ", \n差值為:" + maxDifferenceZ);

        if (Math.abs(maxDifferenceX - maxDifferenceZ) < 3) {
            if (farthestValueX > 0 && farthestTimeZ > 0) {
                $('#detailsContainer').append("判斷為：U 或是 L<br>");
                cell4 = $('<td></td>').text("U or L");
            } else if (farthestValueX < 0 && farthestTimeZ > 0) {
                $('#detailsContainer').append("判斷為：D 或是 L<br>");
                cell4 = $('<td></td>').text("D or L");
            } else if (farthestValueX > 0 && farthestTimeZ < 0) {
                $('#detailsContainer').append("判斷為：U 或是 R<br>");
                cell4 = $('<td></td>').text("U or R");
            } else if (farthestValueX < 0 && farthestTimeZ < 0) {
                $('#detailsContainer').append("判斷為：D 或是 R<br>");
                cell4 = $('<td></td>').text("D or R");
            }
        } else if (maxDifferenceX > maxDifferenceZ) {
            if (farthestValueX > 0) {
                if (maxDifferenceX < 18) {
                    $('#detailsContainer').append("判斷為：D<br>");
                    cell4 = $('<td></td>').text("D");
                } else {
                    $('#detailsContainer').append("判斷為：U<br>");
                    cell4 = $('<td></td>').text("U");
                }
            } else if (farthestValueX < 0) {
                $('#detailsContainer').append("判斷為：D<br>");
                cell4 = $('<td></td>').text("D");
            }
        } else if (maxDifferenceX < maxDifferenceZ) {
            if (farthestValueZ > 0) {
                $('#detailsContainer').append("判斷為：L<br>");
                cell4 = $('<td></td>').text("L");
            } else if (farthestValueZ < 0) {
                $('#detailsContainer').append("判斷為：R<br>");
                cell4 = $('<td></td>').text("R");
            }
        }

        let cell6;
        let fiveValueX = undefined;
        let fiveValueZ = undefined;
        let fiveTimeX;
        let fiveTimeZ;
        // 抓取第一個大於5度的角度值及其位置
        for (let j = 0; j < subDataX.length; j++) {
            const differenceX = Math.abs(dataX[index] - subDataX[j]);
            const differenceZ = Math.abs(dataZ[index] - subDataZ[j]);
            if (differenceX > 5 && fiveValueX === undefined) {
                fiveValueX = subDataX[j];
                fiveTimeX = subTime[j];
            }
            if (differenceZ > 5 && fiveValueZ === undefined) {
                fiveValueZ = subDataZ[j];
                fiveTimeZ = subTime[j];
            }
        }
        console.log('X軸6秒內第一個相差大於5度的值：' + fiveValueX + ", \n此秒數為:" + fiveTimeX);
        console.log('Z軸6秒內第一個相差大於5度的值：' + fiveValueZ + ", \n此秒數為:" + fiveTimeZ);
        console.log(valueToFind);
        console.log(fiveTimeX);
        console.log(fiveTimeZ);
        if (fiveTimeX == undefined) {
            fiveTimeX = fiveTimeZ;
        } else if (fiveTimeZ == undefined) {
            fiveTimeZ = fiveTimeX;
        }

        let reactionTime = 0;
        if (fiveTimeX < fiveTimeZ) {
            reactionTime = Math.abs(valueToFind - fiveTimeX);
            console.log(reactionTime);
            cell6 = $('<td></td>').text(reactionTime.toFixed(2));
        } else {
            reactionTime = Math.abs(valueToFind - fiveTimeZ);
            console.log(reactionTime);
            cell6 = $('<td></td>').text(reactionTime.toFixed(2));
        }
        if (reactionTime > 1 && reactionTime < 4) {
            reactionTimeArr.push(reactionTime);
        }

        let cell5;
        if (cell4.text().includes(cell3.text())) {
            console.log("判斷正確");
            cell5 = $('<td></td>').text("True");
            sumTrue++;
        } else {
            console.log("判斷錯誤");
            cell5 = $('<td></td>').text("False");
        }


        row.append(cell1);
        row.append(cell2);
        row.append(cell3);
        row.append(cell4);
        row.append(cell6);
        row.append(cell5);
        tablePoint.append(row);

    }

    console.log(sumTrue / pointDirection.length);
    $('#correctRate').text((sumTrue / pointDirection.length * 100).toFixed(1));

    // 計算總和
    let sumReaction = 0;
    for (let i = 0; i < reactionTimeArr.length; i++) {
        sumReaction += reactionTimeArr[i];
    }
    // 計算平均值
    let averageReaction = sumReaction / reactionTimeArr.length;
    console.log(averageReaction);
    $('#reactionTime').text(averageReaction.toFixed(2));

    // 在指定的容器中顯示表格
    $('#dataContainer').append(tablePoint);

}
