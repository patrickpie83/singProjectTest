let completeContent=document.querySelector(".completeContent");
let logout=document.querySelector(".logout");
let collectBtn=document.querySelector(".collectBtn");

const id = location.href.split("=")[1];//取出景點id_把當前網址切割，取[1]的值 (此id為字串)
const _url = "http://localhost:3000/"; // 設定伺服器網址

if(!localStorage.getItem("userToken")){
  collectBtn.setAttribute("class","d-none");
}

//取得路由posts的內容（景點）
axios.get(`${_url}posts/${id}`)
.then(function(response){
    completeContent.textContent=JSON.stringify(response.data);
})


let userId=localStorage.getItem("userId");
let collectPostIdArr=[];

//取得使用者的收藏景點
axios.get(`${_url}users/${userId}`)
.then(function(response){
  collectPostIdArr=response.data.collectPostId;
  // 判斷使用者的收藏景點名單內，是否有包含當前景點的id
  //id為字串
  if (collectPostIdArr.includes(id)){
    collectBtn.textContent="已收藏";
  }else if(!collectPostIdArr.includes(id)){
    collectBtn.textContent="未收藏";
  }else{
    return;
  }
})


collectBtn.addEventListener("click",function(){
  if(collectBtn.textContent=="未收藏"){
    
    collectPostIdArr.push(id);

    axios.patch(`${_url}users/${userId}`,{
      "collectPostId":collectPostIdArr
    })
    .then(function(res){
      alert("已加入收藏")
      collectBtn.textContent="已收藏";
    })

  }else{
    //取消收藏
    Array.prototype.remove = function(value) {
      this.splice(this.indexOf(value), 1);
    }
    collectPostIdArr.remove(id);

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