var fs = require("fs")
fs.readFile(__dirname + '/data/test.sql', 'utf8', function (err, sqlText) {

    var data = {};
    var execObj = {} // 解析后的对象
    console.log(sqlText);
    var sqlTextList = sqlText.split('\r\n')
    var execRegList = [
        { name: 'header', reg: /CREATE\sTABLE\s(\`\w+\`)\s\(*/g, execFn: execTable },
        { name: 'cols', reg: /\s+\`(\w+)\`\s(\w+(\(\d+\))?)\s[^\r\n]*,?/g, execFn: execCol },
        { name: 'primary', reg: /\s+PRIMARY\sKEY\s\((\`\w+\`)\),?/, execFn: execPrimary },
        { name: 'unique', reg: /\s+UNIQUE\sKEY\s(\`\w+\`)\s\((`\w+\`,?)+\)\sUSING\s(BTREE|HASH),?/, execFn: execUnique },
        { name: 'footer', reg: /(?<=\)\s)[^;]+(?=;)/, execFn: execFooter }
    ]
    sqlTextList.forEach(function (str) {
        exec(str);
    })
    function exec(str) {
        execRegList.forEach(function (item, i) {
            if (item.reg.test(str)) {
                if (execObj[item.name] && execObj[item.name] !== 0 && execObj[item.name] !== null) {
                    // exist
                    if (!(execObj[item.name] instanceof Array)) {
                        execObj[item.name] = [execObj[item.name]];
                    }
                    execObj[item.name].push(item.execFn(str, item.reg))
                } else {
                    // new
                    execObj[item.name] = item.execFn(str, item.reg)
                }
                return
            }
        })
    }
    function execTable(str, reg) {
        return str.replace(reg, '$1')
    }
    function execCol(str, reg) {
        var out = {};
        out['name'] = str.replace(reg, '$1')
        out['type'] = str.replace(reg, '$2')
        // 非空
        if (/NOT NULL/g.test(str)) {
            out['notNull'] = true;
        }
        // PRIMARY
        if (/PRIMARY/g.test(str)) {
            out['primary'] = true;
        }
        // UNIQUE
        if (/UNIQUE/g.test(str)) {
            out['unique'] = true;
        }
        // 自增
        if (/AUTO_INCREMENT/g.test(str)) {
            out['auto_increment'] = true;
        }
        // 默认值
        var defMatchList = str.match(/(?<=DEFAULT\s)((\s?\'?\w+\'?)+(?=(\sCOMMENT)|(\sNOT NULL)|(\sAUTO_INCREMENT)|(\sCHECK)|(\sPRIMARY)|(\sUNIQUE)))/)
        if (defMatchList instanceof Array && defMatchList.length) {
            out['default'] = defMatchList[0];
        }
        // CHECK
        var defCheckList = str.match(/(?<=CHECK\s)\(([^\)]+)\)+/g)
        if (defCheckList instanceof Array && defCheckList.length) {
            out['default'] = defCheckList[0];
        }
        // COMMENT
        var defCommentList = str.match(/(?<=COMMENT\s)\'?([^,\r\n]+)\'?/g)
        if (defCommentList instanceof Array && defCommentList.length) {
            out['comment'] = defCommentList[0];
        }

        return out;
    }
    function execPrimary(str, reg) {
        return str.replace(reg, '$1')
    }
    function execUnique(str, reg) {
        return str.replace(reg, '$1')
    }
    function execFooter(str, reg) {
        var out = {}
        str = str.match(reg)[0]
        // ENGINE
        var engineList = str.match(/(?<=ENGINE\=)\'?(\w+)\'?(?=\s)?/g)
        if (engineList instanceof Array && engineList.length) {
            out['engine'] = engineList[0];
        }
        // AUTO_INCREMENT
        var auto_incrementList = str.match(/(?<=AUTO_INCREMENT\=)\'?(\w+)\'?(?=\s)?/g)
        if (auto_incrementList instanceof Array && auto_incrementList.length) {
            out['auto_increment'] = auto_incrementList[0];
        }
        // COMMENT
        var commentList = str.match(/(?<=COMMENT\=)\'?([^\']+)\'?/g)
        if (commentList instanceof Array && commentList.length) {
            out['comment'] = commentList[0];
        }
        // DEFAULT CHARSET
        var defaultcharseTList = str.match(/(?<=DEFAULT CHARSET\=)\'?(\w+)\'?(?=\s)?/g)
        if (defaultcharseTList instanceof Array && defaultcharseTList.length) {
            out['defaultcharse'] = defaultcharseTList[0];
        }
        return out;
    }
    console.log(execObj)
});