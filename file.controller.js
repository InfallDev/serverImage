const multer = require("multer");
const fs = require("fs");
require('dotenv').config();

// Configuration de Multer pour spécifier le dossier de destination et le nom du fichier
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public");
    },
    filename: (req, file, cb) => {
        const extension = '.' + file.originalname.split('.')[1];
        cb(null, `file-${Date.now()}${extension}`);
    }
});

// Configurer l'upload avec Multer
const upload = multer({ storage,  });

const uploadImage = (req, res) => {
    try {
        upload.single("file")(req, res, (error) => {
            if (error instanceof multer.MulterError) {
                // Une erreur s'est produite lors de l'upload
                return res.status(400).json({ success: false, message: "Erreur lors du téléchargement de l'image", error: error.message });
            } else if (error) {
                // Une autre erreur s'est produite
                return res.status(500).json({ success: false, message: "Erreur lors du téléchargement de l'image", error: error.message });
            }
            return res.json({ success: true, message: "Image téléchargée avec succès", filename: req?.file?.filename});
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur lors du téléchargement de l'image", error: error.message });
    }
};

const deleteImage = (req, res) => {
    try {
        const imageName = req.query.name;
        const imagePath = `${process.cwd()}/public/${imageName}`;

        // Vérifier si le fichier existe
        fs.access(imagePath, fs.constants.F_OK, (error) => {
            if (error) {
                console.error(error);
                return res.status(404).json({ success: false, message: "Image non trouvée" });
            }

            // Supprimer le fichier
            fs.unlink(imagePath, (error) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ success: false, message: "Erreur lors de la suppression de l'image" });
                }

                res.json({ success: true, message: "Image supprimée avec succès" });
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur lors de la suppression de l'image", error: error.message });
    }
};

module.exports = {
    uploadImage,
    deleteImage
};
