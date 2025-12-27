document.addEventListener('DOMContentLoaded', () => {
    // --- Simulasi Timer Countdown ---
    function updateTimer(elementId) {
        const now = new Date();
        const target = new Date();
        target.setHours(23, 59, 59);
        
        let diff = target - now;
        if (diff < 0) diff = 0;

        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const display = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        document.getElementById(elementId).innerText = display;
    }

    setInterval(() => {
        updateTimer('timer-sgp');
        updateTimer('timer-hk');
        updateTimer('timer-sdy');
    }, 1000);

    // --- Handle Form Submit (Betting) ---
    const betForm = document.getElementById('betForm');
    const notification = document.getElementById('notification');

    if (betForm) {
        betForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const market = document.getElementById('marketSelect').value;
            const type = document.getElementById('betType').value;
            const number = document.getElementById('betNumber').value;
            const amount = document.getElementById('betAmount').value;

            // Validasi Sederhana
            if (type === '4D' && number.length !== 4) {
                showNotification('Error: Untuk 4D, masukkan 4 angka.', 'red');
                return;
            }
            if (type === '3D' && number.length !== 3) {
                showNotification('Error: Untuk 3D, masukkan 3 angka.', 'red');
                return;
            }
            if (type === '2D' && number.length !== 2) {
                showNotification('Error: Untuk 2D, masukkan 2 angka.', 'red');
                return;
            }

            // Simulasi sukses
            showNotification(`Berhasil! Taruhan ${type} pada ${market} angka ${number} sebesar Rp${amount} telah dipasang.`, '#28a745');
            betForm.reset();
        });
    }

    function showNotification(message, color) {
        if (!notification) return;
        notification.innerText = message;
        notification.style.color = color;
        setTimeout(() => {
            notification.innerText = '';
        }, 5000);
    }

    // --- Simulasi Update Result Otomatis (Dummy) ---
    function generateRandomResult() {
        const tbody = document.getElementById('resultBody');
        if (!tbody) return;

        const markets = ['SINGAPORE', 'HONGKONG', 'SYDNEY'];
        const randomMarket = markets[Math.floor(Math.random() * markets.length)];
        const randomNumber = Math.floor(1000 + Math.random() * 9000); // Random 4 digit
        const today = new Date().toISOString().split('T')[0];

        const newRow = `
            <tr>
                <td>${randomMarket}</td>
                <td>${today}</td>
                <td><span class="winning-number">${randomNumber}</span></td>
            </tr>
        `;
        
        // Tambahkan ke paling atas, batasi 5 baris
        let currentRows = tbody.innerHTML;
        tbody.innerHTML = newRow + currentRows;
        
        if (tbody.rows.length > 5) {
            tbody.deleteRow(5);
        }
    }

    // Tambah result palsu setiap 10 detik
    setInterval(generateRandomResult, 10000);

    // --- Fitur Pendaftaran User (Modal Logic) ---
    const registerModal = document.getElementById('registerModal');
    const openRegisterBtn = document.getElementById('openRegister');
    const closeModalSpan = document.querySelector('.close-modal');
    const registerForm = document.getElementById('registerForm');

    if (openRegisterBtn && registerModal) {
        openRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            registerModal.classList.add('active');
        });

        if (closeModalSpan) {
            closeModalSpan.addEventListener('click', () => {
                registerModal.classList.remove('active');
            });
        }

        window.addEventListener('click', (e) => {
            if (e.target === registerModal) {
                registerModal.classList.remove('active');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('regUsername').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;

            if (password !== confirmPassword) {
                alert('Password dan Konfirmasi Password tidak sama!');
                return;
            }

            if (password.length < 6) {
                 alert('Password minimal 6 karakter!');
                 return;
            }

            // Simulasi Registrasi Sukses
            alert(`Selamat ${username}! Pendaftaran berhasil. Silakan Login.`);
            registerForm.reset();
            registerModal.classList.remove('active');
        });
    }
});