
function buzzComment(commentButton) {
    const buzzSuper = commentButton.closest('.buzz-super');
    const commentText = buzzSuper.querySelector('.buzz-commentText').value;
    // Add logic to buzz comment to backend or handle as needed
    // For now, let's just log the comment text to console
    console.log('Comment buzzed:', commentText);
    // Reset the comment area
    buzzSuper.querySelector('.buzz-commentText').value = '';
    buzzSuper.querySelector('.buzz-comment-area').style.display = 'none';
}



function cancelComment(commentButton) {
    const buzzSuper = commentButton.closest('.buzz-super');
    buzzSuper.querySelector('.buzz-commentText').value = '';
    buzzSuper.querySelector('.buzz-comment-area').style.display = 'none';
}


function CommentReply(commentButton) {
    const buzzSuper = commentButton.closest('.buzz-comment-main');
    const commentText = buzzSuper.querySelector('.buzz-commentText').value;
    // Add logic to buzz comment to backend or handle as needed
    // For now, let's just log the comment text to console
    console.log('Comment buzzed:', commentText);
    // Reset the comment area
    buzzSuper.querySelector('.buzz-commentText').value = '';
    buzzSuper.querySelector('.buzz-comment-area').style.display = 'none';
}

function cancelReply(commentButton) {
    const buzzSuper = commentButton.closest('.buzz-comment-main');
    buzzSuper.querySelector('.buzz-commentText').value = '';
    buzzSuper.querySelector('.buzz-comment-area').style.display = 'none';
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
