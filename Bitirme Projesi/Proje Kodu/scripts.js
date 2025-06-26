// Global değişkenler
let currentScore = 0;
let currentScreen = 'intro-screen';
let completedSteps = {
    orderView: false,
    manageOrders: false,
    errorView: false,
    integrationMessage: false,
    confirmation: false,
    workCenterPod: false
};

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    initializeDragAndDrop();
    updateScoreDisplays();
});

// Eğitimi başlat
function startTraining() {
    showScreen('main-screen');
    updateScoreDisplays();
}

// Ekran değiştir
function showScreen(screenId) {
    // Tüm ekranları gizle
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Belirtilen ekranı göster
    document.getElementById(screenId).classList.add('active');
    currentScreen = screenId;
    
    // Final score güncelle
    if (screenId === 'congratulations-screen') {
        updateFinalScore();
    }
    
    // Geri butonu ekle (ana ekran ve tanıtım hariç)
    addBackButton();
}

// Final score'u güncelle
function updateFinalScore() {
    const finalScoreElement = document.getElementById('final-score');
    if (finalScoreElement) {
        finalScoreElement.textContent = currentScore;
    }
}

// Geri butonu ekle
function addBackButton() {
    // Önce varolan geri butonunu kaldır
    const existingBackBtn = document.querySelector('.back-btn');
    if (existingBackBtn) {
        existingBackBtn.remove();
    }
    
    if (currentScreen !== 'intro-screen' && currentScreen !== 'main-screen' && currentScreen !== 'congratulations-screen') {
        const backBtn = document.createElement('button');
        backBtn.className = 'back-btn';
        backBtn.textContent = '← Geri';
        backBtn.onclick = () => showScreen('main-screen');
        document.body.appendChild(backBtn);
    }
}

// Ana ekranda seçenek seç
function selectOption(option) {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.add('active');
    
    // Menü öğelerini güncelle
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('selected');
        if (item.dataset.screen === option) {
            item.classList.add('selected');
        }
    });
    
    // Kart seçimini göster
    document.querySelectorAll('.option-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // İlgili ekrana git
    setTimeout(() => {
        switch(option) {
            case 'order-view':
                showScreen('order-view-screen');
                break;
            case 'error-view':
                showScreen('error-view-screen');
                break;
            case 'confirmation':
                showScreen('confirmation-screen');
                break;
        }
    }, 300);
}

// Puan güncelle
function updateScore(points) {
    currentScore += points;
    updateScoreDisplays();
    
    // Pozitif puan için yeşil animasyon
    if (points > 0) {
        showScoreAnimation('+' + points, 'green');
    } else {
        showScoreAnimation(points.toString(), 'red');
    }
}

