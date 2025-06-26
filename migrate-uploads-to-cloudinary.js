const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configura Cloudinary con tus variables de entorno
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Ruta a la carpeta de uploads
const uploadsDir = path.join(__dirname, 'public', 'uploads');

// Archivos a ignorar
const ignoredFiles = [
  '.gitkeep',
  '.DS_Store',
  'Thumbs.db',
  '.gitignore',
  'desktop.ini'
];

// Extensiones de archivo válidas para subir
const validExtensions = [
  '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg',
  '.pdf', '.doc', '.docx', '.txt', '.mp4', '.avi', '.mov', '.mp3'
];

const migrateUploads = async () => {
  try {
    // Verifica si la carpeta existe
    if (!fs.existsSync(uploadsDir)) {
      console.log('❌ La carpeta de uploads no existe');
      return;
    }

    const files = fs.readdirSync(uploadsDir);

    if (files.length === 0) {
      console.log('📁 La carpeta de uploads está vacía');
      return;
    }

    console.log(`📂 Encontrados ${files.length} archivos en la carpeta`);

    for (const file of files) {
      const filePath = path.join(uploadsDir, file);
      const fileStats = fs.lstatSync(filePath);

      // Ignora si no es un archivo regular
      if (!fileStats.isFile()) {
        console.log(`⏭️  Ignorando directorio: ${file}`);
        continue;
      }

      // Ignora archivos del sistema
      if (ignoredFiles.includes(file)) {
        console.log(`⏭️  Ignorando archivo del sistema: ${file}`);
        continue;
      }

      // Verifica la extensión del archivo
      const fileExtension = path.extname(file).toLowerCase();
      if (!validExtensions.includes(fileExtension)) {
        console.log(`⏭️  Ignorando archivo con extensión no válida: ${file}`);
        continue;
      }

      // Verifica que el archivo no esté vacío
      if (fileStats.size === 0) {
        console.log(`⏭️  Ignorando archivo vacío: ${file}`);
        continue;
      }

      console.log(`⏫ Subiendo ${file} (${(fileStats.size / 1024).toFixed(2)} KB) a Cloudinary...`);

      try {
        const result = await cloudinary.uploader.upload(filePath, {
          folder: 'strapi_uploads',
          resource_type: 'auto', // Detecta automáticamente el tipo de recurso
          use_filename: true,
          unique_filename: false,
        });

        console.log(`✅ ${file} subido con URL: ${result.secure_url}`);
      } catch (uploadError) {
        console.error(`❌ Error al subir ${file}:`, uploadError.message);
      }
    }

    console.log('\n🚀 ¡Migración completa!');
  } catch (error) {
    console.error('❌ Error general:', error);
  }
};

migrateUploads();