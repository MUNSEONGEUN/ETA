function showText(language) {
    const englishText = `
        <h2>About us</h2>
        <p>Our project is a program that translates the American sign language ASL into text, and is a 'Children's Sign Language Education Program' that helps children. Using this program, we designed it so that children can educate the deaf about sign language through games, translation functions, and watching sign language videos.</p>
        <h3>What's ASL?</h3>
        <p>American Sign Language (ASL) is a sign language that is spoken predominantly among deaf communities in the United States and Canada. ASL has its own grammar and vocabulary, and unlike spoken languages, it conveys meaning by using the shapes, positions, movements, and facial expressions of hands. ASL is a language independent of English and is used as a major means of communication among many deaf people in the United States and Canada. </p>
        <h3>Why Baby Sign?</h3>
        <p>Learning sign language from an early age provides several advantages for both deaf and non-deaf children. These advantages include language development, IQ proficiency, improved social skills, and parental ties. In addition, it is greatly helpful in promoting understanding and cooperation in communication between deaf and non-deaf children.</p>
    `;

    const koreanText = `
        <h2>About Us</h2>
        <p>저희 프로젝트는 미국 공용 수어 ASL 동작을 텍스트로 번역하는 프로그램으로, 유아부터 어린이들에게 도움이 되는 '어린이 수화 교육 프로그램'입니다. 우리는 이 프로그램을 이용하여 아이들이 게임과 번역기능, 수화 영상 시청들을 통해 청각장애인의 수화를 교육 할 수 있도록 이 프로그램을 설계했습니다.</p>
        <h3>ASL이란 무엇인가요?</h3>
        <p>ASL(American Sign Language)은 미국과 캐나다의 농인 커뮤니티에서 주로 사용되는 수어입니다. ASL은 고유한 문법과 어휘를 가지고 있으며, 음성 언어와는 달리 손의 모양, 위치, 움직임, 그리고 얼굴 표정 등을 사용하여 의미를 전달합니다. ASL은 영어와는 독립적인 언어로, 미국과 캐나다의 많은 농인들 사이에서 주요 의사소통 수단으로 사용됩니다. </p>
        <h3>아이들에게 수어의 영향</h3>
        <p>어린 시절부터 수어를 배우는 것은 농인과 비농인 모두에게 여러 가지 장점을 제공합니다. 이러한 장점들은 언어 발달, IQ 능력, 사회성 향상, 부모와 유대 관계 형성. 또, 농인과 비농인 아이들 간의 의사소통의 이해와 협력을 증진시키는데 큰 도움이 됩니다.</p>
        `;

    document.getElementById('content').innerHTML = language === 'english' ? englishText : koreanText;
};

document.addEventListener('DOMContentLoaded', function() {
    showText('english');
});
