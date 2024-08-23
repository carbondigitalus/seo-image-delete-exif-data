// Core Modules
import fs from 'fs';
import path from 'path';

// NPM Modules
import axios from 'axios';
import slugify from 'slugify';
import 'dotenv/config';

// Azure API configuration
const subscriptionKey = process.env.API_KEY;
const endpoint = process.env.API_URL;
const analyzeUrl = `${endpoint}/vision/v3.2/analyze?visualFeatures=Description`;

// Function to describe image using Azure Computer Vision API
async function describeImage(imagePath: string): Promise<string> {
  try {
    const imageData = fs.readFileSync(imagePath);
    const response = await axios.post(analyzeUrl, imageData, {
      headers: {
        'Ocp-Apim-Subscription-Key': subscriptionKey,
        'Content-Type': 'application/octet-stream'
      }
    });
    
    const descriptions = response.data.description.captions.map((caption: any) => caption.text);
    return descriptions.length > 0 ? descriptions[0] : 'no_description_found';
  } catch (error) {
    console.error('Error calling Computer Vision API:', error);
    return 'error_processing_image';
  }
}

// Function to rename images based on description
async function renameImage(filePath: string) {
  const description = await describeImage(filePath);
  const dir = path.dirname(filePath);
  const originalExt = path.extname(filePath).toLowerCase();
  const slugifiedDescription = slugify(description, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
  const newFileName = `${slugifiedDescription}${originalExt}`;
  const newFilePath = path.join(dir, newFileName);

  try {
    fs.renameSync(filePath, newFilePath);
    console.log(`Renamed ${filePath} to ${newFilePath}`);
  } catch (error) {
    console.error(`Failed to rename ${filePath}: ${error}`);
  }
}

// Function to process a directory of images
const processDirectory = async (directory: string) => {
  console.log(`Processing directory: ${directory}`);
  const files = fs.readdirSync(directory);
  console.log(`Found ${files.length} files`);
  for (const file of files) {
    const filePath = path.join(directory, file);
    if (fs.statSync(filePath).isFile() && /\.(jpg|jpeg|png)$/i.test(file)) {
      console.log(`Processing file: ${file}`);
      await renameImage(filePath);
    } else {
      console.log(`Skipping non-image file or directory: ${file}`);
    }
  }
};

// Example usage
const directoryPath = path.join(__dirname, 'img');
processDirectory(directoryPath);
