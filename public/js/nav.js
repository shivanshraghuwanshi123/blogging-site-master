document.addEventListener('DOMContentLoaded', () => {
    let ul = document.querySelector('.links-container'); // Add the dot prefix here

    auth.onAuthStateChanged((user) => {
        if(user){
            // user is logged in
            ul.innerHTML += `
            <li class="link-item"><a href="/admin" class="link">Dashboard</a></li>
            <li class="link-item"><a href="#" onClick="logoutUser()" class="link">Logout</a></li>
            `
        } else {
            // no one is logged in
            ul.innerHTML += `
            <li class="link-item"><a href="/admin" class="link">login</a></li>
            `
        }
    });
});
