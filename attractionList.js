let attractionListBody=document.querySelector(".attractionListBody");
const _url = "http://localhost:3000/"; // 設定伺服器網址
let logout=document.querySelector(".logout");
let data = [];

function init(){
    axios.get(`${_url}posts`)
    .then(function(response){
        data=response.data; 
        renderData();
    })
}

init();


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
        </div>`;//id丟到網址，再從attractionMore.js去取出id，把資料渲染頁面
    })
    attractionListBody.innerHTML=attractionListStr;
  }

  //登出時清除token
  logout.addEventListener("click",function(){
    localStorage.clear();
  })