let logout=document.querySelector(".logout");
let collectListBody=document.querySelector(".collectListBody");
const _url = "http://localhost:3000/"; // 設定伺服器網址

let userId=localStorage.getItem("userId");
let collectPostIdArr = [];
let data = [];

//取得景點的所有資料
axios.get(`${_url}posts`)
.then(function(response){
    data=response.data;
})   

function init(){
    //取得使用者的收藏景點id於collectPostIdArr
    axios.get(`${_url}users/${userId}`)
    .then(function(response){
        collectPostIdArr=response.data.collectPostId; 
        renderData();
    })
}

init();



function renderData(){
    let id;
    let collectListStr= '';
    data.forEach(function (item,index){
        //item.id為number型態
        id=item.id.toString();
        let isCollect=collectPostIdArr.includes(id);
        if(isCollect==true){
            collectListStr+=
            `<div class="col-sm-3 mb-3">
                <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title text-truncate">${item.attractionTitle}</h5>
                    <p class="card-text text-truncate">${item.attractionContent}</p>
                    <a href="attractionMore.html?id=${item.id}" class="btn btn-primary">看詳細</a>
                </div>
                </div>
            </div>`;
        }
        
    })
    collectListBody.innerHTML=collectListStr;
  }




//登出時清除token
logout.addEventListener("click",function(){
    localStorage.clear();
  })