// Puan animasyonu göster
function showScoreAnimation(text, color) {
    const animation = document.createElement('div');
    animation.style.cssText = `
        position: fixed;
        top: 60px;
        right: 20px;
        color: ${color};
        font-size: 20px;
        font-weight: bold;
        z-index: 1001;
        animation: scoreAnimation 2s ease-out forwards;
    `;
    animation.textContent = text;
    
    // CSS animasyonu ekle
    if (!document.querySelector('#score-animation-style')) {
        const style = document.createElement('style');
        style.id = 'score-animation-style';
        style.textContent = `
            @keyframes scoreAnimation {
                0% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-30px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(animation);
    setTimeout(() => animation.remove(), 2000);
}

// Tüm puan göstergelerini güncelle
function updateScoreDisplays() {
    const scoreElements = document.querySelectorAll('[id^="score"]');
    scoreElements.forEach(element => {
        element.textContent = currentScore;
    });
}

// Drag and Drop işlevselliği
function initializeDragAndDrop() {
    // Sürüklenebilir öğeler
    document.addEventListener('dragstart', function(e) {
        if (e.target.classList.contains('draggable-option')) {
            e.dataTransfer.setData('text/plain', e.target.dataset.value);
            e.dataTransfer.setData('text/html', e.target.outerHTML);
            e.target.style.opacity = '0.5';
        }
    });
    
    document.addEventListener('dragend', function(e) {
        if (e.target.classList.contains('draggable-option')) {
            e.target.style.opacity = '1';
        }
    });
    
    // Drop alanları
    document.addEventListener('dragover', function(e) {
        e.preventDefault();
        if (e.target.closest('.search-box, .input-drop-zone, .selection-area')) {
            e.target.closest('.search-box, .input-drop-zone, .selection-area').classList.add('drag-over');
        }
    });
    
    document.addEventListener('dragleave', function(e) {
        if (e.target.closest('.search-box, .input-drop-zone, .selection-area')) {
            e.target.closest('.search-box, .input-drop-zone, .selection-area').classList.remove('drag-over');
        }
    });
    
    document.addEventListener('drop', function(e) {
        e.preventDefault();
        const dropZone = e.target.closest('.search-box, .input-drop-zone, .selection-area');
        if (dropZone) {
            dropZone.classList.remove('drag-over');
            const data = e.dataTransfer.getData('text/plain');
            handleDrop(dropZone, data, e);
        }
    });
}

// Drop işlemini yönet
function handleDrop(dropZone, data, event) {
    const draggedElement = document.querySelector(`[data-value="${data}"]`);
    
    // Sipariş görüntüleme ekranı
    if (currentScreen === 'order-view-screen' && dropZone.id === 'search-drop-zone') {
        if (data === 'manage-orders') {
            updateScore(5);
            draggedElement.classList.add('correct');
            setTimeout(() => {
                completedSteps.orderView = true;
                showScreen('manage-orders-screen');
            }, 1000);
        } else {
            updateScore(-2);
            draggedElement.classList.add('incorrect');
            setTimeout(() => {
                draggedElement.classList.remove('incorrect');
            }, 1000);
        }
    }
    
    // Manage Orders ekranı
    else if (currentScreen === 'manage-orders-screen') {
        const field = dropZone.dataset.field;
        const input = dropZone.querySelector('input');
        
        if (field === 'search' && data === '17258615') {
            input.value = data;
            updateScore(5);
            draggedElement.classList.add('correct');
            checkManageOrdersCompletion();
        } else if (field === 'work-center' && data === '1558447-A') {
            input.value = data;
            updateScore(5);
            draggedElement.classList.add('correct');
            checkManageOrdersCompletion();
        } else if (field === 'search' || field === 'work-center') {
            updateScore(-2);
            draggedElement.classList.add('incorrect');
            setTimeout(() => {
                draggedElement.classList.remove('incorrect');
            }, 1000);
        }
    }
    
    // Hata görüntüleme ekranı
    else if (currentScreen === 'error-view-screen' && dropZone.id === 'error-search-drop-zone') {
        if (data === 'integration-message') {
            updateScore(5);
            draggedElement.classList.add('correct');
            setTimeout(() => {
                completedSteps.errorView = true;
                showScreen('integration-message-screen');
            }, 1000);
        } else {
            updateScore(-2);
            draggedElement.classList.add('incorrect');
            setTimeout(() => {
                draggedElement.classList.remove('incorrect');
            }, 1000);
        }
    }
    
    // Integration Message Dashboard
    else if (currentScreen === 'integration-message-screen') {
        const field = dropZone.dataset.field;
        const input = dropZone.querySelector('input');
        
        if (field === 'plant' && data === 'TR10') {
            input.value = data;
            updateScore(5);
            draggedElement.classList.add('correct');
            checkIntegrationCompletion();
        } else if (field === 'search' && data === '17584741') {
            input.value = data;
            updateScore(5);
            draggedElement.classList.add('correct');
            checkIntegrationCompletion();
        } else if (field === 'status' && (data === 'failed' || data === 'completed')) {
            input.value = data;
            updateScore(5);
            draggedElement.classList.add('correct');
            checkIntegrationCompletion();
        } else if (field === 'plant' || field === 'search' || field === 'status') {
            updateScore(-2);
            draggedElement.classList.add('incorrect');
            setTimeout(() => {
                draggedElement.classList.remove('incorrect');
            }, 1000);
        }
    }
    
    // Teyit verme ekranı
    else if (currentScreen === 'confirmation-screen' && dropZone.id === 'confirmation-selection') {
        if (data === 'work-center-pod') {
            dropZone.textContent = 'Work Center POD Seçildi';
            dropZone.classList.add('has-selection');
            updateScore(5);
            draggedElement.classList.add('correct');
            setTimeout(() => {
                completedSteps.confirmation = true;
                showScreen('work-center-pod-screen');
            }, 1000);
        } else {
            updateScore(-2);
            draggedElement.classList.add('incorrect');
            setTimeout(() => {
                draggedElement.classList.remove('incorrect');
            }, 1000);
        }
    }
    
    // Work Center POD ekranı
    else if (currentScreen === 'work-center-pod-screen') {
        const field = dropZone.dataset.field;
        const input = dropZone.querySelector('input');
        
        if (field === 'sfc' && data === '17836915') {
            input.value = data;
            updateScore(5);
            draggedElement.classList.add('correct');
            checkPODCompletion();
        } else if (field === 'work-center' && data === '1724100-A') {
            input.value = data;
            updateScore(5);
            draggedElement.classList.add('correct');
            checkPODCompletion();
        } else if (field === 'resource' && data === '1724100-A_17400025') {
            input.value = data;
            updateScore(5);
            draggedElement.classList.add('correct');
            checkPODCompletion();
        } else if (field === 'sfc' || field === 'work-center' || field === 'resource') {
            updateScore(-2);
            draggedElement.classList.add('incorrect');
            setTimeout(() => {
                draggedElement.classList.remove('incorrect');
            }, 1000);
        }
    }
}

// Manage Orders tamamlanma kontrolü
function checkManageOrdersCompletion() {
    const searchInput = document.querySelector('#manage-orders-screen [data-field="search"] input');
    const workCenterInput = document.querySelector('#manage-orders-screen [data-field="work-center"] input');
    
    if (searchInput.value === '17258615' && workCenterInput.value === '1558447-A') {
        completedSteps.manageOrders = true;
        setTimeout(() => {
            showCompletionMessage('Sipariş Yönetimi modülü tamamlandı!');
            // Modülü tamamlandı olarak işaretle
            markModuleAsCompleted('order-view');
            // Ana sayfaya dön
            setTimeout(() => {
                showScreen('main-screen');
                // Tüm modüllerin tamamlanıp tamamlanmadığını kontrol et
                checkAllCompletion();
            }, 2000);
        }, 1500);
    }
}

// Integration Message tamamlanma kontrolü
function checkIntegrationCompletion() {
    const searchInput = document.querySelector('#integration-message-screen [data-field="search"] input');
    const plantInput = document.querySelector('#integration-message-screen [data-field="plant"] input');
    const statusInput = document.querySelector('#integration-message-screen [data-field="status"] input');
    
    if (searchInput.value === '17584741' && plantInput.value === 'TR10' && 
        (statusInput.value === 'failed' || statusInput.value === 'completed')) {
        completedSteps.integrationMessage = true;
        setTimeout(() => {
            showCompletionMessage('Hata Takibi modülü tamamlandı!');
            // Modülü tamamlandı olarak işaretle
            markModuleAsCompleted('error-view');
            // Ana sayfaya dön
            setTimeout(() => {
                showScreen('main-screen');
                // Tüm modüllerin tamamlanıp tamamlanmadığını kontrol et
                checkAllCompletion();
            }, 2000);
        }, 1500);
    }
}

// POD tamamlanma kontrolü
function checkPODCompletion() {
    const sfcInput = document.querySelector('#work-center-pod-screen [data-field="sfc"] input');
    const workCenterInput = document.querySelector('#work-center-pod-screen [data-field="work-center"] input');
    const resourceInput = document.querySelector('#work-center-pod-screen [data-field="resource"] input');
    
    if (sfcInput.value === '17836915' && workCenterInput.value === '1724100-A' && 
        resourceInput.value === '1724100-A_17400025') {
        completedSteps.workCenterPod = true;
        setTimeout(() => {
            showCompletionMessage('Teyit İşlemleri modülü tamamlandı!');
            // Modülü tamamlandı olarak işaretle
            markModuleAsCompleted('confirmation');
            // Ana sayfaya dön
            setTimeout(() => {
                showScreen('main-screen');
                // Tüm modüllerin tamamlanıp tamamlanmadığını kontrol et
                checkAllCompletion();
            }, 2000);
        }, 1500);
    }
}

// Tüm bölümlerin tamamlanma kontrolü
function checkAllCompletion() {
    console.log('Tamamlanan adımları kontrol ediliyor:', completedSteps);
    console.log('Mevcut puan:', currentScore);
    
    // Ana bölümlerin tamamlanıp tamamlanmadığını kontrol et
    const mainSectionsCompleted = 
        completedSteps.manageOrders &&
        completedSteps.integrationMessage &&
        completedSteps.workCenterPod;
    
    console.log('Tüm ana bölümler tamamlandı mı?', mainSectionsCompleted);
    
    if (mainSectionsCompleted) {
        // 3 saniye bekle ve sonra tebrikler ekranını göster
        setTimeout(() => {
            showFinalCompletionMessage();
        }, 3000);
    }
}

// Final tamamlama mesajı göster (tüm modüller tamamlandığında)
function showFinalCompletionMessage() {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, var(--light-blue), var(--primary-blue));
        color: white;
        padding: 40px 50px;
        border-radius: 20px;
        font-size: 20px;
        font-weight: bold;
        z-index: 1002;
        box-shadow: 0 10px 40px rgba(0, 102, 204, 0.4);
        text-align: center;
        animation: finalMessageAnimation 4s ease forwards;
        border: 3px solid #ffffff;
    `;
    
    messageDiv.innerHTML = `
        <div style="margin-bottom: 20px;">
            <div style="font-size: 48px; margin-bottom: 15px;">⏳</div>
            <div style="font-size: 24px; margin-bottom: 10px;">EĞİTİM TAMAMLANDI!</div>
            <div style="font-size: 18px; margin-bottom: 20px;">Sonuç sayfasına yönlendiriliyorsunuz...</div>
        </div>
    `;
    
    // Animasyon CSS'i ekle
    if (!document.querySelector('#final-message-animation-style')) {
        const style = document.createElement('style');
        style.id = 'final-message-animation-style';
        style.textContent = `
            @keyframes finalMessageAnimation {
                0% { 
                    opacity: 0; 
                    transform: translate(-50%, -50%) scale(0.3) rotate(-10deg); 
                }
                20% { 
                    opacity: 1; 
                    transform: translate(-50%, -50%) scale(1.1) rotate(2deg); 
                }
                30% { 
                    transform: translate(-50%, -50%) scale(0.95) rotate(-1deg); 
                }
                40% { 
                    transform: translate(-50%, -50%) scale(1.02) rotate(0.5deg); 
                }
                50% { 
                    transform: translate(-50%, -50%) scale(1) rotate(0deg); 
                }
                90% { 
                    opacity: 1; 
                    transform: translate(-50%, -50%) scale(1) rotate(0deg); 
                }
                100% { 
                    opacity: 0; 
                    transform: translate(-50%, -50%) scale(0.8) rotate(0deg); 
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(messageDiv);
    
    // 4 saniye sonra mesajı kaldır ve tebrikler ekranına git
    setTimeout(() => {
        messageDiv.remove();
        showScreen('congratulations-screen');
    }, 4000);
}

// Tamamlanma mesajı göster
function showCompletionMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #28a745;
        color: white;
        padding: 20px 40px;
        border-radius: 10px;
        font-size: 18px;
        font-weight: bold;
        z-index: 1002;
        box-shadow: 0 5px 20px rgba(40, 167, 69, 0.3);
        animation: messageAnimation 3s ease forwards;
    `;
    messageDiv.textContent = message;
    
    // Animasyon CSS'i ekle
    if (!document.querySelector('#message-animation-style')) {
        const style = document.createElement('style');
        style.id = 'message-animation-style';
        style.textContent = `
            @keyframes messageAnimation {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 3000);
}

// Arama butonları
function searchOrders() {
    showCompletionMessage('Arama işlemi gerçekleştirildi!');
}

function searchIntegration() {
    showCompletionMessage('Integration mesajları arandı!');
}

function searchPOD() {
    showCompletionMessage('POD araması tamamlandı!');
}

// Eğitimi yeniden başlat
function restartTraining() {
    currentScore = 0;
    completedSteps = {
        orderView: false,
        manageOrders: false,
        errorView: false,
        integrationMessage: false,
        confirmation: false,
        workCenterPod: false
    };
    
    // Tüm input alanlarını temizle
    document.querySelectorAll('input[type="text"]').forEach(input => {
        if (!input.placeholder.includes('Arama') && !input.placeholder.includes('Search')) {
            input.value = '';
        }
    });
    
    // Tüm seçim alanlarını sıfırla
    document.querySelectorAll('.selection-area').forEach(area => {
        area.textContent = 'Seçiminizi buraya sürükleyin';
        area.classList.remove('has-selection');
    });
    
    // Tüm drag-over sınıflarını kaldır
    document.querySelectorAll('.drag-over').forEach(element => {
        element.classList.remove('drag-over');
    });
    
    // Tüm doğru/yanlış sınıflarını kaldır
    document.querySelectorAll('.correct, .incorrect').forEach(element => {
        element.classList.remove('correct', 'incorrect');
    });
    
    // Tamamlanan modül işaretlerini kaldır
    document.querySelectorAll('.completed').forEach(element => {
        element.classList.remove('completed');
    });
    
    // Sidebar'ı kapat
    document.getElementById('sidebar').classList.remove('active');
    
    // Geri butonunu kaldır
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.remove();
    }
    
    updateScoreDisplays();
    showScreen('intro-screen');
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // ESC tuşu ile ana ekrana dön
    if (e.key === 'Escape' && currentScreen !== 'intro-screen' && currentScreen !== 'congratulations-screen') {
        showScreen('main-screen');
    }
    
    // R tuşu ile yeniden başlat (Ctrl+R)
    if (e.ctrlKey && e.key === 'r' && currentScreen === 'congratulations-screen') {
        e.preventDefault();
        restartTraining();
    }
});

// Sayfa yenilenme uyarısı
window.addEventListener('beforeunload', function(e) {
    if (currentScore > 0 && currentScreen !== 'congratulations-screen') {
        e.preventDefault();
        e.returnValue = 'Eğitim devam ediyor. Sayfayı yenilemek istediğinizden emin misiniz?';
        return e.returnValue;
    }
});

// Performans optimizasyonu için debounce fonksiyonu
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Resize olayını optimize et
const optimizedResize = debounce(function() {
    // Mobil uyumluluk için yeniden boyutlandırma işlemleri
    if (window.innerWidth <= 768) {
        document.body.classList.add('mobile');
    } else {
        document.body.classList.remove('mobile');
    }
}, 250);

window.addEventListener('resize', optimizedResize);

// Sayfa yüklendiğinde mobil kontrolü
if (window.innerWidth <= 768) {
    document.body.classList.add('mobile');
}

// Touch events for mobile drag and drop
let touchItem = null;
let touchOffset = { x: 0, y: 0 };

document.addEventListener('touchstart', function(e) {
    if (e.target.classList.contains('draggable-option')) {
        touchItem = e.target;
        const touch = e.touches[0];
        const rect = touchItem.getBoundingClientRect();
        touchOffset.x = touch.clientX - rect.left;
        touchOffset.y = touch.clientY - rect.top;
        touchItem.style.opacity = '0.5';
        e.preventDefault();
    }
});

document.addEventListener('touchmove', function(e) {
    if (touchItem) {
        const touch = e.touches[0];
        touchItem.style.position = 'fixed';
        touchItem.style.left = (touch.clientX - touchOffset.x) + 'px';
        touchItem.style.top = (touch.clientY - touchOffset.y) + 'px';
        touchItem.style.zIndex = '1000';
        e.preventDefault();
    }
});

document.addEventListener('touchend', function(e) {
    if (touchItem) {
        const touch = e.changedTouches[0];
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        const dropZone = elementBelow ? elementBelow.closest('.search-box, .input-drop-zone, .selection-area') : null;
        
        if (dropZone) {
            const data = touchItem.dataset.value;
            handleDrop(dropZone, data, e);
        }
        
        // Reset item position
        touchItem.style.position = '';
        touchItem.style.left = '';
        touchItem.style.top = '';
        touchItem.style.zIndex = '';
        touchItem.style.opacity = '1';
        touchItem = null;
    }
});

// Accessibility improvements
document.addEventListener('keydown', function(e) {
    // Tab navigation for draggable items
    if (e.key === 'Tab') {
        const focusedElement = document.activeElement;
        if (focusedElement && focusedElement.classList.contains('draggable-option')) {
            // Space or Enter to "pick up" item
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                // Implement keyboard drag and drop logic here
            }
        }
    }
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('Bir hata oluştu:', e.error);
    // Kullanıcıya hata mesajı göster
    showCompletionMessage('Bir hata oluştu. Lütfen sayfayı yenileyin.');
});

// Tamamlanan modülleri işaretle
function markModuleAsCompleted(moduleType) {
    // Sidebar menü öğesini işaretle
    const menuItem = document.querySelector(`[data-screen="${moduleType}"]`);
    if (menuItem) {
        menuItem.classList.add('completed');
    }
    
    // Ana ekrandaki kart öğesini işaretle
    const optionCard = document.querySelector(`[onclick="selectOption('${moduleType}')"]`);
    if (optionCard) {
        optionCard.classList.add('completed');
    }
}

// Modül tamamlandığında çağrılacak fonksiyon
function onModuleCompleted(moduleType) {
    markModuleAsCompleted(moduleType);
    updateProgressIndicator();
}

// İlerleme göstergesini güncelle
function updateProgressIndicator() {
    const totalModules = 3;
    const completedModules = Object.values(completedSteps).filter(step => step).length / 2; // Her modülün 2 adımı var
    const progressPercentage = Math.round((completedModules / totalModules) * 100);
    
    // Progress bar ekleyebilirsiniz
    console.log(`İlerleme: %${progressPercentage}`);
}