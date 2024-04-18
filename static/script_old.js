//------------------------- BLE 連接 ESP32_Audio ---------------------
let deviceAudio;
var servAudio_uuid = '6e400003-b5a3-f393-e0a9-e50e24dcca9e'.toLowerCase();
var charAudio_uuid = '6e400004-b5a3-f393-e0a9-e50e24dcca9e'.toLowerCase();
let characteristicAudio;
let valueStr;  // 傳給ESP32_Audio的字串指令

$(function () {
    $("#scanAudio").on('click', async function () {
        if (deviceAudio && deviceAudio.gatt.connected) {
            await deviceAudio.gatt.disconnect();
            characteristicAudio = null;
            $("#content").text('藍芽裝置已斷開連接！需重新連接');
            $('#scanAudio').css('color', 'red');
            $('#scanAudio').css('background', '#fff');
            $('#scanAudio').on('mouseenter', function () {
                $(this).css('color', '#fff');
                $(this).css('background', '#02457a');
            });
            $('#scanAudio').on('mouseleave', function () {
                $(this).css('color', 'red');
                $(this).css('background', '#fff');
            });
            console.log('> 已斷開 ESP32_Audio 連接。');
        } else {
            console.log('尋找 ESP32_BLE_Audio...')
            try {
                deviceAudio = await navigator.bluetooth.requestDevice({
                    filters: [{ namePrefix: 'ESP32_BLE_Audio' }],
                    optionalServices: [servAudio_uuid]
                });
                console.log('連接 ESP32_BLE_Audio 中...');
                $("#content").text('藍芽裝置連接中...');

                const server = await deviceAudio.gatt.connect();
                const service = await server.getPrimaryService(servAudio_uuid);
                characteristicAudio = await service.getCharacteristic(charAudio_uuid);
                $('#scanAudio').css('color', '#fff');
                $('#scanAudio').css('background', '#02457a');
                $('#scanAudio').on('mouseleave', function () {
                    $(this).css('color', '#fff');
                    $(this).css('background', '#02457a');
                });
                $("#content").text('藍芽裝置已連接！');
                console.log('> 已連接到 ESP32_Audio 。');
            } catch (error) {
                // $("#content").text('藍芽裝置尚未連接！');
                console.error('連接 ESP32_Audio 失敗!!', error);
            }
        }
    });

});

