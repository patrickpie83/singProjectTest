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
        body.removeAttribute("class");
        axios.get(`${_url}posts`)
        .then(function(response){
            data=response.data; 
            renderData();//後台編輯頁渲染
        })
    }

}

adminEditinit();


//新增景點
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
        //新增景點後要將後台編輯頁重新渲染
        adminEditinit(); 
        alert("新增成功");
        //回到後台編輯頁
        window.location.href="http://localhost:8080/admin-page.html";
    })
    .catch(function(err){
        console.log(err);
    })
})

attractionListTab.addEventListener("click",function(){
    adminEditinit();//如果在景點列表看詳細裡面，再按回到景點首頁的話，需要重新渲染景點列表頁(還原)
})

function renderData(){
    let adminEditBodyStr = ''; //空字串，後面會寫入html程式碼
    let attractionListStr= '';
  
    data.forEach(function (item,index) {
        //後台編輯頁渲染  
        adminEditBodyStr+=`<tr>
      <th scope="row">${item.id}</th>
      <td>${item.attractionTitle}</td>
      <td class="w-75">${item.attractionContent}</td>
      <td class="align-middle">
      <a href="admin-attractionEdit.html?id=${item.id}">編輯</a>
      <br>
      <a type="button" class="delete" data-num="${item.id}">刪除</a></td>
    </tr>`;//id丟到網址，再從admin-attractionEdit.js去取出id，把資料渲染頁面
    //同時要把id寫在自創屬性data-num，以利後續刪除時辨識

        //景點列表首頁渲染
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
        //把id寫在自創屬性data-num，以利後續管理者看景點首頁詳細時能切換對應物件id
    })
    adminEditBody.innerHTML = adminEditBodyStr;
    attractionListBody.innerHTML=attractionListStr;
  }



let userData=[];
let num;

//後續新增的內容（刪除景點按鈕）是沒有辦法綁監聽事件的，因此要先寫在table上
tableEventListener.addEventListener("click",function(e){
    //目前dom為<table>
    //e.target為 點到的部分為按鈕
    //e.target.getAttribute為 屬性為class的值
    //即點到的部分如果class 不是delete的話立即中斷函式
    //   console.log(e);
    if(e.target.getAttribute("class")!=="delete"){
      return;
    }

    //!!!!!!data-num為id
    num = e.target.getAttribute("data-num"); //取得要刪除的物件的id
    axios.delete(`${_url}posts/${num}`)  //刪除路由指定id的物件
    .then(function(res){ //res此參數並沒有作用到
      alert("刪除成功！同時移除使用者的收藏項目");
      adminEditinit(); //執行初始化函式  (重新get路由todos的data給data陣列，並顯示最新畫面)
    })

    //刪除景點的話也要刪除所有user的collectPostId該景點的id
    getUsers();

  })


function getUsers(){
   
    axios.get(`${_url}users`)
    .then(function(response){
        userData=response.data; 
        deleteUserCollectPostId();
    })
}

function deleteUserCollectPostId(){
    num=num.toString();

    userData.forEach(function(item,index){
    
        let isCollect=item.collectPostId.includes(num);

        if(isCollect){
            //取消user的收藏
            Array.prototype.remove = function(value) {
                this.splice(this.indexOf(value), 1);
            }
            item.collectPostId.remove(num);
            // console.log(item.collectPostId);
            axios.patch(`${_url}users/${item.id}`,{
                "collectPostId":item.collectPostId
              })
        }
    })
}


//後續新增的內容（刪除景點按鈕）是沒有辦法綁監聽事件的，因此要先寫在attractionListBody上
attractionListBody.addEventListener("click",function(e){
    // console.log(e.target);
    if(!e.target.classList.contains("adminAttractionMore")){
        return;
    }

    let num = e.target.getAttribute("data-num"); //取得要刪除的物件的id
    axios.get(`${_url}posts/${num}`)
    .then(function(response){
        attractionListBody.innerHTML=JSON.stringify(response.data);
    })
    
})

  //登出時清除token
  logout.addEventListener("click",function(){
    localStorage.clear();
  })