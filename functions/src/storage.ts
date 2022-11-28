import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import path = require('path');
import os = require('os');
import fs = require('fs');
import * as sharp from 'sharp';



export const resizeAvatar = functions.storage.object().onFinalize(async object => {
    const bucket = admin.storage().bucket(object.bucket);
    const filePath = object.name ?? 'imageTest';
    const tempFilePath = path.join(os.tmpdir(), filePath);
    const fileName = filePath.split('/').pop()
    const metadata = {
    contentType: "image/png",
    };

    const avatarName = `thumb_${fileName}`;
    const tempAvatarPath = path.join(os.tmpdir(), avatarName);

    if(fileName?.includes('thumb')){
        console.log('exiting function');
        return false;
    }


    await bucket.file(filePath).download({destination: tempFilePath});
    functions.logger.log('Image downloaded locally to', tempFilePath);
    // Generate a thumbnail using ImageMagick.
    await sharp(tempFilePath).resize(100,100).toFile(tempAvatarPath);
    functions.logger.log('Thumbnail created at', tempAvatarPath);
    // We add a 'thumb_' prefix to thumbnails file name. That's where we'll upload the thumbnail.
    // Uploading the thumbnail.
    await bucket.upload(tempAvatarPath, {
    destination: path.join(path.dirname(filePath), avatarName),
    metadata: metadata,
    });
    // Once the thumbnail has been uploaded delete the local file to free up disk space.
    return fs.unlinkSync(tempFilePath);

})