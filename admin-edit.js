//後台主頁

let attractionTitle=document.querySelector("#attractionTitle");
let attractionContent=document.querySelector("#attractionContent");
let addBtn=document.querySelector(".addBtn");
let adminEditBody=document.querySelector(".adminEditBody");
let attractionListBody=document.querySelector(".attractionListBody");
let tableEventListener=document.querySelector(".tableEventListener");
let attractionListTab=document.querySelector("#attractionList-tab");
let logout=document.querySelector(".logout");
let body=document.querySelector("body");

const _url = "https://singlepreproject.onrender.com/"; // 設定伺服器網址

let data = [];

//初始化函式，判斷身份
//若不是admin，會跳回上一頁 （HTML內<body>預設為d-none)
//若是admin，拔除<body> d-none的class。並將資料庫內的景點內容列出(呼叫renderData函式)
function adminEditinit(){
    if(!localStorage.getItem("adminToken")){
        alert("沒有權限進入");
        window.history.back();
    }else{
        body.removeAttribute("class");//預設為不顯示
        //取得最新景點內容
        axios.get(`${_url}posts`)
        .then(function(response){
            data=response.data; 
            renderData();//後台編輯頁與管理者的景點列表頁都要重新渲染
        })
    }
}

adminEditinit();

//渲染函式
//後台主頁生成（直接寫在html class，切換頁籤時渲染）/給予編輯景點的網址對應物件id
//管理者的景點首頁生成（按下“回到景點首頁”按鈕時渲染）
function renderData(){
    //空字串，後面會寫入html程式碼
    let adminEditBodyStr = ''; //後台主頁的html程式碼
    let attractionListStr= ''; //管理者的景點列表頁的html程式碼
  
    data.forEach(function (item,index) {
        //後台主頁渲染  
        adminEditBodyStr+=`<tr>
      <th scope="row">${item.id}</th>
      <td>${item.attractionTitle}</td>
      <td class="w-75">${item.attractionContent}</td>
      <td class="align-middle">
      <a href="admin-attractionEdit.html?id=${item.id}">編輯</a>
      <br>
      <a type="button" class="delete" data-num="${item.id}">刪除</a></td>
    </tr>`;
    //編輯：id丟到網址，再從admin-attractionEdit.js去取出id，把資料渲染頁面，便可編輯各景點
    //刪除：同時要把id寫在自創屬性data-num，以利後續刪除時辨識

        //管理者的景點列表首頁渲染
        attractionListStr+=
        `<div class="col-sm-3 mb-3">
            <div class="card h-100">
            <div class="card-body">
                <h5 class="card-title text-truncate">${item.attractionTitle}</h5>
                <p class="card-text text-truncate">${item.attractionContent}</p>
                <a class="btn btn-primary adminAttractionMore" data-num="${item.id}">看詳細</a>
            </div>
            </div>
        </div>`;
        //把id寫在自創屬性data-num，以利後續管理者“看詳細”時能切換對應物件id
    })
    adminEditBody.innerHTML = adminEditBodyStr;
    attractionListBody.innerHTML=attractionListStr;
  }

//“回到景點首頁”頁籤
attractionListTab.addEventListener("click",function(){
    adminEditinit();
    //因為“看詳細”
    //如果在景點列表看詳細裡面，再按回到景點首頁的話，需要重新渲染管理者的景點列表頁(還原)
})

//“新增景點”頁籤
addBtn.addEventListener("click",function(){
    if(! (attractionTitle.value && attractionContent.value)){
        console.log("欄位未填");
        return;
    }
    //未來要再做防止重複標題的貼文
    axios.post(`${_url}posts`,{
        "attractionTitle":attractionTitle.value,
        "attractionContent":attractionContent.value
    })
    .then(function(res){
        //新增景點後要將後台編輯頁與管理者的景點列表頁重新渲染
        adminEditinit(); 
        alert("新增成功");
        //回到後台編輯頁
        window.location.href="admin-page.html";
    })
    .catch(function(err){
        console.log(err);
    })
})

let userData=[]; //後面要遍歷使用者的收藏景點，刪除指定景點時會一併刪除，不可繼續留在使用者收藏清單內(景點id對應會亂掉)
let num;

//刪除景點功能
//後續新增的內容（刪除景點按鈕）是沒有辦法綁監聽事件的，因此要先寫在table上
tableEventListener.addEventListener("click",function(e){
    //目前dom為<table>
    //e.target.getAttribute為 點到的(按鈕)其屬性為class的值
    //點到的部分如果class 不是delete的話立即中斷函式
    if(e.target.getAttribute("class")!=="delete"){
      return;
    }

    //data-num為景點id
    num = e.target.getAttribute("data-num"); //取得要刪除的物件的id
    axios.delete(`${_url}posts/${num}`)  //刪除路由指定id的物件
    .then(function(res){ //res此參數並沒有作用到
      alert("刪除成功！同時移除使用者的收藏項目");
      adminEditinit(); //執行初始化函式  (重新get路由posts的data，顯示最新畫面)
    })

    //刪除景點的話也要刪除所有user的collectPostId該景點的id
    getUsers();

  })

//取得所有使用者資料
function getUsers(){
    axios.get(`${_url}users`)
    .then(function(response){
        userData=response.data; 
        deleteUserCollectPostId();
    })
}

//遍歷使用者，收藏景點id有當前的景點id(num)，會移除
function deleteUserCollectPostId(){
    //num為當前景點id
    //物件的id取出時會是number，因此要轉為string，才能與collectPostId陣列判斷
    num=num.toString();

    userData.forEach(function(item,index){
    
        let isCollect=item.collectPostId.includes(num);
        //若有收藏當前景點，則會移除id
        if(isCollect){
            //取消user的收藏
            //移除的函式
            Array.prototype.remove = function(value) {
                this.splice(this.indexOf(value), 1);
            }
            item.collectPostId.remove(num);

            //移除後的collectPostId陣列重新寫入
            //因為不確定axios.delete刪除屬性中的陣列指定值，故只能用重新patch的方式修改
            axios.patch(`${_url}users/${item.id}`,{
                "collectPostId":item.collectPostId
              })
        }
    })
}

//後續新增的內容（看詳細）是沒有辦法綁監聽事件的，因此要先寫在attractionListBody上
//管理者的景點“看詳細”
attractionListBody.addEventListener("click",function(e){
    // console.log(e.target);
    if(!e.target.classList.contains("adminAttractionMore")){
        return;
    }

    let num = e.target.getAttribute("data-num"); //取得要刪除的物件的id
    axios.get(`${_url}posts/${num}`)
    .then(function(response){
        //將當前頁面(管理者的景點列表)渲染成當前點選景點的id其詳細內容
        attractionListBody.innerHTML=JSON.stringify(response.data);
    })
    
})

  //登出時清除token
  logout.addEventListener("click",function(){
    localStorage.clear();
  })