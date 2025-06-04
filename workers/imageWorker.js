const { parentPort } = require('worker_threads');
const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const promptsDir = path.join('./prompts');

function loadPrompt(promptName) {
    const promptPath = path.join(promptsDir, `${promptName}.txt`);
    try {
        const promptContent = fs.readFileSync(promptPath, 'utf-8');
        return promptContent;
    } catch (err) {
        console.error(`Error loading prompt ${promptName}:`, err.message);
        throw err;
    }
}

async function detectTextFromImage(imagePath) {
    const promptContent = loadPrompt('detect_text_prompt');
    const imageBuffer = await fs.promises.readFile(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const imageUrl = `data:image/png;base64,${base64Image}`;
    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: promptContent
                    },
                    {
                        type: 'image_url',
                        image_url: { 'url': imageUrl }
                    }
                ]
            }
        ]
    });
    return response.choices[0].message.content;
}

async function translateText(detectedText) {
    try {
        const promptContent = loadPrompt('translate_text_prompt');
        const prompt = `${promptContent} Please translate this text: "${detectedText}"`;

        const response = await openai.chat.completions.create({
            model: "gpt-4.5-preview",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error('Translation error:', error);
        throw error;
    }
}

parentPort.on('message', async (data) => {
    try {
        const { imagePath, imageName, excelPath } = data;
        const detectedText = await detectTextFromImage(imagePath);
        console.log("detectedText=>", detectedText);
        const translatedText = await translateText(detectedText);
        console.log("translatedText=>", translatedText);

        const workbook = xlsx.readFile(excelPath);
        let worksheet = workbook.Sheets['Results'];

        const existingData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
        existingData.push([imageName, detectedText, translatedText]);

        worksheet = xlsx.utils.aoa_to_sheet(existingData);
        workbook.Sheets['Results'] = worksheet;

        xlsx.writeFile(workbook, excelPath);

        parentPort.postMessage({
            success: true,
            translatedText
        });
    } catch (error) {
        parentPort.postMessage({
            success: false,
            error: error.message
        });
    }
}); 