// 定義收到上下左右訊息的函式
// async function downSpeaker() {
//     if (!characteristicAudio) return;
//     valueStr = 'DOWN';
//     console.log('> 傳送給ESP32_Audio: ' + valueStr);
//     await characteristicAudio.writeValue(new TextEncoder().encode(valueStr));
// }
// async function leftSpeaker() {
//     if (!characteristicAudio) return;
//     valueStr = 'LEFT';
//     console.log('> 傳送給ESP32_Audio: ' + valueStr);
//     await characteristicAudio.writeValue(new TextEncoder().encode(valueStr));
// }
// async function rightSpeaker() {
//     if (!characteristicAudio) return;
//     valueStr = 'RIGHT';
//     console.log('> 傳送給ESP32_Audio: ' + valueStr);
//     await characteristicAudio.writeValue(new TextEncoder().encode(valueStr));
// }
// async function upSpeaker() {
//     if (!characteristicAudio) return;
//     valueStr = 'UP';
//     console.log('> 傳送給ESP32_Audio: ' + valueStr);
//     await characteristicAudio.writeValue(new TextEncoder().encode(valueStr));
// }
async function downSpeaker() {
    if (!deviceAudio || !characteristicAudio || !deviceAudio.gatt.connected) {
        console.log('未連接藍芽或已斷開連接');
        $("#content").text('藍芽裝置已斷開連接！需重新連接');
        $('#scanAudio').css('color', 'red');
        $('#scanAudio').css('background', '#fff');
        $('#scanAudio').on('mouseenter', function () {
            $(this).css('color', '#fff');
            $(this).css('background', '#02457a');
        });
        $('#scanAudio').on('mouseleave', function () {
            $(this).css('color', 'red');
            $(this).css('background', '#fff');
        });
        return;
    } else {
        valueStr = 'DOWN';
        console.log('> 傳送給ESP32_Audio: ' + valueStr);
    }

    try {
        await characteristicAudio.writeValue(new TextEncoder().encode(valueStr));
    } catch (error) {
        console.error('writeValue 錯誤:', error);
    }
}
async function leftSpeaker() {
    if (!deviceAudio || !characteristicAudio || !deviceAudio.gatt.connected) {
        console.log('未連接藍芽或已斷開連接');
        $("#content").text('藍芽裝置已斷開連接！需重新連接');
        $('#scanAudio').css('color', 'red');
        $('#scanAudio').css('background', '#fff');
        $('#scanAudio').on('mouseenter', function () {
            $(this).css('color', '#fff');
            $(this).css('background', '#02457a');
        });
        $('#scanAudio').on('mouseleave', function () {
            $(this).css('color', 'red');
            $(this).css('background', '#fff');
        });
        return;
    } else {
        valueStr = 'LEFT';
        console.log('> 傳送給ESP32_Audio: ' + valueStr);
    }

    try {
        await characteristicAudio.writeValue(new TextEncoder().encode(valueStr));
    } catch (error) {
        console.error('writeValue 錯誤:', error);
    }
}
async function rightSpeaker() {
    if (!deviceAudio || !characteristicAudio || !deviceAudio.gatt.connected) {
        console.log('未連接藍芽或已斷開連接');
        $("#content").text('藍芽裝置已斷開連接！需重新連接');
        $('#scanAudio').css('color', 'red');
        $('#scanAudio').css('background', '#fff');
        $('#scanAudio').on('mouseenter', function () {
            $(this).css('color', '#fff');
            $(this).css('background', '#02457a');
        });
        $('#scanAudio').on('mouseleave', function () {
            $(this).css('color', 'red');
            $(this).css('background', '#fff');
        });
        return;
    } else {
        valueStr = 'RIGHT';
        console.log('> 傳送給ESP32_Audio: ' + valueStr);
    }

    try {
        await characteristicAudio.writeValue(new TextEncoder().encode(valueStr));
    } catch (error) {
        console.error('writeValue 錯誤:', error);
    }
}
async function upSpeaker() {
    if (!deviceAudio || !characteristicAudio || !deviceAudio.gatt.connected) {
        console.log('未連接藍芽或已斷開連接');
        $("#content").text('藍芽裝置已斷開連接！需重新連接');
        $('#scanAudio').css('color', 'red');
        $('#scanAudio').css('background', '#fff');
        $('#scanAudio').on('mouseenter', function () {
            $(this).css('color', '#fff');
            $(this).css('background', '#02457a');
        });
        $('#scanAudio').on('mouseleave', function () {
            $(this).css('color', 'red');
            $(this).css('background', '#fff');
        });
        return;
    } else {
        valueStr = 'UP';
        console.log('> 傳送給ESP32_Audio: ' + valueStr);
    }

    try {
        await characteristicAudio.writeValue(new TextEncoder().encode(valueStr));
    } catch (error) {
        console.error('writeValue 錯誤:', error);
    }
}

