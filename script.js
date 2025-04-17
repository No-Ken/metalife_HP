document.addEventListener('DOMContentLoaded', function() {
    // モバイルメニューの制御
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('.header');

    mobileMenuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });

    // スムーズスクロール
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // スクロール時のヘッダー制御
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;
    });

    // フォーム送信処理
    function submitForm(formData) {
        const loading = document.querySelector('.loading');
        const submitButton = document.querySelector('.submit-button');
        
        // ローディング表示
        loading.style.display = 'flex';
        submitButton.disabled = true;
        
        // メール送信のためのURLを生成
        const subject = encodeURIComponent('お問い合わせフォームからのメッセージ');
        const body = encodeURIComponent(
            `お名前: ${formData.name}\n` +
            `メールアドレス: ${formData.email}\n` +
            `お問い合わせ内容:\n${formData.message}`
        );
        
        // メール送信用のURLを開く
        window.location.href = `mailto:k.norisugi@no-k.group?subject=${subject}&body=${body}`;
        
        // ローディング非表示
        loading.style.display = 'none';
        submitButton.disabled = false;
        
        // フォームをリセット
        contactForm.reset();
    }

    // フォームバリデーションの改善
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        const inputs = contactForm.querySelectorAll('input, textarea');
        
        // 入力フィールドのバリデーション
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const errors = [];
            
            // 各フィールドのバリデーション
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });

            if (!isValid) {
                return;
            }

            // フォームデータの取得
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                message: document.getElementById('message').value.trim()
            };

            // フォーム送信
            submitForm(formData);
        });
    }

    // フィールドバリデーション関数
    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (field.id) {
            case 'name':
                if (!value) {
                    errorMessage = 'お名前を入力してください';
                    isValid = false;
                }
                break;
            case 'email':
                if (!value) {
                    errorMessage = 'メールアドレスを入力してください';
                    isValid = false;
                } else if (!isValidEmail(value)) {
                    errorMessage = '有効なメールアドレスを入力してください';
                    isValid = false;
                }
                break;
            case 'message':
                if (!value) {
                    errorMessage = 'お問い合わせ内容を入力してください';
                    isValid = false;
                }
                break;
        }

        // エラーメッセージの表示/非表示
        const errorElement = field.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.remove();
        }

        if (!isValid) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = errorMessage;
            field.parentNode.insertBefore(errorDiv, field.nextSibling);
            field.classList.add('error');
        } else {
            field.classList.remove('error');
        }

        return isValid;
    }

    // メールアドレスのバリデーション
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // アニメーション効果
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.service-card, .mission-content, .contact-form');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.classList.add('animate');
            }
        });
    };

    // スクロールイベントでアニメーションをトリガー
    window.addEventListener('scroll', animateOnScroll);
    // 初期表示時にもアニメーションをチェック
    animateOnScroll();
}); 