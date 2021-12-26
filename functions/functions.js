exports.escape = function (html) {
  return html.replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

exports.emailPattern = function (email) {
  const pattern = new RegExp(/([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|\[[\t -Z^-~]*])/, 'g');

  const emailMatched = email.match(pattern).join('');
  if (emailMatched.length < email.length) {
    throw new Error('Invalid characters...');
  } else return emailMatched;
};