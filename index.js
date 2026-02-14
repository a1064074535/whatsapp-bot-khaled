const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode');

const app = express();
const PORT = process.env.PORT || 3000;

let qrCodeData = '';
let clientStatus = 'Initializing...';

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', async (qr) => {
    console.log('QR Code received');
    qrCodeData = await qrcode.toDataURL(qr);
    clientStatus = 'Waiting for QR scan...';
});

client.on('ready', () => {
    console.log('WhatsApp Bot is ready!');
    clientStatus = 'Connected ✅';
});

client.on('authenticated', () => {
    console.log('Authenticated!');
    clientStatus = 'Authenticated';
});

client.on('auth_failure', () => {
    console.log('Authentication failed');
    clientStatus = 'Authentication failed ❌';
});

client.on('disconnected', () => {
    console.log('Client disconnected');
    clientStatus = 'Disconnected ⚠️';
});

// Auto-reply functionality
const services = [
    '🎯 *خدماتنا المتاحة:*\n',
    '1️⃣ تصميم السيرة الذاتية الاحترافية',
    '2️⃣ إنشاء المتاجر الإلكترونية',
    '3️⃣ بناء المواقع والمنصات الرقمية',
    '4️⃣ تطوير بوتات واتساب للرد الآلي',
    '5️⃣ الأتمتة وربط الأنظمة',
    '6️⃣ التسويق الرقمي وتحسين محركات البحث',
    '7️⃣ استشارات تقنية وحلول أعمال',
    '\n📞 *للاستفسار والطلب:*',
    'تواصل معنا مباشرة على هذا الرقم'
].join('\n');

client.on('message', async (msg) => {
    console.log('Message received:', msg.body);
    
    // Auto-reply to all messages
    if (!msg.fromMe) {
        await msg.reply(services);
    }
});

// Web dashboard
app.get('/dashboard', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>WhatsApp Bot Dashboard</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    margin: 0;
                    padding: 20px;
                }
                .container {
                    background: white;
                    border-radius: 20px;
                    padding: 40px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    text-align: center;
                    max-width: 500px;
                    width: 100%;
                }
                h1 {
                    color: #25D366;
                    margin-bottom: 10px;
                }
                .status {
                    font-size: 18px;
                    font-weight: bold;
                    margin: 20px 0;
                    padding: 15px;
                    border-radius: 10px;
                    background: #f0f0f0;
                }
                .qr-container {
                    margin: 30px 0;
                    padding: 20px;
                    background: white;
                    border-radius: 10px;
                    display: ${qrCodeData ? 'block' : 'none'};
                }
                img {
                    max-width: 100%;
                    border-radius: 10px;
                }
                .instructions {
                    text-align: right;
                    margin-top: 20px;
                    padding: 20px;
                    background: #f9f9f9;
                    border-radius: 10px;
                    line-height: 1.8;
                }
            </style>
            <script>
                setTimeout(() => location.reload(), 5000);
            </script>
        </head>
        <body>
            <div class="container">
                <h1>🤖 لوحة تحكم بوت واتساب</h1>
                <div class="status">الحالة: ${clientStatus}</div>
                ${qrCodeData ? `
                    <div class="qr-container">
                        <h2>📱 امسح الباركود</h2>
                        <img src="${qrCodeData}" alt="QR Code">
                    </div>
                    <div class="instructions">
                        <strong>خطوات الربط:</strong><br>
                        1️⃣ افتح واتساب على جوالك<br>
                        2️⃣ اضغط على القائمة (⋮) أو الإعدادات<br>
                        3️⃣ اختر "الأجهزة المرتبطة"<br>
                        4️⃣ اضغط "ربط جهاز"<br>
                        5️⃣ امسح الباركود أعلاه<br>
                        ✅ سيصبح البوت متصلاً فوراً!
                    </div>
                ` : '<p>جاري تحميل الباركود...</p>'}
            </div>
        </body>
        </html>
    `);
});

app.get('/', (req, res) => {
    res.redirect('/dashboard');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

client.initialize();

console.log('WhatsApp Bot starting...');
