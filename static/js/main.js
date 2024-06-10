document.addEventListener('DOMContentLoaded', function() {
    const qnaBoxes = document.querySelectorAll('.qna-box');
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

    qnaBoxes.forEach(box => {
        observer.observe(box);
    });

    window.addEventListener('scroll', function() {
        let scrollPosition = window.scrollY;
        let windowHeight = window.innerHeight;
        let opacity = 1 - (scrollPosition / windowHeight); // Adjusted multiplier for faster fade
        curtain.style.opacity = Math.max(0, Math.min(1, opacity)); // Ensure opacity stays between 0 and 1
    });
});
