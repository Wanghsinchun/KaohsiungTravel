var Kaodata = [];

function getData() {
    return new Promise(function (resolve, reject) {
        var data = new XMLHttpRequest();
        data.open('get', 'https://api.kcg.gov.tw/api/service/get/9c8e1450-e833-499c-8320-29b36b7ace5c', true);
        data.send();
        data.onreadystatechange = function () {
            if (data.readyState === 4 && data.status === 200) {
                var response = JSON.parse(data.responseText);
                var filterContent = response.data.XML_Head.Infos.Info;
                for (let i = 0; i < filterContent.length; i++) {
                    Kaodata.push(filterContent[i]);
                };
                resolve(Kaodata);
            }
        };
    });
}


getData().then(function (Kaodata) {
    // 在這裡呼叫您的 init() 函數
    init();
});

const list = document.querySelector('.list');
const selectArea = document.getElementById('selectArea');
const title = document.querySelector('.title');
const favoriteList = document.querySelector('.favoriteList');
let storageinitAry = JSON.parse(localStorage.getItem('init')) || [];
let book = document.querySelector('.book');
const likeBtn = document.querySelector('.likeBtn');
// const card = document.querySelector('.card');

//監聽事件
selectArea.addEventListener('change', filter, false);
book.addEventListener('click', callFavo, false);
list.addEventListener('click', addFavo, false);



//預設全部的景點，存到瀏覽器，在撈出來
function init(e) {
    let Len = Kaodata.length;
    for (let i = 0; i < Len; i++) {
        let storageObject = {
            datanum: i,
            Zipcode: Kaodata[i].Zipcode,
            Name: Kaodata[i].Name,
            Opentime: Kaodata[i].Opentime,
            Add: Kaodata[i].Add,
            Tel: Kaodata[i].Tel,
            Img: Kaodata[i].Picture1,

        };
        storageinitAry.push(storageObject);
    };
    let content = '';
    let initLen = storageinitAry.length;
    for (let i = 0; i < initLen; i++) {
        let e = storageinitAry[i].datanum;
        content += '<div class="card"><div class="cardHeader" style="background:url(' + storageinitAry[e].Img + ')"><div class="likeBtn" id="likeBtn"  ><div class="heart" data-num="' + e + '"></div></div><h3>' + storageinitAry[e].Name + '</h3></div><div class="cardBody"><li><img src="../img/icon/clock.svg" class="svg">' + storageinitAry[e].Opentime + '</li><li><img src="../img/icon/location.svg" class="svg">' + storageinitAry[e].Add + '</li><li><img src="../img/icon/phone.svg" class="svg">' + storageinitAry[e].Tel + '</li></div></div>';
    }
    list.innerHTML = content;

    //已經有收藏的，會顯示愛心
    let favoList = JSON.parse(localStorage.getItem('favoList'));
    const hearts = document.querySelectorAll('.heart');
    favoList.forEach((item) => {
        hearts.forEach((heart) => {
            if (heart.dataset.num == item.datanum) {
                heart.style.backgroundColor = 'red';
            };
        });
    });
};


