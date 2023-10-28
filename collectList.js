//使用者個人收藏頁
//遍歷景點資料庫，呈現使用者有收藏的景點

let logout=document.querySelector(".logout");
let collectListBody=document.querySelector(".collectListBody");
const _url = "https://singlepreproject.onrender.com/"; // 設定伺服器網址

let userId=localStorage.getItem("userId");
let collectPostIdArr = [];
let data = [];

//取得景點的所有資料
axios.get(`${_url}posts`)
.then(function(response){
    data=response.data;
})   

//取得使用者的收藏景點id於collectPostIdArr
function init(){
    axios.get(`${_url}users/${userId}`)
    .then(function(response){
        collectPostIdArr=response.data.collectPostId; 
        //呼叫渲染函式
        renderData();
    })
}

init();

//渲染函式
function renderData(){
    let id;
    let collectListStr= '';
    //將所有景點資料遞迴，若是使用者的收藏id就顯示出來
    data.forEach(function (item,index){
        //item.id(posts的id屬性)原為number型態
        //景點id先轉為string型態，因為使用者的收藏景點id為string型態，才能判斷此值是否有包含在陣列內
        id=item.id.toString();
        let isCollect=collectPostIdArr.includes(id);//若使用者的收藏景點陣列有包含遞迴當前的景點id，則為true
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