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
});
