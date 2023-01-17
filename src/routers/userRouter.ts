import { Router } from './router';
import { userService } from '../services/user.service';

const userRouter: Router = new Router();

userRouter.get('/api/users', userService.getAll);
userRouter.get('/api/users/:id', userService.getById);
userRouter.post('/api/users', userService.create);
userRouter.put('/api/users/:id', userService.update);
userRouter.delete('/api/users/:id', userService.remove);

export { userRouter };
