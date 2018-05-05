var fs = require("fs")
fs.readFile(__dirname + '/data/test.sql', 'utf8', function (err, sqlText) {
    var data = {};
        console.log(sqlText);
    data['tableName'] = sqlText.match(/CREATE\sTABLE\s\`(\w+)\`\s\(*/)[1]
    //  /(`\w+`)\s(\w+(\(\d+\))?)\s((\w+)\s)+/g

    var temp = sqlText.match(/CREATE\sTABLE\s\`(\w+)\`\s\(([\s`\w\(\)\'\u4e00-\u9fa5,]*)\)/)
    debugger
});