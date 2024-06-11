const sticky = document.querySelector(".sticky");
window.onload = () => {
    let url = window.location.pathname.split("/")[1];
    const e = sticky.querySelector("#" + url);
    if (e) {
        sticky.removeChild(e);
    }
};

sticky.addEventListener("mouseover", () => {
    [...sticky.querySelectorAll(".link")].forEach((e, i) => {
        e.classList.remove("hidden");
        e.style.transform = `translateY(-${(i + 1) * 50}px)`;
    });
});

sticky.addEventListener("mouseout", () => {
    [...sticky.querySelectorAll(".link")].forEach((e) => {
        e.classList.add("hidden");
        e.style.transform = "translateY(0)";
    });
});