//---------------------- 隨機播放功能 -------------------------
// 隨機排序陣列的函式
function shuffleArray(array) {
    let currentIndex = array.length, randomIndex, temporaryValue;
    while (currentIndex !== 0) {
        // 隨機挑選一個索引
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // 交換目前索引和隨機選中的索引的元素
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
};

let currentVideoIndex = 0; // 記錄當前播放的影片索引
let currentVideoName = ''; // 記錄當前播放的聲音方向
let currentVideoHZ = ''; // 記錄當前播放的聲音頻率

let shuffledVideos;
// 每個方向隨機各播放一遍
function playRandomVideo() {
    // 將播放器的影片路徑設定為隨機排序後的路徑
    videoPlayer.src = shuffledVideos[currentVideoIndex];
    if (currentVideoIndex < shuffledVideos.length) {
        let videoName = videoPlayer.src;
        let direction;
        // 判斷該播放的聲音頻率
        if (videoName.includes('500')) {
            currentVideoHZ = '500Hz';
        } else if (videoName.includes('2000')) {
            currentVideoHZ = '2000Hz';
        }
        // 判斷該播放的聲音方向
        if (videoName.includes('video/D')) {
            downSpeaker();
            currentVideoName = '下方';
            direction = 'D';
        } else if (videoName.includes('video/L')) {
            leftSpeaker();
            currentVideoName = '左方';
            direction = 'L';
        } else if (videoName.includes('video/R')) {
            rightSpeaker();
            currentVideoName = '右方';
            direction = 'R';
        } else if (videoName.includes('video/U')) {
            upSpeaker();
            currentVideoName = '上方';
            direction = 'U';
        }
        videoPlayer.load();
        videoPlayer.play();
        pointOne(direction);
        currentVideoIndex++;
        console.log(currentVideoIndex + ', ' + String(videoName));
        log(currentVideoIndex + ', ' + currentVideoName + ', ' + currentVideoHZ + ', ' + $('#vol').text() + ', ' + timeArr.length);

        let loopVideos = document.getElementById("videoPlayer");
        // 影片播放結束事件
        loopVideos.onended = function () {
            // alert("The video has ended");
            setTimeout(function () {
                // 在這裡添加任何你想要延遲後執行的程式碼
                console.log('delay 0.5s');
                playRandomVideo();
            }, 500); // 延遲時間，單位是毫秒
        };

    } else {
        // 所有影檔播放完畢，將索引歸零並重新整理播放順序
        videoPlayer.src = '';
        currentVideoIndex = 0;
        currentVideoName = '';
        console.log('> 結束播放');
        log('> 結束播放');
        shuffledVideos = shuffleArray(videos.slice())
    }

};

//------------------------- video 切換 ---------------------
var videos = [];
$("#hertz500").on('click', function () {
    $('#hertz500').css('color', '#fff');
    $('#hertz500').css('background', '#3b7c78');
    $('#hertz500').css('border-color', '#fff');
    $('#hertz2000').css('color', 'black');
    $('#hertz2000').css('background', '#fff');
    $('#hertz2000').css('border-color', '#3b7c78');
    // chromeSamples.setStatus('Playing 500Hz.')
    chromeSamples.setStatus('＞ 目前為 500Hz 的聲音');
    $('#status').css('color', 'black');

    videos = [
        '../static/video/D_500.mp4',
        '../static/video/L_500.mp4',
        '../static/video/R_500.mp4',
        '../static/video/U_500.mp4'
    ];
    shuffledVideos = shuffleArray(videos.slice())
    console.log(shuffledVideos);
});
$("#hertz2000").on('click', function () {
    $('#hertz2000').css('color', '#fff');
    $('#hertz2000').css('background', '#3b7c78');
    $('#hertz2000').css('border-color', '#fff');
    $('#hertz500').css('color', 'black');
    $('#hertz500').css('background', '#fff');
    $('#hertz500').css('border-color', '#3b7c78');
    // chromeSamples.setStatus('Playing 2000Hz.')
    chromeSamples.setStatus('＞ 目前為 2000Hz 的聲音');
    $('#status').css('color', 'black');

    videos = [
        '../static/video/D_2000.mp4',
        '../static/video/L_2000.mp4',
        '../static/video/R_2000.mp4',
        '../static/video/U_2000.mp4'
    ];
    shuffledVideos = shuffleArray(videos.slice())
    // console.log(shuffledVideos);
});

let n = 0;
$("#upSpeaker").on('click', function () {
    upSpeaker();
    if (videos.length == 0) {
        $('#status').css('color', 'red');
    } else if (videos[3].includes('U_500')) {
        n++;
        // log(n + ', UP, 500Hz, ' + $('#vol').text() + ', ' + timeArr.length);
        log(n + ', 上方, 500Hz, ' + $('#vol').text() + ', ' + timeArr.length);
        playOneVideo(3);
    } else if (videos[3].includes('U_2000')) {
        n++;
        // log(n + ', UP, 2000Hz, ' + $('#vol').text() + ', ' + timeArr.length);
        log(n + ', 上方, 2000Hz, ' + $('#vol').text() + ', ' + timeArr.length);
        playOneVideo(3);
    }
});
$("#leftSpeaker").on('click', function () {
    leftSpeaker();
    if (videos.length == 0) {
        $('#status').css('color', 'red');
    } else if (videos[1].includes('L_500')) {
        n++;
        // log(n + ', LEFT, 500Hz, ' + $('#vol').text() + ', ' + timeArr.length);
        log(n + ', 左方, 500Hz, ' + $('#vol').text() + ', ' + timeArr.length);
        playOneVideo(1);
    } else if (videos[1].includes('L_2000')) {
        n++;
        // log(n + ', LEFT, 2000Hz, ' + $('#vol').text() + ', ' + timeArr.length);
        log(n + ', 左方, 2000Hz, ' + $('#vol').text() + ', ' + timeArr.length);
        playOneVideo(1);
    }
});
$("#downSpeaker").on('click', function () {
    downSpeaker();
    if (videos.length == 0) {
        $('#status').css('color', 'red');
    } else if (videos[0].includes('D_500')) {
        n++;
        // log(n + ', DOWN, 500Hz, ' + $('#vol').text() + ', ' + timeArr.length);
        log(n + ', 下方, 500Hz, ' + $('#vol').text() + ', ' + timeArr.length);
        playOneVideo(0);
    } else if (videos[0].includes('D_2000')) {
        n++;
        // log(n + ', DOWN, 2000Hz, ' + $('#vol').text() + ', ' + timeArr.length);
        log(n + ', 下方, 2000Hz, ' + $('#vol').text() + ', ' + timeArr.length);
        playOneVideo(0);
    }
});
$("#rightSpeaker").on('click', function () {
    rightSpeaker();
    if (videos.length == 0) {
        $('#status').css('color', 'red');
    } else if (videos[2].includes('R_500')) {
        n++;
        // log(n + ', RIGHT, 500Hz, ' + $('#vol').text() + ', ' + timeArr.length);
        log(n + ', 右方, 500Hz, ' + $('#vol').text() + ', ' + timeArr.length);
        playOneVideo(2);
    } else if (videos[2].includes('R_2000')) {
        n++;
        // log(n + ', RIGHT, 2000Hz, ' + $('#vol').text() + ', ' + timeArr.length);
        log(n + ', 右方, 2000Hz, ' + $('#vol').text() + ', ' + timeArr.length);
        playOneVideo(2);
    }
});
function playOneVideo(num) {
    videoPlayer.src = videos[num];
    videoPlayer.load();
    videoPlayer.play();
    if (num == 3) {
        pointOne("U");
    } else if (num == 1) {
        pointOne("L");
    } else if (num == 0) {
        pointOne("D");
    } else if (num == 2) {
        pointOne("R");
    }
    function onendedVideo(str) {
        let oneVideo = document.getElementById("videoPlayer");
        oneVideo.onended = function () {
            if (str.includes("U")) {
                console.log('上方播放結束');
            } else if (str.includes("L")) {
                console.log('左方播放結束');
            } else if (str.includes("D")) {
                console.log('下方播放結束');
            } else if (str.includes("R")) {
                console.log('右方播放結束');
            }

        };
    }
    onendedVideo(videos[num]);
}

$("#playRandomVideo").on('click', function () {
    if (videos.length == 0) {
        $('#status').css('color', 'red');
    } else if (videos[0].includes('500')) {
        // log('> Random playing...(500Hz)');
        log('> 隨機方向播放 500Hz 的聲音');
        console.log(shuffledVideos);
        playRandomVideo();
    } else if (videos[0].includes('2000')) {
        // playVideo();
        // log('> Random playing...(2000Hz)');
        log('> 隨機方向播放 2000Hz 的聲音');
        console.log(shuffledVideos);
        playRandomVideo();
    }
});

$("#pauseVideo").on('click', function () {
    videoPlayer.pause();
    videoPlayer.src = '';
    currentVideoIndex = 0;
    currentVideoName = '';
    // log('> Stop playing.');
    log('> 停止播放');
});



$("#cleanLog").on('click', function () {
    console.log('清除播放狀態的 LOG');
    chromeSamples.clearLog();
    n = 0;
});


// let tableName;
// $("#saveLog").on('click', function () {
//     // 獲取<pre>元素中的文本內容
//     const logContent = document.getElementById('log').innerText;
//     // 創建一個 Blob 對象，將文本內容轉換為 Blob
//     const blob = new Blob([logContent], { type: 'text/plain' });
//     // 創建下載連結
//     const downloadLink = document.createElement('a');
//     downloadLink.href = URL.createObjectURL(blob);

//     // 取得 db_user 的值
//     const dbUserValue = $('#db_user').val();
//     // 設置下載文件名稱
//     let fileName = dbUserValue + '__' + tableName;
//     downloadLink.download = fileName + '.txt';
//     // 將下載連結點擊，觸發下載
//     downloadLink.click();
// });



// function setFullVolume() {
//     $("#vol").text('1.0');
//     videoPlayer.volume = 1.0;
// }
// function setQuartersVolume() {
//     $("#vol").text('0.75');
//     videoPlayer.volume = 0.75;
// }
// function setHalfVolume() {
//     $("#vol").text('0.5');
//     videoPlayer.volume = 0.5;
// }
// function setQuarterVolume() {
//     $("#vol").text('0.25');
//     videoPlayer.volume = 0.25;
// }
videoPlayer.volume = 0.5;
$("#vol").text(parseInt(videoPlayer.volume * 10));
console.log(videoPlayer.volume);
let volume;
function setVolumeLow() {
    if (parseFloat(videoPlayer.volume.toFixed(1)) >= 0.1) {
        videoPlayer.volume -= 0.1;
    } else {
        videoPlayer.volume = 0;
    }
    // console.log(videoPlayer.volume);
    volume = parseInt(videoPlayer.volume.toFixed(1) * 10);
    $("#vol").text(parseInt(volume));
}
function setVolumeHigh() {
    if (parseFloat(videoPlayer.volume.toFixed(1)) <= 0.9) {
        videoPlayer.volume += 0.1;
    } else {
        videoPlayer.volume = 1;
    }
    // console.log(videoPlayer.volume);
    volume = parseInt(videoPlayer.volume.toFixed(1) * 10);
    $("#vol").text(parseInt(volume));
}

//--------------------------BLE 連接 ESP32_JY901----------------------------
let deviceJY901;
var servJY901_uuid = '6e400001-b5a3-f393-e0a9-e50e24dcca9e'.toLowerCase();
var charJY901_uuid = '6e400002-b5a3-f393-e0a9-e50e24dcca9e'.toLowerCase();
let characteristicJY901;

// 計算後的數據
let timeArr = [];
let arrDataX = [];
let arrDataZ = [];
let arrLen = [];
let arrData = [];
let matrixJSON = '';
let pointJSON = '';

// 存儲接收到的數據
let timeArray = [];
let arrayDataX = [];
let arrayDataZ = [];
$(function () {
    $("#scanJY901").on('click', async function () {
        console.log('尋找 ESP32_BLE_JY901...')
        try {
            deviceJY901 = await navigator.bluetooth.requestDevice({
                filters: [{ namePrefix: 'ESP32_BLE_JY901' }],
                optionalServices: [servJY901_uuid]
            });
            // $("#displayState_JY901").text('配對中，');
            console.log('連接 ESP32_BLE_JY901 中...');

            const server = await deviceJY901.gatt.connect();
            const service = await server.getPrimaryService(servJY901_uuid);
            characteristicJY901 = await service.getCharacteristic(charJY901_uuid);
            $('#scanJY901').css('color', '#fff');
            $('#scanJY901').css('background', '#02457a');
            $('#scanJY901').on('mouseleave', function () {
                $(this).css('color', '#fff');
                $(this).css('background', '#02457a');
            });
            $("#content").text('藍芽裝置已連接！');
            console.log('> 已連接到 ESP32_JY901 。');

            $('#dataJY901').empty();
            // 在 ID 為 "dataJY901" 的 <p> 元素中添加具有 ID 為 "dataX" 的 <span>
            $('#dataJY901').append('dataX：<span id="dataX"></span>');
            $('#dataJY901').append('<br>');
            $('#dataJY901').append('dataZ：<span id="dataZ"></span>');
            // 監聽特徵值變化
            characteristicJY901.addEventListener('characteristicvaluechanged', function (event) {
                const valueJY901 = event.target.value;
                // 解析感測器數據, 預設數據為UFT-8編碼字符串
                let dataJY901 = new TextDecoder().decode(valueJY901);
                // $("#dataJY901").text('數據：' + dataJY901);

                let receivedDataX = parseFloat(dataJY901.split(',')[0]);
                // let receivedDataY = parseFloat(dataJY901.split(',')[1]);
                let receivedDataZ = parseFloat(dataJY901.split(',')[2]);
                let receiveTime = parseFloat(dataJY901.split(',')[3]);

                $("#dataX").text(receivedDataX);
                $("#dataZ").text(receivedDataZ);

                arrDataX.push(receivedDataX);
                arrDataZ.push(receivedDataZ);
                timeArr.push(receiveTime / 1000);
                arrLen.push(timeArr.length);

                // 及時畫圖的原始資料
                // arrayDataX.push(receivedDataX);
                // arrayDataZ.push(receivedDataZ);
                // timeArray.push(receiveTime / 1000);

            });
            await characteristicJY901.startNotifications();
        } catch (error) {
            // $("#displayState_JY901").text('連接失敗，請再掃描一次！');
            console.error('連接 ESP32_JY901 失敗!!', error);
        }
    });

    $("#disconnectJY901").on('click', async function () {
        clearInterval(plotingJY901);

        if (deviceJY901 && deviceJY901.gatt.connected) {
            // 斷開連線
            await deviceJY901.gatt.disconnect();
            characteristicJY901 = null;
            // $("#displayState_JY901").text('已斷開連接！');
            $("#dataJY901").text('結束讀取數據，');
            $('#dataJY901').append('<br>記得儲存資料。');
            // $('#dataJY901').append('<br>請重新連接感測器。');
            $('#scanJY901').css('color', 'red');
            $('#scanJY901').css('background', '#fff');
            $('#scanJY901').on('mouseenter', function () {
                $(this).css('color', '#fff');
                $(this).css('background', '#02457a');
            });
            $('#scanJY901').on('mouseleave', function () {
                $(this).css('color', 'red');
                $(this).css('background', '#fff');
            });
            console.log('> 已斷開與 ESP32_JY901 的連線。');

            for (let i = 1; i < timeArr.length; i++) {
                timeArr[i] = timeArr[i] - timeArr[0];

                if (Math.abs(arrDataZ[i] - arrDataZ[i + 1]) > 300) {
                    if (arrDataZ[i + 1] < 0) {
                        arrDataZ[i + 1] += 360;
                    } else if (arrDataZ[i + 1] > 0) {
                        arrDataZ[i + 1] -= 360;
                    }
                }

                if (Math.abs(arrDataX[i] - arrDataX[i + 1]) > 300) {
                    if (arrDataX[i + 1] < 0) {
                        arrDataX[i + 1] += 360;
                    } else if (arrDataX[i + 1] > 0) {
                        arrDataX[i + 1] -= 360;
                    }
                }

                arrDataZ[i] -= arrDataZ[0];
                arrDataX[i] -= arrDataX[0];
            }
            timeArr[0] = 0;
            arrDataZ[0] = 0;
            arrDataX[0] = 0;

            plotJY901(timeArr, arrDataZ, arrDataX);
            // 把播放時間的點標記在圖上
            for (let i = 0; i < pointAll.length; i++) {
                let valueY, colorY, pointName;
                if (pointAll[i][1].includes('U')) {
                    valueY = 48;
                    colorY = 'blue'
                    pointName = '上方(+48)'
                } else if (pointAll[i][1].includes('L')) {
                    valueY = 45;
                    colorY = 'chocolate'
                    pointName = '左方(+45)'
                } else if (pointAll[i][1].includes('D')) {
                    valueY = -10;
                    colorY = 'blue'
                    pointName = '下方(-10)'
                } else if (pointAll[i][1].includes('R')) {
                    valueY = -45;
                    colorY = 'chocolate'
                    pointName = '右方(-45)'
                }
                Plotly.addTraces("plotJY901", {
                    x: [timeArr[pointAll[i][0]]], // 標記的 x 座標
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

            // 將資料打包給後端
            for (i = 0; i < timeArr.length; i++) {
                arrData[i] = [arrLen[i], timeArr[i].toFixed(2), arrDataX[i].toFixed(1), arrDataZ[i].toFixed(1)];
            }
            console.log(arrData);

            matrixJSON = JSON.stringify(arrData);
            console.log(matrixJSON);
            pointJSON = JSON.stringify(pointAll);
            console.log(pointJSON);
        }

        $('#submit').prop('disabled', false); // 啟用提交按鈕

    });


});

// ------------------------ 畫 JY901 的資料 ------------------------
// window.addEventListener("load", function () {
//     plotJY901();
// })
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
        name: '水平角度',
        marker: {
            color: 'chocolate'
        }
    }];

    let layout = {
        title: {
            text: '感測器訊號圖',
            font: {
                family: '標楷體', // 字體家族
                size: 32, // 字體大小
                color: 'black', // 字體顏色
                weight: 'bold' // 字體粗細（加粗）
            }
        },
        xaxis: {
            title: {
                text: '時間(秒)',
                font: { family: '標楷體', size: 20 }
            }
        },
        yaxis: {
            title: {
                text: '角度',
                font: { family: '標楷體', size: 20 }
            },
            range: [-90, 90]
        },
    };

    Plotly.newPlot('plotJY901',
        data,
        layout);
}

// 標記播放聲音的時間
let pointAll = [];
function pointOne(str) {
    const substrings = ['U', 'L', 'D', 'R'];
    for (const substring of substrings) {
        if (str.includes(substring)) {
            direction = substring;
            break;
        }
    }
    pointAll.push([timeArr.length, direction]);
}

// 及時更新JY901圖
function plotJY901now(time, dataZ, dataX) {
    let data = [{
        x: time.slice(-650),
        y: dataX.slice(-650),
        // name: 'DataX',
        name: '垂直角度',
        marker: {
            color: 'blue',
        }
    },
    {
        x: time.slice(-650),
        y: dataZ.slice(-650),
        // name: 'DataZ',
        name: '水平角度',
        marker: {
            color: 'chocolate'
        }
    }];

    let layout = {
        title: '感測器訊號圖',
        xaxis: { title: '時間(秒)' },
        yaxis: { title: '角度', range: [-90, 90] }
    };

    Plotly.newPlot('plotJY901',
        data,
        layout);
}
let plotingJY901;
$("#startJY901").on('click', function () {
    function startPlot() {
        let tArray = [];
        let arrayZ = [];
        let arrayX = [];
        for (let i = 0; i < timeArray.length; i++) {
            tArray[i] = timeArray[i];
            arrayZ[i] = arrayDataZ[i];
            arrayX[i] = arrayDataX[i];
        }
        for (let i = 1; i < tArray.length; i++) {
            tArray[i] = tArray[i] - tArray[0];

            if (Math.abs(arrayZ[i] - arrayZ[i + 1]) > 300) {
                if (arrayZ[i + 1] < 0) {
                    arrayZ[i + 1] += 360;
                } else if (arrayZ[i + 1] > 0) {
                    arrayZ[i + 1] -= 360;
                }
            }

            if (Math.abs(arrayX[i] - arrayX[i + 1]) > 300) {
                if (arrayX[i + 1] < 0) {
                    arrayX[i + 1] += 360;
                } else if (arrayX[i + 1] > 0) {
                    arrayX[i + 1] -= 360;
                }
            }

            arrayZ[i] -= arrayZ[0];
            arrayX[i] -= arrayX[0];
        }
        tArray[0] = 0;
        arrayZ[0] = 0;
        arrayX[0] = 0;
        plotJY901now(tArray, arrayZ, arrayX);
    };
    plotingJY901 = setInterval(startPlot, 100);
});
$("#stopPlotedJY901").on('click', function () {
    clearInterval(plotingJY901);
});
$("#cleanJY901").on('click', function () {
    arrLen = [];
    pointAll = [];
    arrData = [];
    timeArr = [];
    arrDataZ = [];
    arrDataX = [];
    plotJY901(timeArr, arrDataZ, arrDataX);
    console.log(arrLen);
    console.log(pointAll);
    console.log(arrData);
    console.log(timeArr);
    console.log(arrDataZ);
    console.log(arrDataX);
});

