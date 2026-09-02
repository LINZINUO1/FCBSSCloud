const VIRUSSHARE_BASE = 'https://virusshare.com/hashfiles/';
const SCAN_FILES = [1, 2, 3, 4, 5];

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: '只支持 POST' }) };
    }

    let md5 = '';
    try {
        const body = JSON.parse(event.body);
        md5 = body.md5?.trim()?.toLowerCase() || '';
    } catch (e) {
        return { statusCode: 400, body: JSON.stringify({ error: '请求格式错误' }) };
    }

    if (!/^[a-f0-9]{32}$/.test(md5)) {
        return { statusCode: 400, body: JSON.stringify({ error: '无效的 MD5' }) };
    }

    let allHashes = new Set();
    let loadedFiles = 0;

    for (const num of SCAN_FILES) {
        try {
            const url = VIRUSSHARE_BASE + String(num).padStart(5, '0') + '.md5';
            const response = await fetch(url);
            if (!response.ok) continue;
            const text = await response.text();
            const lines = text.split('\n');
            for (const line of lines) {
                const hash = line.trim().toLowerCase();
                if (/^[a-f0-9]{32}$/.test(hash)) allHashes.add(hash);
            }
            loadedFiles++;
        } catch (err) {
            console.warn('加载失败:', err.message);
        }
    }

    const isThreat = allHashes.has(md5);

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            md5: md5,
            threat: isThreat,
            score: isThreat ? Math.floor(Math.random() * 5) + 5 : 0,
            checked: allHashes.size + ' 个哈希'
        })
    };
};
