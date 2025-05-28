
        const games = {
            zzz: {
                targetDate: new Date('2024-07-01T00:00:00').getTime(),
                launchDate: new Date().getTime(),
                eventTitle: 'Version Update Release',
                eventDescription: '',
                name: 'Zenless Zone Zero'
            },
            hsr: {
                targetDate: new Date('2024-08-01T00:00:00').getTime(),
                launchDate: new Date().getTime(),
                eventTitle: 'Version Update Release',
                eventDescription: '',
                name: 'Honkai Star Rail'
            },
            ww: {
                targetDate: new Date('2024-09-01T00:00:00').getTime(),
                launchDate: new Date().getTime(),
                eventTitle: 'Version Update Release',
                eventDescription: '',
                name: 'Wuthering Waves'
            }
        };
        
        let currentGame = 'zzz';
        
        // Navigation functions
        function scrollToSection(gameId) {
            const element = document.getElementById(gameId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
        
        // Modal functions
        function openCountdownModal(gameId) {
            currentGame = gameId;
            const game = games[gameId];
            
            // Update modal title
            document.getElementById('modal-title').textContent = `Set ${game.name} Countdown`;
            
            // Set current values in modal
            const targetDateObj = new Date(game.targetDate);
            const datetimeString = targetDateObj.toISOString().slice(0, 16);
            
            document.getElementById('target-datetime').value = datetimeString;
            document.getElementById('event-title').value = game.eventTitle;
            document.getElementById('event-description').value = game.eventDescription;
            
            updateCurrentTargetInfo();
            document.getElementById('countdown_modal').showModal();
        }
        
        function updateCurrentTargetInfo() {
            const game = games[currentGame];
            const targetDateObj = new Date(game.targetDate);
            
            const day = targetDateObj.getDate().toString().padStart(2, '0');
            const month = (targetDateObj.getMonth() + 1).toString().padStart(2, '0');
            const year = targetDateObj.getFullYear();
            const hour = targetDateObj.getHours().toString().padStart(2, '0');
            const minute = targetDateObj.getMinutes().toString().padStart(2, '0');
            const second = targetDateObj.getSeconds().toString().padStart(2, '0');
            
            const formattedDateTime = `${day}/${month}/${year} ${hour}:${minute}:${second}`;
            
            document.getElementById('current-target-info').textContent = formattedDateTime;
        }
        
        function updateCountdown() {
            const now = new Date().getTime();
            
            Object.keys(games).forEach(gameId => {
                const game = games[gameId];
                const timeLeft = game.targetDate - now;
                
                // Update countdown numbers
                if (timeLeft > 0) {
                    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                    
                    document.getElementById(`${gameId}-days`).textContent = days.toString().padStart(2, '0');
                    document.getElementById(`${gameId}-hours`).textContent = hours.toString().padStart(2, '0');
                    document.getElementById(`${gameId}-minutes`).textContent = minutes.toString().padStart(2, '0');
                    document.getElementById(`${gameId}-seconds`).textContent = seconds.toString().padStart(2, '0');
                } else {
                    document.getElementById(`${gameId}-days`).textContent = '00';
                    document.getElementById(`${gameId}-hours`).textContent = '00';
                    document.getElementById(`${gameId}-minutes`).textContent = '00';
                    document.getElementById(`${gameId}-seconds`).textContent = '00';
                }
                
                // Update progress bar
                const totalTime = game.targetDate - game.launchDate;
                const timeElapsed = now - game.launchDate;
                let progress = Math.max(0, Math.min(100, (timeElapsed / totalTime) * 100));
                
                // If countdown is finished, set progress to 100%
                if (timeLeft <= 0) {
                    progress = 100;
                }
                
                document.getElementById(`${gameId}-countdown-progress`).value = progress;
                document.getElementById(`${gameId}-progress-text`).textContent = `Progress: ${Math.round(progress)}%`;
                document.getElementById(`${gameId}-target-date-display`).textContent = game.eventTitle;
            });
        }
        
        function setCountdown() {
            const datetimeInput = document.getElementById('target-datetime').value;
            const titleInput = document.getElementById('event-title').value;
            const descriptionInput = document.getElementById('event-description').value;
            
            if (!datetimeInput) {
                alert('กรุณาเลือกวันที่และเวลาที่ต้องการนับถอยหลัง!');
                return;
            }
            
            // Create target date from datetime-local input
            const targetDateObj = new Date(datetimeInput);
            
            // Check if the date is valid
            if (isNaN(targetDateObj.getTime())) {
                alert('วันที่และเวลาที่เลือกไม่ถูกต้อง!');
                return;
            }
            
            // Reset launch date to current time for new countdown
            const now = new Date().getTime();
            games[currentGame].launchDate = now;
            games[currentGame].targetDate = targetDateObj.getTime();
            games[currentGame].eventTitle = titleInput || 'Version Update Release';
            games[currentGame].eventDescription = descriptionInput;
            
            // Validate that target date is in the future
            if (games[currentGame].targetDate <= now) {
                alert('กรุณาเลือกวันที่และเวลาในอนาคต!');
                return;
            }
            
            // Update display
            updateCountdown();
            
            // Close modal
            document.getElementById('countdown_modal').close();
            
            // Show success message
            showToast(`อัปเดตเวลานับถอยหลัง ${games[currentGame].name} เรียบร้อยแล้ว!`, 'success');
        }
        
        function showToast(message, type = 'info') {
            const toast = document.createElement('div');
            toast.className = `alert alert-${type} fixed top-20 right-4 w-auto z-50 shadow-lg`;
            toast.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>${message}</span>
            `;
            
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.remove();
            }, 3000);
        }
        
        function updateCurrentTime() {
            const now = new Date();
            const timeString = now.toLocaleTimeString('th-TH', { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
            });
            document.getElementById('current-time').textContent = timeString;
        }
        
        // Initialize on page load
        function initializePage() {
            // Set initial launch dates to current time
            const now = new Date().getTime();
            Object.keys(games).forEach(gameId => {
                games[gameId].launchDate = now;
            });
            
            updateCountdown();
            updateCurrentTime();
        }
        
        // Start all updates
        initializePage();
        setInterval(updateCountdown, 1000);
        setInterval(updateCurrentTime, 1000);
        
        // Particle animation
        function createRandomParticle() {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 8 + 's';
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 8000);
        }
        
        setInterval(createRandomParticle, 3000);
        
        // Button ripple effect
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', function() {
                const ripple = document.createElement('span');
                ripple.classList.add('absolute', 'bg-purple-300', 'opacity-25', 'rounded-full', 'animate-ping');
                ripple.style.width = ripple.style.height = '10px';
                ripple.style.left = '50%';
                ripple.style.top = '50%';
                ripple.style.transform = 'translate(-50%, -50%)';
                
                this.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            });
        });
        
        // Smooth scrolling for navbar links
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
