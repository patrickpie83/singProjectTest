let editAttractionTitle=document.querySelector("#editAttractionTitle");
let editAttractionContent=document.querySelector("#editAttractionContent");
let modifyBtn=document.querySelector(".modifyBtn");

const id = location.href.split("=")[1];//把當前網址切割，取[1]的值
const _url = "https://singlepreproject.onrender.com/"; // 設定伺服器網址

//取得路由的內容
axios.get(`${_url}posts/${id}`)
.then(function(response){
     
     editAttractionTitle.value=response.data.attractionTitle;
    
     editAttractionContent.value=response.data.attractionContent;
})

modifyBtn.addEventListener("click",function(){
    if(! (editAttractionTitle.value && editAttractionContent.value)){
        console.log("欄位未填");
        return;
    }
    axios.patch(`${_url}posts/${id}`,{
        "attractionTitle":editAttractionTitle.value,
        "attractionContent":editAttractionContent.value
    })
    alert("修改成功");
    window.location.href="admin-page.html";
})
