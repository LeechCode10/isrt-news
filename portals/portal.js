let isAdmin = false;

// Use a unique key per page based on the URL path
const pageKey = `comments_${window.location.pathname}`;

// Load comments on page load
window.onload = function () {
  renderAllComments();
};

// Add a new comment
function addComment() {
  alert('Are you risking your CGPA by commenting here?');

  const nickname = document.getElementById('nickname').value.trim();
  const commentText = document.getElementById('comment').value.trim();

  if (!nickname || !commentText) {
    alert('Nickname and comment are required!');
    return;
  }

  const comment = {
    name: nickname,
    text: commentText,
    replies: []
  };

  const comments = JSON.parse(localStorage.getItem(pageKey)) || [];
  comments.push(comment);
  localStorage.setItem(pageKey, JSON.stringify(comments));

  document.getElementById('nickname').value = '';
  document.getElementById('comment').value = '';

  renderAllComments();
}

// Render all comments
function renderAllComments() {
  const commentSection = document.getElementById('commentsection');
  commentSection.innerHTML = '';

  const comments = JSON.parse(localStorage.getItem(pageKey)) || [];
  comments.forEach((comment, index) => {
    displayComment(comment, index);
  });
}

// Display single comment
function displayComment(comment, index) {
  const commentSection = document.getElementById('commentsection');

  const commentDiv = document.createElement('div');
  commentDiv.className = 'comment';
  commentDiv.setAttribute('data-index', index);

  const contentDiv = document.createElement('div');
  contentDiv.className = 'commentcontent';
  contentDiv.innerHTML = `<strong>Comment From: ${comment.name}</strong><br><span>${comment.text}</span>`;
  commentDiv.appendChild(contentDiv);

  // Admin delete button
  if (isAdmin) {
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete Comment';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = function () {
      deleteComment(index);
    };
    commentDiv.appendChild(deleteBtn);
  }

  // ========== Replies ==========

  const repliesDiv = document.createElement('div');
  repliesDiv.className = 'replies';

  comment.replies.forEach((reply, replyIndex) => {
    const replyDiv = document.createElement('div');
    replyDiv.className = 'reply';
    replyDiv.innerHTML = `<strong>Reply from: ${reply.name}</strong><br><span>${reply.text}</span>`;

    if (isAdmin) {
      const deleteReplyBtn = document.createElement('button');
      deleteReplyBtn.textContent = 'Delete Reply';
      deleteReplyBtn.className = 'delete-btn';
      deleteReplyBtn.onclick = function () {
        deleteReply(index, replyIndex);
      };
      replyDiv.appendChild(deleteReplyBtn);
    }

    repliesDiv.appendChild(replyDiv);
  });

  commentDiv.appendChild(repliesDiv);

  // Reply input
  const replyInput = document.createElement('input');
  replyInput.placeholder = 'Your name';
  replyInput.className = 'reply-input';

  const replyText = document.createElement('textarea');
  replyText.placeholder = 'Write a reply...';
  replyText.className = 'reply-textarea';

  const replyBtn = document.createElement('button');
  replyBtn.textContent = 'Reply';
  replyBtn.className = 'reply-btn';
  replyBtn.onclick = function () {
    addReply(index, replyInput.value.trim(), replyText.value.trim());
    replyInput.value = '';
    replyText.value = '';
  };

  commentDiv.appendChild(replyInput);
  commentDiv.appendChild(replyText);
  commentDiv.appendChild(replyBtn);

  commentSection.appendChild(commentDiv);
}

// Add reply
function addReply(commentIndex, replier, replyText) {
  if (!replier || !replyText) {
    alert("Reply name and text required!");
    return;
  }

  const comments = JSON.parse(localStorage.getItem(pageKey)) || [];
  if (!comments[commentIndex].replies) {
    comments[commentIndex].replies = [];
  }

  comments[commentIndex].replies.push({ name: replier, text: replyText });
  localStorage.setItem(pageKey, JSON.stringify(comments));

  renderAllComments();
}

// Delete comment (admin only)
function deleteComment(index) {
  let comments = JSON.parse(localStorage.getItem(pageKey)) || [];
  comments.splice(index, 1);
  localStorage.setItem(pageKey, JSON.stringify(comments));
  renderAllComments();
}

// Delete reply (admin only)
function deleteReply(commentIndex, replyIndex) {
  let comments = JSON.parse(localStorage.getItem(pageKey)) || [];
  if (comments[commentIndex].replies) {
    comments[commentIndex].replies.splice(replyIndex, 1);
    localStorage.setItem(pageKey, JSON.stringify(comments));
    renderAllComments();
  }
}

// Toggle admin mode (Ctrl + Shift + D)
document.addEventListener('keydown', function (e) {
  if (e.ctrlKey && e.shiftKey && e.key === 'D') {
    const password = prompt("Enter admin password:");
    if (password === 'isrtmarecdi') {
      isAdmin = true;
      alert('Admin mode activated. Delete buttons are now visible.');
      renderAllComments();
    } else {
      alert('Incorrect password.');
    }
  }
});
