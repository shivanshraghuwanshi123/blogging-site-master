// const blogTitleField = document.querySelector('.title');
// const articleFeild = document.querySelector('.article');

// // banner
// const bannerImage = document.querySelector('#banner-upload');
// const banner = document.querySelector(".banner");
// let bannerPath;

// const publishBtn = document.querySelector('.publish-btn');
// const uploadInput = document.querySelector('#image-upload');

// bannerImage.addEventListener('change', () => {
//     uploadImage(bannerImage, "banner");
// })

// uploadInput.addEventListener('change', () => {
//     uploadImage(uploadInput, "image");
// })

// const uploadImage = (uploadFile, uploadType) => {
//     const [file] = uploadFile.files;
//     if(file && file.type.includes("image")){
//         const formdata = new FormData();
//         formdata.append('image', file);

//         fetch('/upload', {
//             method: 'post',
//             body: formdata
//         }).then(res => res.json())
//         .then(data => {
//             if(uploadType == "image"){
//                 addImage(data, file.name);
//             } else{
//                 bannerPath = `${location.origin}/${data}`;
//                 banner.style.backgroundImage = `url("${bannerPath}")`;
//             }
//         })
//     } else{
//         alert("upload Image only");
//     }
// }

// const addImage = (imagepath, alt) => {
//     let curPos = articleFeild.selectionStart;
//     let textToInsert = `\r![${alt}](${imagepath})\r`;
//     articleFeild.value = articleFeild.value.slice(0, curPos) + textToInsert + articleFeild.value.slice(curPos);
// }

// let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// publishBtn.addEventListener('click', () => {
//     if(articleFeild.value.length && blogTitleField.value.length){
//         // generating id
//         let letters = 'abcdefghijklmnopqrstuvwxyz';
//         let blogTitle = blogTitleField.value.split(" ").join("-");
//         let id = '';
//         for(let i = 0; i < 4; i++){
//             id += letters[Math.floor(Math.random() * letters.length)];
//         }

//         // setting up docName
//         let docName = `${blogTitle}-${id}`;
//         let date = new Date(); // for published at info

//         //access firstore with db variable;
//         db.collection("blogs").doc(docName).set({
//             title: blogTitleField.value,
//             article: articleFeild.value,
//             bannerImage: bannerPath,
//             publishedAt: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
//             author:auth.currentUser.email.split("@")[0];
//         })
//         .then(() => {
//             location.href = `/${docName}`;
//         })
//         .catch((err) => {
//             console.error(err);
//         })
//     }
// })
// // checking for user logged in or not

// auth.onAuthStateChange((user) => {
//    if(!user)
//     {
//         location.replace("/admin")//this will redirect to admin route if not logged in
//     } 
// })
const blogTitleField = document.querySelector('.title');
const articleFeild = document.querySelector('.article');

// banner
const bannerImage = document.querySelector('#banner-upload');
const banner = document.querySelector(".banner");
let bannerPath;

const publishBtn = document.querySelector('.publish-btn');
const uploadInput = document.querySelector('#image-upload');

// Image upload
bannerImage.addEventListener('change', () => {
    uploadImage(bannerImage, "banner");
});

uploadInput.addEventListener('change', () => {
    uploadImage(uploadInput, "image");
});

const uploadImage = (uploadFile, uploadType) => {
    const [file] = uploadFile.files;
    if (file && file.type.includes("image")) {
        const formdata = new FormData();
        formdata.append('image', file);

        fetch('/upload', {
            method: 'post',
            body: formdata
        })
        .then(res => res.json())
        .then(data => {
            if (uploadType === "image") {
                addImage(data.filePath, file.name); // Assuming the server response contains filePath
            } else {
                bannerPath = `${location.origin}/${data.filePath}`;
                banner.style.backgroundImage = `url("${bannerPath}")`;
            }
        })
        .catch(err => {
            console.error("Image upload failed:", err);
            alert("Failed to upload image. Please try again.");
        });
    } else {
        alert("Upload image only");
    }
};

const addImage = (imagepath, alt) => {
    let curPos = articleFeild.selectionStart;
    let textToInsert = `\r![${alt}](${imagepath})\r`;
    articleFeild.value = articleFeild.value.slice(0, curPos) + textToInsert + articleFeild.value.slice(curPos);
};

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

publishBtn.addEventListener('click', () => {
    if (articleFeild.value.length && blogTitleField.value.length) {
        // generating id
        let docName;
     if(   blogID[0]=='editor')
     {
        let letters = 'abcdefghijklmnopqrstuvwxyz';
        let blogTitle = blogTitleField.value.split(" ").join("-");
        let id = '';
        for (let i = 0; i < 4; i++) {
            id += letters[Math.floor(Math.random() * letters.length)];
        }
         docName = `${blogTitle}-${id}`;
     }
     else{
        docName=decodeURI(blogID[0]);
     }
       

        // setting up docName
       
        let date = new Date(); // for published at info

        // Access Firestore
        db.collection("blogs").doc(docName).set({
            title: blogTitleField.value,
            article: articleFeild.value,
            bannerImage: bannerPath,
            publishedAt: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`,
            author: auth.currentUser.email.split("@")[0]
        })
        .then(() => {
            location.href = `/${docName}`;
        })
        .catch((err) => {
            console.error(err);
        });
    }
});

// Check if user is logged in
auth.onAuthStateChanged((user) => {
    if (!user) {
        location.replace("/admin"); // Redirect to admin route if not logged in
    }
});
// checking for existing blog edits

let blogID = location.pathname.split("/");
blogID.shift(); // it will remove the first element which is empty from the array

if(blogID[0] != "editor"){
    // means we are in an existing blog edit route
    let docRef = db.collection("blogs").doc(decodeURI(blogID[0]));
    docRef.get().then((doc) => {
        if(doc.exists){
            let data = doc.data();
            bannerPath = data.bannerImage;
            banner.style.backgroundImage = `url(${bannerPath})`;
            blogTitleField.value = data.title;
            articleFeild.value = data.article;
        } else {
            location.replace("/"); // home route
        }
    });
}
