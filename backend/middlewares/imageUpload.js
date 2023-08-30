const multer = require('multer')
const path = require('path')

//Destination to store image
const storeImage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = ''

        if(req.baseUrl.includes('users')) {
            folder = 'users'
        } else if (req.baseUrl.includes('photos')) {
            folder = 'photos'
        }

        cb(null, `uploads/${folder}/`)
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const imageUpload = multer({
    storage: storeImage,
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(png|jpg)$/)) {
            //upload only png or jpg formats
            return cb(new Error('Por favor, envie apenas jpg ou png!'))
        }
        cb(undefined, true )
    }
})

module.exports = {imageUpload}