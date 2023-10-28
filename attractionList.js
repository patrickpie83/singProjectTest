//景點列表頁面
//呈現最新所有於資料庫內的景點
//各景點卡片的按鈕會連結至各自的詳細頁

let attractionListBody=document.querySelector(".attractionListBody");
const _url = "https://singlepreproject.onrender.com/"; // 設定伺服器網址
let logout=document.querySelector(".logout");
let data = [];

//取景點資料，呼叫渲染的函式
function init(){
    axios.get(`${_url}posts`)
    .then(function(response){
        data=response.data; 
        renderData();
    })
}

//每次都會呼叫初始化函式，確保為最新景點列表
init();

//渲染函式-遍歷景點資料的陣列
function renderData(){
    let attractionListStr= '';
  
    data.forEach(function (item,index) {
        
        //景點列表首頁渲染
        attractionListStr+=
        `<div class="col-sm-3 mb-3">
            <div class="card h-100">
            <div class="card-body">
                <h5 class="card-title text-truncate">${item.attractionTitle}</h5>
                <p class="card-text text-truncate">${item.attractionContent}</p>
                <a href="attractionMore.html?id=${item.id}" class="btn btn-primary">看詳細</a>
            </div>
            </div>
        </div>`;//id丟到網址，再從attractionMore.js去取出id，個別景點資料渲染頁面
    })
    attractionListBody.innerHTML=attractionListStr;
  }

  //登出時清除token
  logout.addEventListener("click",function(){
    localStorage.clear();
  })