let tabSwitchCount = 0;
let originalScore = 100; // Điểm ban đầu
let isExamLocked = false;

document.addEventListener('visibilitychange', function() {
    if (document.hidden && !isExamLocked) {
        tabSwitchCount++;
        handleTabSwitch();
    }
});

function handleTabSwitch() {
    switch(tabSwitchCount) {
        case 1:
            // Giảm 25% điểm
            originalScore *= 0.75;
            alert('Cảnh báo: Bạn đã chuyển tab lần 1. Điểm của bạn bị trừ 25%');
            break;
        case 2:
            // Giảm 50% điểm
            originalScore *= 0.5;
            alert('Cảnh báo: Bạn đã chuyển tab lần 2. Điểm của bạn bị trừ 50%');
            break;
        case 3:
            // Khóa bài thi
            isExamLocked = true;
            lockExam();
            break;
    }
}

function lockExam() {
    // Khóa form thi
    const examForm = document.querySelector('#exam-form');
    if (examForm) {
        examForm.innerHTML = '<h2 class="text-danger">Bài thi đã bị khóa do vi phạm quy định!</h2>';
    }
    
    // Gửi thông báo đến server
    fetch('/api/lock-exam', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            reason: 'Tab switch violation',
            switchCount: tabSwitchCount
        })
    });

    alert('Bài thi đã bị khóa do bạn đã chuyển tab 3 lần!');
}

// Hàm lấy điểm hiện tại
function getCurrentScore() {
    return originalScore;
}

// Hàm kiểm tra trạng thái khóa
function isExamLocked() {
    return isExamLocked;
} 