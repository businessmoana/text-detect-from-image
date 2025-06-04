# Text Detection and Translation from Images

This project automatically detects text from images and translates it to Croatian, storing the results in an Excel file. It uses OpenAI's GPT-4 Vision model for text detection and GPT-4.5 for translation.

## Features

- Text detection from images using GPT-4 Vision
- Translation of detected text to Croatian using GPT-4.5
- Multi-threaded processing for handling multiple images simultaneously
- Results stored in Excel file with timestamp
- Supports JPG, JPEG, and PNG image formats

## Prerequisites

- Node.js (v14 or higher)
- OpenAI API key

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd text_detect_from_image
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

4. Create the required directories:
```bash
mkdir images
mkdir excel_files
mkdir prompts
```

5. Create the prompt files in the `prompts` directory:

`prompts/detect_text_prompt.txt`:
```
Please detect and extract all text from this image. Return only the text content without any additional formatting or explanations.
```

`prompts/translate_text_prompt.txt`:
```
You are an expert translator. Please translate the following text from its original language to Croatian. Maintain the original formatting and structure of the text.
```

## Usage

1. Place your images in the `images` directory. Supported formats: JPG, JPEG, PNG

2. Start the server:
```bash
node index.js
```

3. The program will:
   - Process all images in the `images` directory
   - Detect text from each image
   - Translate the detected text to Croatian
   - Save results in an Excel file in the `excel_files` directory

4. The Excel file will be named `translation_results_[timestamp].xlsx` and will contain:
   - Image Name
   - Detected Text
   - Translated Text

## Project Structure

```
text_detect_from_image/
├── images/              # Place your images here
├── excel_files/         # Generated Excel files
├── prompts/            # Prompt templates
│   ├── detect_text_prompt.txt
│   └── translate_text_prompt.txt
├── workers/            # Worker threads
│   └── imageWorker.js
├── index.js           # Main application file
├── package.json
└── .env               # Environment variables
```

## Configuration

The project uses the following default settings:
- Server port: 3000
- Number of concurrent workers: 4

You can modify these settings in `index.js` if needed.

## Notes

- The program processes images in parallel using worker threads for better performance
- Each image is processed independently
- Results are saved in real-time to the Excel file
- The program will create a new Excel file for each run with a timestamp

## Error Handling

- Failed image processing will be logged to the console
- The program continues processing other images even if some fail
- A summary of successful and failed processing is shown at the end

## License

[Your chosen license] 