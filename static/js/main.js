
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.usage-step, .qna-box');
    const curtain = document.querySelector('.curtain');

    let observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    let observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    elements.forEach(element => {
        observer.observe(element);
    });

    window.addEventListener('scroll', function() {
        let scrollPosition = window.scrollY;
        let windowHeight = window.innerHeight;
        let opacity = 1 - (scrollPosition / (windowHeight * 0.6)); // Adjust the multiplier for faster/slower fade
        curtain.style.opacity = Math.max(0, Math.min(1, opacity)); // Ensure opacity stays between 0 and 1
    });
    const koreanButton = document.getElementById('btn-korean');
    const englishButton = document.getElementById('btn-english');

    koreanButton.addEventListener('click', function() {
        document.querySelectorAll('.lang').forEach(function(element) {
            element.innerText = element.getAttribute('data-ko');
        });
    });

    englishButton.addEventListener('click', function() {
        document.querySelectorAll('.lang').forEach(function(element) {
            element.innerText = element.getAttribute('data-en');
        });
    });
});

const language = document.querySelector(".toggle")
language.addEventListener("click",()=>{
    console.log("click");
    language.classList.toggle("kor")
    if(language.classList.contains("kor")){
        language.textContent = "Eng"
        document.querySelectorAll('.lang').forEach(function(element) {
            element.innerText = element.getAttribute('data-ko');
        });
    }
    else{
        language.textContent = "한글"
        document.querySelectorAll('.lang').forEach(function(element) {
            element.innerText = element.getAttribute('data-en');
        });
    }
})
