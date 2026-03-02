import fs from 'fs';
import https from 'https';
import path from 'path';

const images = [
    { name: 'gameboy.jpg', url: 'https://images.unsplash.com/photo-1529653762956-b0a2727bd522?q=80&w=800&auto=format&fit=crop' }
];

const dir = 'public/images/products';

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

images.forEach(img => {
    const filePath = path.join(dir, img.name);
    const file = fs.createWriteStream(filePath);
    console.log(`Starting download for ${img.name}...`);
    https.get(img.url, response => {
        if (response.statusCode === 200) {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Successfully downloaded ${img.name}`);
            });
        } else {
            console.error(`Failed to download ${img.name}: Status Code ${response.statusCode}`);
            file.close();
            fs.unlinkSync(filePath);
        }
    }).on('error', err => {
        console.error(`Error downloading ${img.name}: ${err.message}`);
        file.close();
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });
});
