/* 
  if there is an error thrown in the DB, asyncMiddleware
  will pass it to next() and express will handle the error */
import raw from '../../middleware/route.async.wrapper.mjs';
import { createUserModel } from './user.model.mjs';
// import { updateUserModel } from './updateUser.model.mjs';
import express from 'express';
import log from '@ajar/marker';
import {
  postSchema,
  putSchema,
  postManyhSchema,
  patchSchema,
} from './serverSchemValidator.mjs';

const router = express.Router();

// parse json req.body on post routes
router.use(express.json());

router.get('/test', (req, res) => {
  console.log('her e hellowowowwowo');
  res.json('test');
});
// Create user
router.post(
  '/',
  raw(async (req, res, next) => {
    log.obj(req.body, 'create a user, req.body:');
    await postSchema.validateAsync(req.body);
    const user = await createUserModel.create(req.body);
    res.status(200).json(user);
  })
);
// Create many users
router.post(
  '/multy',
  raw(async (req, res, next) => {
    log.obj(req.body, 'create a user, req.body:');
    await postManyhSchema.validateAsync(req.body);
    const user = await createUserModel.insertMany(req.body);
    res.status(200).json(user);
  })
);

// GET ALL USERS
router.get(
  '/',
  raw(async (req, res) => {
    console.log('its workkkk');
    const users = await createUserModel.find();
    res.status(200).json(users);
  })
);

router.get(
  '/paginate/:page?/:items?',
  raw(async (req, res) => {
    log.obj(req.params, 'get all users, req.params:');
    let { page = 0, items = 10 } = req.params;
    const users = await createUserModel
      .find()
      .select(`first_name last_name email phone`)
      .limit(parseInt(items))
      .skip(parseInt(page * items));

    res.status(200).json(users);
  })
);

// GETS A SINGLE USER
router.get(
  '/:id',
  raw(async (req, res) => {
    const user = await createUserModel.findById(req.params.id);

    if (!user) return res.status(404).json({ status: 'No user found.' });
    res.status(200).json(user);
  })
);
// UPDATES A SINGLE USER
router.put(
  '/:id',
  raw(async (req, res) => {
    console.log({ test: req.params });
    await putSchema.validateAsync(req.body);
    const user = await createUserModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        upsert: false,
      }
    );
    res.status(200).json(user);
  })
);
// UPDATES A SINGLE USER
router.patch(
  '/:id',
  raw(async (req, res) => {
    console.log({ test: req.params });
    await patchSchema.validateAsync(req.body);
    // const exists = await createUserModel.exists({ _id: req.params.id });
    // console.log(exists);
    const user = await createUserModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        upsert: false,
      }
    );

    res.status(200).json(user);
  })
);
// Delete all users
router.delete(
  '/deleteAll',
  raw(async (req, res) => {
    const user = await createUserModel.deleteMany({});
    res.status(200).json(user);
  })
);

// DELETES A USER
router.delete(
  '/:id',
  raw(async (req, res) => {
    const user = await createUserModel.findByIdAndRemove(req.params.id);
    res.status(200).json(user);
  })
);

export default router;
