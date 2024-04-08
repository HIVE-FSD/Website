function getCommentById(commentId) {
    fetch(`/comments/${commentId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(comment => {
            // Do something with the fetched comment
            console.log(comment);
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
}

