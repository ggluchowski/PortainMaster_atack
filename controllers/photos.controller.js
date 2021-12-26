const Photo = require('../models/photo.model');
const helpFunctions = require('../functions/functions');
const Voter = require('../models/Voter.model');

/****** SUBMIT PHOTO ********/
exports.add = async (req, res) => {

  try {
    const { title, author, email } = req.fields;
    const file = req.files.file;

    const titleEscape = helpFunctions.escape(title);
    const authorEscape = helpFunctions.escape(author);
    const emailPattern = helpFunctions.emailPattern(email);

    if (titleEscape && authorEscape && emailPattern && file) { // if fields are not empty...
      const titleLength = title.length;
      const authorLength = author.length;

      if (titleLength <= 25 && authorLength <= 50) {
        const fileName = file.path.split('/').slice(-1)[0]; // cut only filename from full path, e.g. C:/test/abc.jpg -> abc.jpg
        if (fileName) {
          const fileExtension = fileName.split('.')[1];

          if (fileExtension === 'jpg' || fileExtension === 'gif' || fileExtension === 'png') {
            const newPhoto = new Photo({ title, author, email, src: fileName, votes: 0 });
            await newPhoto.save(); // ...save new photo in DB
            res.json(newPhoto);
          } else {
            throw new Error('Wrong input!');
          }
        }
      } else {
        throw new Error('Wrong input! Too long title or author');
      }
    } else {
      throw new Error('Wrong input!');
    }

  } catch (err) {
    res.status(500).json(err);
  }

};

/****** LOAD ALL PHOTOS ********/

exports.loadAll = async (req, res) => {

  try {
    res.json(await Photo.find());
  } catch (err) {
    res.status(500).json(err);
  }

};

/****** VOTE FOR PHOTO ********/

exports.vote = async (req, res) => {

  try {
    const ip = req.clientIp;
    const voteTab = await Voter.findOne({ user: ip });
    const photoToUpdate = await Photo.findOne({ _id: req.params.id });

    if (!photoToUpdate) {
      res.status(404).json({ message: 'Not found' });
    } else {

      if (!voteTab) {
        const newUserVote = new Voter({ user: ip, votes: photoToUpdate._id })
        await newUserVote.save();
        photoToUpdate.votes++;
        photoToUpdate.save();
        res.send({ message: 'OK' });
      } else {
        const stringPhoto = photoToUpdate._id;
        const findPhoto = await Voter.findOne({ user: ip, votes: { $eq: stringPhoto } });

        if (!findPhoto) {
          voteTab.votes.push(stringPhoto);
          voteTab.save();
          photoToUpdate.votes++;
          photoToUpdate.save();
          res.send({ message: 'OK' });
        } else
          res.status(500).send({ message: 'You voted for this photo...' });
      }

    }
  } catch (err) {
    res.status(500).send({ message: 'Catch err...' });
    // json(err);
  }

};
