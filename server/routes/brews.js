import models from '../models';
import passport from 'passport';

const requireAuth = passport.authenticate('jwt', { session: false });

const brews = (app) => {
  app.route('/api/brews/create')
    .post(requireAuth, (req, res) => {
      const { brewName, title, description, userId } = req.body;

      if (!brewName || !title || !description || !userId) {
        return res.status(422).json({
          errorMessage: 'Missing required fields and must be signed in.'
        });
      }

      models.Brew.findOne({
        where: {
          brew_name: brewName
        }
      }).then((existingBrew) => {
        if (existingBrew) {
          return res.status(422).send({
            errorMessage: brewName + ' is already in use. ' +
              'Please create a unique brew name.'
          });
        }

        models.User.findOne({
          where: {
            id: userId
          }
        }).then(createBrew);
      });

      function createBrew (user) {
        if (!user) {
          return res.status(404).send({
            errorMessage: 'Could not find user.'
          });
        }

        models.Brew.create({
          brew_name: brewName.toLowerCase(),
          title: title,
          description: description,
          UserId: userId
        }).then((brew) => {
          res.json({
            brew
          });
        });
      }
    });

  app.route('/api/topBrews')
    .get((req, res) => {
      models.Brew.findAll({
        include: [
          { model: models.Post }
        ]
      }).then((brews) => {
        brews = brews.map((brew) => {
          brew.dataValues.postCount = brew.dataValues.Posts.length;
          delete brew.dataValues.Posts;
          return brew;
        });

        res.json(brews);
      });
    });

  app.route('/api/all')
    .get((req, res) => {
      models.Post.findAll({
        order: [['createdAt', 'DESC']],
        include: [
          { model: models.User }
        ]
      }).then((posts) => {
        posts = posts.map((post) => {
          post.dataValues.username = post.dataValues.User
            .dataValues.username;
          delete post.dataValues.User;
          return post;
        });

        return res.json({ posts });
      });
    });

  app.route('/api/b/:brewId')
    .get((req, res) => {
      models.Brew.findOne({
        where: {
          brew_name: req.params.brewId
        },
        include: [
          { model: models.User }
        ]
      }).then((brew) => {
        if (!brew) {
          return res.status(404).json({
            brew: null,
            posts: [],
            errorMessage: `${req.params.brewId} not found.`
          });
        }

        brew.dataValues.username = brew.dataValues.User.dataValues.username;
        delete brew.dataValues.User;
        brew.getPosts({
          order: [['createdAt', 'DESC']],
          include: [
            { model: models.User }
          ]
        }).then((posts) => {
          // remove all User data other than username before sending response
          posts = posts.map((post) => {
            post.dataValues.username = post.dataValues.User
              .dataValues.username;
            delete post.dataValues.User;
            return post;
          });

          return res.json({ brew, posts });
        });
      });
    });
};

export default brews;
