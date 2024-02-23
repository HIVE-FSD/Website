
function postComment(commentButton) {
    const postSuper = commentButton.closest('.post-super');
    const commentText = postSuper.querySelector('.post-commentText').value;
    // Add logic to post comment to backend or handle as needed
    // For now, let's just log the comment text to console
    console.log('Comment posted:', commentText);
    // Reset the comment area
    postSuper.querySelector('.post-commentText').value = '';
    postSuper.querySelector('.post-comment-area').style.display = 'none';
}

function cancelComment(commentButton) {
    const postSuper = commentButton.closest('.post-super');
    postSuper.querySelector('.post-commentText').value = '';
    postSuper.querySelector('.post-comment-area').style.display = 'none';
}
function CommentReply(commentButton) {
    const postSuper = commentButton.closest('.post-comment-main');
    const commentText = postSuper.querySelector('.post-commentText').value;
    // Add logic to post comment to backend or handle as needed
    // For now, let's just log the comment text to console
    console.log('Comment posted:', commentText);
    // Reset the comment area
    postSuper.querySelector('.post-commentText').value = '';
    postSuper.querySelector('.post-comment-area').style.display = 'none';
}

function cancelReply(commentButton) {
    const postSuper = commentButton.closest('.post-comment-main');
    postSuper.querySelector('.post-commentText').value = '';
    postSuper.querySelector('.post-comment-area').style.display = 'none';
}

function addVote(voteButton) {
    const votesContainer = voteButton.closest('.votes-container');
    const votesSpan = votesContainer.querySelector('.votes-value');
    const addVoteBtn = votesContainer.querySelector('.add-vote-btn');
    const removeVoteBtn = votesContainer.querySelector('.remove-vote-btn');

    if (addVoteBtn.classList.contains('plus')) {
        votesSpan.textContent = parseInt(votesSpan.textContent) - 1;
        addVoteBtn.classList.remove('plus');
        votesSpan.classList.remove('plus');
    } else {
        votesSpan.textContent = parseInt(votesSpan.textContent) + 1;
        addVoteBtn.classList.add('plus');
        votesSpan.classList.add('plus');

        // If expand_more button was previously clicked, decrement votes and remove 'minus' class
        if (removeVoteBtn.classList.contains('minus')) {
            votesSpan.textContent = parseInt(votesSpan.textContent) + 1;
            removeVoteBtn.classList.remove('minus');
            votesSpan.classList.remove('minus');
        }
    }
}

function removeVote(voteButton) {
    const votesContainer = voteButton.closest('.votes-container');
    const votesSpan = votesContainer.querySelector('.votes-value');
    const addVoteBtn = votesContainer.querySelector('.add-vote-btn');
    const removeVoteBtn = votesContainer.querySelector('.remove-vote-btn');

    if (removeVoteBtn.classList.contains('minus')) {
        votesSpan.textContent = parseInt(votesSpan.textContent) + 1;
        removeVoteBtn.classList.remove('minus');
        votesSpan.classList.remove('minus');
    } else {
        votesSpan.textContent = parseInt(votesSpan.textContent) - 1;
        removeVoteBtn.classList.add('minus');
        votesSpan.classList.add('minus');

        // If expand_less button was previously clicked, decrement votes and remove 'plus' class
        if (addVoteBtn.classList.contains('plus')) {
            votesSpan.textContent = parseInt(votesSpan.textContent) - 1;
            addVoteBtn.classList.remove('plus');
            votesSpan.classList.remove('plus');
        }
    }
}

