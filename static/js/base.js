const sticky = document.querySelector(".sticky")
window.onload = ()=>{
    let url = window.location.href
    url = url.substring(url.indexOf(":8000/")+6).split("/")    
    url = url.slice(url.length-2, url.length-1)[0]
    const e = sticky.querySelector("#"+url)
    console.log(url);
    sticky.removeChild(e)
}

sticky.addEventListener("mouseover",()=>{
    // sticky.style.height = "150px";
    
    [...sticky.querySelectorAll(".link")].map(e=>{
        e.classList.remove("hidden")
    })
})

sticky.addEventListener("mouseout",()=>{
    [...sticky.querySelectorAll(".link")].map(e=>{
        // sticky.style.height = "50px"
        e.classList.add("hidden")
    })
})