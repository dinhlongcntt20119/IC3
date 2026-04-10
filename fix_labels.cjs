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

            const radioRegex = /<input type="radio" name="q\$\{index\}" value="\$\{opt\.v\}">\s*\$\{opt\.t\}/g;
            if (radioRegex.test(content)) {
                content = content.replace(radioRegex, '<input type="radio" name="q${index}" value="${opt.v}">');
                modified = true;
            }

            const checkRegex = /<input type="checkbox" name="q\$\{index\}" value="\$\{opt\.v\}">\s*\$\{opt\.t\}/g;
            if (checkRegex.test(content)) {
                content = content.replace(checkRegex, '<input type="checkbox" name="q${index}" value="${opt.v}">');
                modified = true;
            }

            if (content.includes('.img-item img {') && !content.includes('.img-item input {')) {
                content = content.replace(
                    /\.img-item img \{ max-width: 100%; height: 120px; object-fit: contain; margin-bottom: 10px; display: block; margin-left: auto; margin-right: auto; \}/g,
                    '.img-item img { max-width: 100%; height: 120px; object-fit: contain; margin-bottom: 10px; display: block; margin-left: auto; margin-right: auto; }\n        .img-item input { transform: scale(1.3); accent-color: var(--primary-color); margin: 0; cursor: pointer; }'
                );
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
