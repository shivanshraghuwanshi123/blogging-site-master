// let blogId = decodeURI(location.pathname.split("/").pop());

// let docRef = db.collection("blogs").doc(blogId);

// docRef.get().then((doc) => {
//     if(doc.exists){
//         setupBlog(doc.data());
//     } else{
//         location.replace("/");
//     }
// })

// const setupBlog = (data) => {
//     const banner = document.querySelector('.banner');
//     const blogTitle = document.querySelector('.title');
//     const titleTag = document.querySelector('title');
//     const publish = document.querySelector('.published');
    
//     banner.style.backgroundImage = `url(${data.bannerImage})`;

//     titleTag.innerHTML += blogTitle.innerHTML = data.title;
//     publish.innerHTML += data.publishedAt;
//     publish.innerHTML += `--${data.author}`;
//     try{
//     if(data.author == auth.currentUser.email.split('@')[0]){
//          let editBtn = document.getElementById('edit-blog-btn'); 
//           editBtn.style.display = "inline"; 
//           editBtn.href = `${blogId}/editor`;
//     }
// }
// catch{
//     //do nothing here
// }
//     const article = document.querySelector('.article');
//     addArticle(article, data.article);
// }

// const addArticle = (ele, data) => {
//     data = data.split("\n").filter(item => item.length);
//     // console.log(data);

//     data.forEach(item => {
//         // check for heading
//         if(item[0] == '#'){
//             let hCount = 0;
//             let i = 0;
//             while(item[i] == '#'){
//                 hCount++;
//                 i++;
//             }
//             let tag = `h${hCount}`;
//             ele.innerHTML += `<${tag}>${item.slice(hCount, item.length)}</${tag}>`
//         } 
//         //checking for image format
//         else if(item[0] == "!" && item[1] == "["){
//             let seperator;

//             for(let i = 0; i <= item.length; i++){
//                 if(item[i] == "]" && item[i + 1] == "(" && item[item.length - 1] == ")"){
//                     seperator = i;
//                 }
//             }

//             let alt = item.slice(2, seperator);
//             let src = item.slice(seperator + 2, item.length - 1);
//             ele.innerHTML += `
//             <img src="${src}" alt="${alt}" class="article-image">
//             `;
//         }

//         else{
//             ele.innerHTML += `<p>${item}</p>`;
//         }
//     })
// }
let blogId = decodeURI(location.pathname.split("/").pop());

let docRef = db.collection("blogs").doc(blogId);

docRef.get().then((doc) => {
    if(doc.exists){
        setupBlog(doc.data());
    } else{
        location.replace("/");
    }
})

const setupBlog = (data) => {
    const banner = document.querySelector('.banner');
    const blogTitle = document.querySelector('.title');
    const titleTag = document.querySelector('title');
    const publish = document.querySelector('.published');
    
    banner.style.backgroundImage = `url(${data.bannerImage})`;

    titleTag.innerHTML += blogTitle.innerHTML = data.title;
    publish.innerHTML += data.publishedAt;
    publish.innerHTML += `--${data.author}`;
    try{
        if(data.author == auth.currentUser.email.split('@')[0]){
            let editBtn = document.getElementById('edit-blog-btn'); 
            editBtn.style.display = "inline"; 
            editBtn.href = `${blogId}/editor`;
        }
    } catch {
        //do nothing here
    }
    const article = document.querySelector('.article');
    addArticle(article, data.article);

    // Call displayComments() after setting up the blog
    displayComments();
}

const addArticle = (ele, data) => {
    data = data.split("\n").filter(item => item.length);

    data.forEach(item => {
        // check for heading
        if(item[0] == '#'){
            let hCount = 0;
            let i = 0;
            while(item[i] == '#'){
                hCount++;
                i++;
            }
            let tag = `h${hCount}`;
            ele.innerHTML += `<${tag}>${item.slice(hCount, item.length)}</${tag}>`
        } 
        //checking for image format
        else if(item[0] == "!" && item[1] == "["){
            let seperator;

            for(let i = 0; i <= item.length; i++){
                if(item[i] == "]" && item[i + 1] == "(" && item[item.length - 1] == ")"){
                    seperator = i;
                }
            }

            let alt = item.slice(2, seperator);
            let src = item.slice(seperator + 2, item.length - 1);
            ele.innerHTML += `
            <img src="${src}" alt="${alt}" class="article-image">
            `;
        }

        else{
            ele.innerHTML += `<p>${item}</p>`;
        }
    })
}

// Comment functionality
document.getElementById('comment-form').addEventListener('submit', function(event) {
    event.preventDefault();
    let commentText = document.getElementById('comment-text').value;
    let user = firebase.auth().currentUser; // Get current user
    let username = user ? user.email.split('@')[0] : "Anonymous"; // Extract username or default to "Anonymous"
    
    saveCommentToDatabase(commentText, username).then(() => {
        document.getElementById('comment-form').reset();
        displayComments();
    });
});

function saveCommentToDatabase(comment, username) {
    return firebase.firestore().collection('comments').add({
        postId: blogId,
        text: comment,
        username: username,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
}

function displayComments() {
    firebase.firestore().collection('comments').where('postId', '==', blogId).orderBy('timestamp', 'asc').get().then((snapshot) => {
        let commentsList = document.getElementById('comments-list');
        commentsList.innerHTML = '';
        snapshot.forEach((doc) => {
            let comment = doc.data();
            let date = comment.timestamp.toDate().toLocaleString(); // Convert Firestore timestamp to date string
            commentsList.innerHTML += `
                <div class="comment">
                    <p><strong>${comment.username}</strong> <em>${date}</em></p>
                    <p>${comment.text}</p>
                </div>`;
        });
    }).catch((error) => {
        console.error("Error fetching comments: ", error);
    });
}

// Call displayComments() when the page loads
displayComments();