//篩選對應區域的景點
function filter(e) {
    title.scrollIntoView()
    let initLen = storageinitAry.length;
    let content = '';
    let select = e.target.value;
    if (select === '000') {
        // 如果使用者沒有選擇區域，就將所有景點放到 content 中
        for (let i = 0; i < initLen; i++) {
            let e = storageinitAry[i].datanum;
            content += '<div class="card"><div class="cardHeader" style="background:url(' + storageinitAry[e].Img + ')"><div class="likeBtn" id="likeBtn"  ><div class="heart" data-num="' + e + '"></div></div><h3>' + storageinitAry[e].Name + '</h3></div><div class="cardBody"><li><img src="../img/icon/clock.svg" class="svg">' + storageinitAry[e].Opentime + '</li><li><img src="../img/icon/location.svg" class="svg">' + storageinitAry[e].Add + '</li><li><img src="../img/icon/phone.svg" class="svg">' + storageinitAry[e].Tel + '</li></div></div>';
        }
    } else {
        // 如果使用者有選擇區域，就只顯示對應區域的景點
        for (let i = 0; i < initLen; i++) {
            if (select == storageinitAry[i].Zipcode) {
                let e = storageinitAry[i].datanum;
                content += '<div class="card"><div class="cardHeader" style="background:url(' + storageinitAry[e].Img + ')"><div class="likeBtn" id="likeBtn"  ><div class="heart" data-num="' + e + '"></div></div><h3>' + storageinitAry[e].Name + '</h3></div><div class="cardBody"><li><img src="../img/icon/clock.svg" class="svg">' + storageinitAry[e].Opentime + '</li><li><img src="../img/icon/location.svg" class="svg">' + storageinitAry[e].Add + '</li><li><img src="../img/icon/phone.svg" class="svg">' + storageinitAry[e].Tel + '</li></div></div>';
            }
        }
    }
    list.innerHTML = content;




    //已經有收藏的，會顯示愛心
    let favoList = JSON.parse(localStorage.getItem('favoList'));
    const hearts = document.querySelectorAll('.heart');
    favoList.forEach((item) => {
        hearts.forEach((heart) => {
            if (heart.dataset.num == item.datanum) {
                heart.style.backgroundColor = 'red';
            }
        });
    });


    //顯示出當區域的標題
    switch (select) {
        case '804':
            title.innerHTML = '鼓山區';
            break;
        case '805':
            title.innerHTML = '旗津區';
            break;
        case '806':
            title.innerHTML = '前鎮區';
            break;
        case '807':
            title.innerHTML = '三民區';
            break;
        default:
            title.innerHTML = '全部景點';

    };
};



//收藏景點、取消收藏
//思路，先撈出資料確定是否有一樣的，如果有就刪除取消愛心，沒有就新增變紅愛心
function addFavo(e) {
    if (e.className == likeBtn) {
        const n = e.target.dataset.num;
        let storageAry = JSON.parse(localStorage.getItem('favoList')) || []; //這樣才能存很多個物件，存成陣列
        const Len = storageAry.length;
        const heart = document.querySelector('.heart');
        const hearts = document.querySelectorAll('.heart');
        let storageObject = {
            datanum: n,
            Zipcode: storageinitAry[n].Zipcode,
            Name: storageinitAry[n].Name,
            Opentime: storageinitAry[n].Opentime,
            Add: storageinitAry[n].Add,
            Tel: storageinitAry[n].Tel,
        };

        let found = false; // 用來判斷是否找到相同的 datanum
        for (let i = 0; i < Len; i++) {
            if (n === storageAry[i].datanum) {
                found = true;
                storageAry.splice(i, 1);
                localStorage.setItem('favoList', JSON.stringify(storageAry));
                hearts.forEach((heart) => {
                    //所有的.heart跑一次，符合nuｍ的愛心變色
                    if (heart.dataset.num == n) {
                        heart.style.backgroundColor = 'rgb(138, 147, 160)';
                    }
                });
                break;  //要記得跳出迴圈，不能用if else 因為刪完資料後Len會改變
            };
        };
        if (!found) {
            storageAry.push(storageObject);
            localStorage.setItem('favoList', JSON.stringify(storageAry));

            //當點擊到愛心時亮起
            hearts.forEach((heart) => {
                //所有的.heart跑一次，符合nuｍ的愛心變色
                if (heart.dataset.num == n) {
                    heart.style.backgroundColor = 'red';
                    heart.classList.add('heartPop');
                };
            });
        };
    };
};



//喜愛的景點撈出瀏覽器，顯示在收藏景點
function callFavo() {
    let favoData = JSON.parse(localStorage.getItem('favoList'));
    Len = favoData.length;
    let content = '';
    for (let i = 0; i < Len; i++) {
        let e = favoData[i].datanum;
        content += '<div class="card"><div class="cardHeader" style="background:url(' + storageinitAry[e].Img + ')"><div class="likeBtn" id="likeBtn"  ><div class="heart" data-num="' + e + '" style="background-color:red";></div></div><h3>' + storageinitAry[e].Name + '</h3></div><div class="cardBody"><li><img src="../img/icon/clock.svg" class="svg">' + storageinitAry[e].Opentime + '</li><li><img src="../img/icon/location.svg" class="svg">' + storageinitAry[e].Add + '</li><li><img src="../img/icon/phone.svg" class="svg">' + storageinitAry[e].Tel + '</li></div></div>';
    }
    list.innerHTML = content;
    title.innerHTML = '收藏景點';

};



//totop
let mybutton = document.getElementById("myBtn");
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  };
};
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
};




