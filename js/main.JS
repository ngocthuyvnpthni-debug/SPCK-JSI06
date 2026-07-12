const player = document.getElementById("videoPlayer") ;
const video = document.getElementById("video");
const closeBtn = document.querySelector(".close-btn");

document.querySelectorAll(".play-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const videoSrc = btn.dataset.video;
        video.src = videoSrc;
        player.classList.add("active");
        video.play();
    });
});

closeBtn.addEventListener("click", () => {
    video.pause();
    video.src = "";
    player.classList.remove("active");
});
const navLinks = document.querySelectorAll('.nav-link');
const tabs = document.querySelectorAll('.tab-content');

navLinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();

        const tabId = link.dataset.tab;

        
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        
        tabs.forEach(tab => tab.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');

        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

const userAvatar = document.getElementById('userAvatar');
const userDropdown = document.getElementById('userDropdown');

userAvatar.addEventListener('click', (e) => {
    e.stopPropagation();
    userDropdown.classList.toggle('show');
});


document.addEventListener('click', () => {
    userDropdown.classList.remove('show');
});


const openSettingsBtn = document.getElementById('openSettings');
const settingsModal = document.getElementById('settingsModal');
const closeSettingsBtn = document.getElementById('closeSettings');

openSettingsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    settingsModal.classList.add('active');
    userDropdown.classList.remove('show'); 
});

closeSettingsBtn.addEventListener('click', () => {
    settingsModal.classList.remove('active');
});



const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
 
    window.location.href = 'sign-in.html'; 
});



const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const settingsMsg = document.getElementById('settingsMsg');

saveSettingsBtn.addEventListener('click', () => {
   
    const newName = document.getElementById('editName').value;
    const newPhone = document.getElementById('editPhone').value;
    const newPass = document.getElementById('editPass').value;

  
    console.log("Đã lưu thông tin:", { newName, newPhone, newPass });

  
    settingsMsg.innerText = "Cập nhật thành công!";
    settingsMsg.style.color = "#4ade80";

   
    setTimeout(() => {
        settingsModal.classList.remove('active');
        settingsMsg.innerText = "";
    }, 1500);
});

window.addEventListener('DOMContentLoaded', () => {
   
    const loggedInUser = localStorage.getItem('currentUserEmail');
    
    const nameDisplay = document.getElementById('usernameDisplay');
    if (loggedInUser) {
        nameDisplay.innerText = loggedInUser;
    }
});