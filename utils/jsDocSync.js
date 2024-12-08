import fg from 'fast-glob';
import fs from 'fs';

const extractDocBlocks = (pattern) => {
    const files = fg.sync(pattern);
    const docBlocks = {};

    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');
        const docBlockMatch = content.match(/\/\*\*([\s\S]*?)\*\//);
        if (docBlockMatch) {
            const docBlock = docBlockMatch[0];
            const endpointMatch = docBlock.match(/\* (DELETE|GET|POST|PUT|PATCH) (\/[^\s]*)/);
            if (endpointMatch) {
                const [_, method, path] = endpointMatch;
                docBlocks[`${method} ${path}`] = docBlock;
            }
        }
    });

    return docBlocks;
};

const syncDocBlocks = (pattern) => {
    const docBlocks = extractDocBlocks(pattern);
    const files = fg.sync(pattern);
    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');
        const docBlockMatch = content.match(/\/\*\*([\s\S]*?)\*\//);
        if (docBlockMatch) {
            const docBlock = docBlockMatch[0];
            const endpointMatch = docBlock.match(/\* (DELETE|GET|POST|PUT|PATCH) (\/[^\s]*)/);
            if (endpointMatch) {
                const [_, method, path] = endpointMatch;
                const firstPart = docBlock.split('\n').slice(0, docBlock.indexOf('*\n')).join('\n');
                docBlocks[`${method} ${path}`] = firstPart;
            }
        }
    });
    console.log(docBlocks);
};

export { syncDocBlocks };