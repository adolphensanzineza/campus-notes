'use strict';

function layout(title, bodyHtml) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} · Campus Notes</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <header><a href="/">Campus Notes</a></header>
  <main>${bodyHtml}</main>
</body>
</html>`;
}

function loginPage(error) {
  const banner = error ? `<p class="error">${error}</p>` : '';
  return layout('Sign in', `
    <h1>Sign in</h1>
    ${banner}
    <form method="post" action="/login">
      <label>Username <input name="username" autocomplete="username"></label>
      <label>Password <input name="password" type="password" autocomplete="current-password"></label>
      <button type="submit">Sign in</button>
    </form>`);
}

function notesPage(notes, user) {
  const who = user ? `Signed in as ${user.username}` : '<a href="/login">Sign in</a>';
  const items = notes
    .map((n) => `<li><a href="/notes/${n.id}">${n.title}</a> <small>— ${n.author}, ${n.created_at}</small></li>`)
    .join('\n');
  const form = user
    ? `<h2>Post a note</h2>
       <form method="post" action="/notes">
         <label>Title <input name="title"></label>
         <label>Body <textarea name="body"></textarea></label>
         <button type="submit">Post</button>
       </form>`
    : '';
  return layout('Notes', `<p>${who}</p><h1>Notes</h1><ul>${items}</ul>${form}`);
}

// V2 -- the note body is interpolated straight into the page. Anything a user
// posts is executed by every reader's browser. Fixed on Day 4.
function notePage(note) {
  return layout(note.title, `
    <h1>${note.title}</h1>
    <p class="meta">${note.author} · ${note.created_at}</p>
    <div class="note-body">${note.body}</div>
    <p><a href="/">Back to notes</a></p>`);
}

module.exports = { layout, loginPage, notesPage, notePage };
