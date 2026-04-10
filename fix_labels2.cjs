const fs = require('fs');
const path = require('path');

function processDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            const radioRegex = /<label><input type="radio" name="q\$\{index\}" value="\$\{opt\.v\}"><\/label>/g;
            if (radioRegex.test(content)) {
                content = content.replace(radioRegex, '<label><input type="radio" name="q${index}" value="${opt.v}"> ${opt.t}</label>');
                modified = true;
            }

            const checkRegex = /<label><input type="checkbox" name="q\$\{index\}" value="\$\{opt\.v\}"><\/label>/g;
            if (checkRegex.test(content)) {
                content = content.replace(checkRegex, '<label><input type="checkbox" name="q${index}" value="${opt.v}"> ${opt.t}</label>');
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

processDir('public/lop 3');
processDir('public/lop 4');
processDir('public/lop 5');
