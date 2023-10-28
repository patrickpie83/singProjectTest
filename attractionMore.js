//景點看詳細頁(user)
//取網址id進行景點詳細內容頁的內容呈現
//收藏按鈕已收藏未收藏的判斷
//非會員則不顯示收藏

let completeContent=document.querySelector(".completeContent");
let logout=document.querySelector(".logout");
let collectBtn=document.querySelector(".collectBtn");

const id = location.href.split("=")[1];//取出當前景點id_把當前網址切割，取[1]的值 (此id為string)
const _url = "https://singlepreproject.onrender.com/"; // 設定伺服器網址

//進入時若為訪客，不須顯示收藏按鈕
if(!localStorage.getItem("userToken")){
  collectBtn.setAttribute("class","d-none");
}

//取得路由posts的內容（景點）
//直接將當前景點內容以json格式呈現(否則各項屬性需個別取出)
axios.get(`${_url}posts/${id}`)
.then(function(response){
    completeContent.textContent=JSON.stringify(response.data);
})


//已.未收藏按鈕的判斷
let userId=localStorage.getItem("userId");
let collectPostIdArr=[];

//取得使用者的收藏景點
axios.get(`${_url}users/${userId}`)
.then(function(response){
  //將使用者的收藏景點名單的id取出至collectPostIdArr陣列
  collectPostIdArr=response.data.collectPostId;
  // 判斷使用者的收藏景點名單內，是否有包含當前景點的id
  //id為string型態
  if (collectPostIdArr.includes(id)){
    collectBtn.textContent="已收藏";
  }else if(!collectPostIdArr.includes(id)){
    collectBtn.textContent="未收藏";
  }else{
    return;
  }
})

//收藏按鈕監聽事件
collectBtn.addEventListener("click",function(){

  if(collectBtn.textContent=="未收藏"){
    
    //將當前景點的id放入collectPostIdArr陣列
    collectPostIdArr.push(id);
    //修改使用者的收藏景點屬性值
    axios.patch(`${_url}users/${userId}`,{
      "collectPostId":collectPostIdArr
    })
    .then(function(res){
      alert("已加入收藏")
      collectBtn.textContent="已收藏";
    })

  }else{
    //取消收藏
    //移除陣列中的指定值(當前景點id)
    //移除的函式
    Array.prototype.remove = function(value) {
      this.splice(this.indexOf(value), 1);
    }
    collectPostIdArr.remove(id);
    //修改使用者的收藏景點屬性值
    axios.patch(`${_url}users/${userId}`,{
      "collectPostId":collectPostIdArr
    })
    .then(function(res){
      alert("已取消收藏")
      collectBtn.textContent="未收藏";
    })

  }
})

  //登出時清除token
  logout.addEventListener("click",function(){
    localStorage.clear();
  })