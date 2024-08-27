import { Router } from 'express';
import { userHelpers } from '../helpers';

const router = Router();

router.patch('/update-details/:userId', (request, response) => {
  const { userId } = request.params;
  userHelpers
    .updateUserDetails(userId, request.body)
    .then((res) => {
      response.status(res.status).send(res.data);
    })
    .catch((err) => {
      response.status(err.status).send(err.data);
    });
});
// router.patch('/delete/:userId', (request, response) => {
//   const { userId } = request.params;
// });

export default router;
