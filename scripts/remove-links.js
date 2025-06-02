#!/usr/bin/env node

/**
 * Standalone script to remove unwanted links from HTML files
 * Usage: node scripts/remove-links.js [targetHref]
 */

const fs = require('fs');
const path = require('path');

const TARGET_HREF = process.argv[2] || 'https://neat.firecms.co';

function removeLinksFromFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // RegEx to match <a> tags with the target href
        const linkPattern = new RegExp(`<a[^>]*href\\s*=\\s*["']${TARGET_HREF.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*>.*?</a>`, 'gi');
        
        const newContent = content.replace(linkPattern, '');
        
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`✅ Removed links from: ${filePath}`);
            return true;
        }
        
        return false;
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
        return false;
    }
}

function scanDirectory(dir) {
    let filesProcessed = 0;
    let linksRemoved = 0;

    function walkDir(currentPath) {
        const items = fs.readdirSync(currentPath);
        
        for (const item of items) {
            const itemPath = path.join(currentPath, item);
            const stat = fs.statSync(itemPath);
            
            if (stat.isDirectory()) {
                // Skip node_modules and other common directories
                if (!['node_modules', '.git', '.svelte-kit', 'dist', 'build'].includes(item)) {
                    walkDir(itemPath);
                }
            } else if (stat.isFile()) {
                // Process HTML, Svelte, and other relevant files
                const ext = path.extname(item).toLowerCase();
                if (['.html', '.svelte', '.vue', '.jsx', '.tsx'].includes(ext)) {
                    filesProcessed++;
                    if (removeLinksFromFile(itemPath)) {
                        linksRemoved++;
                    }
                }
            }
        }
    }

    walkDir(dir);
    return { filesProcessed, linksRemoved };
}

function main() {
    console.log(`🔍 Scanning for links with href: ${TARGET_HREF}`);
    
    const startTime = Date.now();
    const projectRoot = path.resolve(__dirname, '..');
    
    const { filesProcessed, linksRemoved } = scanDirectory(projectRoot);
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    console.log('\n📊 Summary:');
    console.log(`Files processed: ${filesProcessed}`);
    console.log(`Files with links removed: ${linksRemoved}`);
    console.log(`Duration: ${duration.toFixed(2)}s`);
    
    if (linksRemoved === 0) {
        console.log('✨ No unwanted links found!');
    }
}

if (require.main === module) {
    main();
}

module.exports = { removeLinksFromFile, scanDirectory };
