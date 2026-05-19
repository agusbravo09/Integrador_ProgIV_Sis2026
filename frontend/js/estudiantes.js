
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('contenido-dinamico');
    const texts = document.querySelectorAll('.sidebar-text');
    const toggleIcon = document.getElementById('toggle-icon');

    
    const logoWrapper = document.getElementById('sidebar-logo-wrapper');
    const toggleBtn = document.getElementById('toggle-btn');
    const profileBox = document.getElementById('profile-box');

    
    if (sidebar.classList.contains('w-64')) {

        
        sidebar.classList.remove('w-64');
        sidebar.classList.add('w-20');

        if (mainContent) {
            mainContent.classList.remove('ml-72', 'w-[calc(100%-18rem)]');
            mainContent.classList.add('ml-24', 'w-[calc(100%-6rem)]');
        }

        
        logoWrapper.classList.remove('w-40', 'opacity-100');
        logoWrapper.classList.add('w-0', 'opacity-0');

        
        toggleBtn.classList.remove('right-4');
        toggleBtn.classList.add('right-5');

        
        texts.forEach(text => {
            text.classList.remove('max-w-[200px]', 'opacity-100');
            text.classList.add('max-w-0', 'opacity-0');
        });

        
        profileBox.classList.remove('bg-slate-50/50', 'border-white/60');
        profileBox.classList.add('bg-transparent', 'border-transparent');

        
        toggleIcon.classList.add('rotate-180');

    } else {
        
        sidebar.classList.remove('w-20');
        sidebar.classList.add('w-64');

        if (mainContent) {
            mainContent.classList.remove('ml-24', 'w-[calc(100%-6rem)]');
            mainContent.classList.add('ml-72', 'w-[calc(100%-18rem)]');
        }

        
        logoWrapper.classList.remove('w-0', 'opacity-0');
        logoWrapper.classList.add('w-40', 'opacity-100');

        
        toggleBtn.classList.remove('right-5');
        toggleBtn.classList.add('right-4');

        
        texts.forEach(text => {
            text.classList.remove('max-w-0', 'opacity-0');
            text.classList.add('max-w-[200px]', 'opacity-100');
        });

        
        profileBox.classList.remove('bg-transparent', 'border-transparent');
        profileBox.classList.add('bg-slate-50/50', 'border-white/60');

        toggleIcon.classList.remove('rotate-180');
    }
}

const logoutBtn = document.getElementById("logout-btn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        window.location.href = "../index.html";
    });
}