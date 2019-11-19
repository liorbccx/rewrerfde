exports.linkify = function (inputText) {
    // for // http://, https://, ftp:// with optional [] to label the <a>
    var labelPattern = /\b((?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|])(?:\[([a-z0-9-+&@#\/%?=~_|!:,.; ]+)\])?/gim;

    // www. without http:// or https:// with optional [] to label the <a>
    var labelPseudoUrlPattern = /(^|[^\/])(www\.[^ \t\n\[]+(\b|$))(?:\[([a-z0-9-+&@#\/%?=~_|!:,.; ]+)\])?/gim; // match all characters until whitespace, tab, newline and [ which is optional anchor label

    // Email addresses
    var emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;

    return inputText
        .replace(labelPattern, function (all, g1, g2) {
            return (
                '<a href="' +
                g1 +
                '" target="_blank" class="link">' +
                (g2 || g1) +
                "</a>"
            );
        })
        .replace(labelPseudoUrlPattern, function (all, g1, g2, g3, g4) {
            return (
                g1 +
                '<a href="http://' +
                g2 +
                '" target="_blank" class="link">' +
                (g4 || g2) +
                "</a>"
            );
        })
        .replace(emailAddressPattern, '<a href="mailto:$&" class="link">$&</a>');
};

exports.stripUser = function (user) {
    user = user || {};
    return {
        id: user.id,
        avatarurl: user.avatarurl,
        username: user.username,
        roles: user.roles || []
    }
}