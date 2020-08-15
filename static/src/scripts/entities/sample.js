export function getUsers({success, error}) {
  $.getJSON('//jsonplaceholder.typicode.com/users', success).fail(error);
}

export function getUser(id, {success, error}) {
  $.getJSON('//jsonplaceholder.typicode.com/users/' + id, success).fail(error);
}

export function getUserPosts(id, {success, error}) {
  $.getJSON('//jsonplaceholder.typicode.com/posts?userId=' + id, success).fail(error);
}

export default function(opts) {
  // This method is called by core/app-data.js for initialisation
  // Here you can perform any initialisation including API use. Just call opts.success when done
  // if there's a fatal error, call opts.error. The application will stop loading with error
  opts.success();
}

