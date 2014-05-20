Handlebars.registerHelper('formatDate', function(passedString) {
    var theString = passedString.substring(0,10);
    var theDate = new Date(theString);
    return new Handlebars.SafeString(theDate.toDateString());
});

Handlebars.registerHelper('each-reverse', function(context) {
    var options = arguments[arguments.length - 1];
    var ret = '';

    if (context && context.length > 0) {
        for (var i = context.length - 1; i >= 0; i--) {
            ret += options.fn(context[i]);
        }
    } else {
        ret = options.inverse(this);
    }

    return ret;
});

Handlebars.registerHelper('breaklines', function(text) {
    text = Handlebars.Utils.escapeExpression(text);
    text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
    return new Handlebars.SafeString(text);
});