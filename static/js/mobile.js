const  title = document.querySelector(".title")
document.addEventListener('DOMContentLoaded', function() {
    const viewwidth = window.innerWidth
    if(viewwidth < 784){
        title.style.display = "none"
    }
});
window.addEventListener("resize", ()=>{
    const viewwidth = window.innerWidth
    if(viewwidth > 784){
        title.style.display = "inline-block"
    }
    else if(viewwidth < 784){
        title.style.display = "none"
    }
})