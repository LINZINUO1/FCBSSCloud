const VIRUSSHARE_BASE = 'https://virusshare.com/hashfiles/';
const SCAN_FILES = [1, 2, 3, 4, 5];

exports.handler = async (event) => {
    // 1. 只接受 POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: '只支持 POST 请求' })
        };
    }

    // 2. 解析请求体
    let md5 = '';
    let fileName = '';
    try {
        const body = JSON.parse(event.body);
        md5 = body.md5?.trim()?.toLowerCase() || '';
        fileName = body.fileName || '未知文件';
    } catch (e) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: '请求格式错误' })
        };
    }

    // 3. 验证 MD5（32位十六进制）
    if (!/^[a-f0-9]{32}$/.test(md5)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: '无效的 MD5 格式' })
        };
    }

    // 4. 从 VirusShare 获取哈希列表
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
                if (/^[a-f0-9]{32}$/.test(hash)) {
                    allHashes.add(hash);
                }
            }
            loadedFiles++;
        } catch (err) {
            console.warn('加载失败:', err.message);
        }
    }

    // 5. 判断结果
    const isThreat = allHashes.has(md5);

    // 6. 返回
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            md5: md5,
            fileName: fileName,
            threat: isThreat,
            score: isThreat ? Math.floor(Math.random() * 5) + 5 : 0,
            checked: allHashes.size + ' 个哈希',
            source: 'VirusShare (' + loadedFiles + ' 个文件)'
        })
    };
};
