var fs = require("fs")
fs.readFile(__dirname + '/data/test.sql', 'utf8', function (err, sqlText) {

    var data = {};
    console.log(sqlText);
    var sqlTextList = sqlText.split('\r\n')
    var execList = sqlTextList.map(function(str){
        return exec(str);
    })
    function exec(str) {
        var execObj = {}
        var tableHeadReg = /CREATE\sTABLE\s\`(\w+)\`\s\(*/g,
            colReg = /(\`\w+\`)\s(\w+(\(\d+\))?)\s[^\r\n]*/g,
            primaryReg = /PRIMARY\sKEY\s\(\`(\w+)\`\)/g,
            uniqueReg = /UNIQUE\sKEY\s\`(\w+)\`\s\((`\w+\`,?)+\)\sUSING\s(BTREE|HASH)/g,
            footerReg = /\s/
        if (tableHeadReg.test(str)) {
            //匹配表头
            execObj["tableName"] = str.replace(tableHeadReg,'$1')
        } else if (colReg.test(str)) {
            //匹配列
        } else {
            //匹配结尾
        }
        return execObj;
    }
    function execCol(str) {
        
    }
    function execCol(str) {
        
    }
    function execCol(str) {
        
    }
    // data['tableName'] = sqlText.match(/CREATE\sTABLE\s\`(\w+)\`\s\(*/)[1]
    // //  /(`\w+`)\s(\w+(\(\d+\))?)\s((\w+)\s)+/g
    debugger
    // var temp = sqlText.match(/CREATE\sTABLE\s\`(\w+)\`\s\(([\s`\w\(\)\'\u4e00-\u9fa5,]*)\)/)
});