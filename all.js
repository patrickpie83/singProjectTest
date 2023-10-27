let signUpEmail=document.querySelector("#signUpEmail");
let signUpPassword=document.querySelector("#signUpPassword");
let signUpBtn=document.querySelector(".signUpBtn");

let loginEmail=document.querySelector("#loginEmail");
let loginPassword=document.querySelector("#loginPassword");
let loginBtn=document.querySelector(".loginBtn");

const _url = "https://singlepreproject.onrender.com/"; // 設定伺服器網址

//註冊按鈕監聽事件
//////未來要遍歷迴圈判斷會員是否存在，出現警告
signUpBtn.addEventListener("click",function(){
    if(! (signUpEmail.value && signUpPassword.value)){
        alert("欄位未填");
        return;
    }
    signUp();
})

//註冊後寫入資料
function signUp(){
    axios.post(`${_url}users`,{
        "email":signUpEmail.value,
        "password":signUpPassword.value,
        "collectPostId":[]
        //收藏景點的內容先設空值
    })
    .then(function(res){
        alert("註冊成功");
        window.location.href ="index.html";
    })
    .catch(function(err){
        console.log(err);
    })
}


//登入按鈕監聽事件
//////未來要遍歷迴圈判斷會員若無存在，或輸入不正確，出現警告
loginBtn.addEventListener("click",function(){
    if(! (loginEmail.value && loginPassword.value)){
        alert("欄位未填");
        return;
    }
    login();
})


function login(){
    axios.post(`${_url}login`,{
        "email":loginEmail.value,
        "password":loginPassword.value
    })
    .then(function(res){
        alert("登入成功");
        //判斷身份別，若是admin為管理者，會進入後台 (role由手動修改db.json加入)
        //同時依照身份，admin或user，將token紀錄下來，在跳轉網址顯示頁面時會檢查(後台網址、景點列表網址)
        if(res.data.user.role==="admin"){
            localStorage.setItem("adminToken",res.data.accessToken);
            window.location.href ="admin-page.html";
        }else{
            localStorage.setItem("userToken",res.data.accessToken);
            localStorage.setItem("userId",res.data.user.id);
            window.location.href ="attractionList.html";
        }
        
    })
    .catch(function(err){
        console.log(err);
    })
}
