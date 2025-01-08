// profile.js
document.addEventListener('DOMContentLoaded', function() {
    const profileInfo = document.getElementById('profile-info');
    const profileForm = document.getElementById('profile-form');
    const usernameInput = document.getElementById('username');
    const bioInput = document.getElementById('bio');
    
    // Fetch and display profile info
    auth.onAuthStateChanged(user => {
        if (user) {
            db.collection('profiles').doc(user.uid).get().then(doc => {
                if (doc.exists) {
                    const data = doc.data();
                    profileInfo.innerHTML = `
                        <p><strong>Username:</strong> ${data.username}</p>
                        <p><strong>Bio:</strong> ${data.bio}</p>
                    `;
                    usernameInput.value = data.username;
                    bioInput.value = data.bio;
                } else {
                    profileInfo.innerHTML = '<p>No profile information found.</p>';
                }
            });
        } else {
            location.replace('/');
        }
    });

    // Save profile info
    profileForm.addEventListener('submit', event => {
        event.preventDefault();
        const user = auth.currentUser;
        if (user) {
            const username = usernameInput.value;
            const bio = bioInput.value;
            db.collection('profiles').doc(user.uid).set({
                username: username,
                bio: bio
            }).then(() => {
                profileInfo.innerHTML = `
                    <p><strong>Username:</strong> ${username}</p>
                    <p><strong>Bio:</strong> ${bio}</p>
                `;
                alert('Profile updated successfully!');
            }).catch(error => {
                console.error('Error updating profile:', error);
            });
        } else {
            location.replace('/');
        }
    });
});
