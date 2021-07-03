exports.capitalizeTheFirstLetterOfEachWord = function (words) {
    var separateWord = words.toLowerCase().split(' ');
    for (var i = 0; i < separateWord.length; i++) {
        separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
            separateWord[i].substring(1);
    }
    return separateWord.join(' ');
};

exports.changeDateDisplayOfMatches = function (matches) {
    for (let i = 0; i < matches.length; i++) {
        let date = matches[i].time.split(" ")[0];
        let time = matches[i].time.split(" ")[1];
        date = date.split("-").reverse().join(".");
        date = date.slice(0, 5) + "."  + date.slice(8);
        time = time.replace(":", ".");
        matches[i].date = date;
        matches[i].hour = time;
    }
};