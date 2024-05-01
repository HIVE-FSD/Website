
function cancelComment(commentButton) {
    const buzzSuper = commentButton.closest('.buzz-super');
    buzzSuper.querySelector('.buzz-commentText').value = '';
    buzzSuper.querySelector('.buzz-comment-area').style.display = 'none';
}


function cancelReply(commentButton) {
    const buzzSuper = commentButton.closest('.buzz-comment-main');
    buzzSuper.querySelector('.buzz-commentText').value = '';
    buzzSuper.querySelector('.buzz-comment-area').style.display = 'none';
}


async function vote(action, id, type, userId) {
    try {
        const response = await fetch(`/buzz/vote/${type}/${action}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, userId })
        });

        if (!response.ok) {
            throw new Error('Failed to update vote');
        }

        const data = await response.json();
        console.log(data.message)
    } catch (error) {
        console.error('Error:', error.message);
        return null;
    }
}

async function upVote(voteButton, id, type, userId) {
    const votesContainer = voteButton.closest('.votes-container');
    const votesSpan = votesContainer.querySelector('.votes-value');
    const addVoteBtn = votesContainer.querySelector('.add-vote-btn');
    const removeVoteBtn = votesContainer.querySelector('.remove-vote-btn');

    if (addVoteBtn.classList.contains('plus')) {
        await vote('removevote', id, type, userId);
        votesSpan.textContent = parseInt(votesSpan.textContent) - 1;
        addVoteBtn.classList.remove('plus');
        votesSpan.classList.remove('plus');
    } else {

        await vote('upvote', id, type, userId);
        if (removeVoteBtn.classList.contains('minus')) {
            votesSpan.textContent = parseInt(votesSpan.textContent) + 1;
            removeVoteBtn.classList.remove('minus');
            votesSpan.classList.remove('minus');
        }
        votesSpan.textContent = parseInt(votesSpan.textContent) + 1;
        addVoteBtn.classList.add('plus');
        votesSpan.classList.add('plus');

    }
}

async function downVote(voteButton, id, type, userId) {
    const votesContainer = voteButton.closest('.votes-container');
    const votesSpan = votesContainer.querySelector('.votes-value');
    const addVoteBtn = votesContainer.querySelector('.add-vote-btn');
    const removeVoteBtn = votesContainer.querySelector('.remove-vote-btn');

    if (removeVoteBtn.classList.contains('minus')) {
        await vote('removevote', id, type, userId);
        votesSpan.textContent = parseInt(votesSpan.textContent) + 1;
        removeVoteBtn.classList.remove('minus');
        votesSpan.classList.remove('minus');
    } else {

        await vote('downvote', id, type, userId);
        if (addVoteBtn.classList.contains('plus')) {
            votesSpan.textContent = parseInt(votesSpan.textContent) - 1;
            addVoteBtn.classList.remove('plus');
            votesSpan.classList.remove('plus');
        }
        votesSpan.textContent = parseInt(votesSpan.textContent) - 1;
        removeVoteBtn.classList.add('minus');
        votesSpan.classList.add('minus');

    }
}

const reportBuzz = async (btn, buzzId) => {

    const requestData = {
        buzzId: buzzId
    };

    try {
        const response = await fetch('/buzz/reportBuzz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        const responseData = await response.json();
        btn.innerHTML = 'Reported!'
    } catch (error) {
        console.error('Error:', error);
    }
};

function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + ' <span class="more">...more</span>';
    } else {
        return text;
    }
}