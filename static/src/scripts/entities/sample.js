export function getUsers({success, error}) {
  $.getJSON('//jsonplaceholder.typicode.com/users', success).fail(error);
}

export function getUser(id, {success, error}) {
  $.getJSON('//jsonplaceholder.typicode.com/users/' + id, success).fail(error);
}

export function getUserPosts(id, {success, error}) {
  $.getJSON('//jsonplaceholder.typicode.com/posts?userId=' + id, success).fail(error);
}

