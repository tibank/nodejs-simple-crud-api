import 'dotenv/config';
import { setRequestHeaders } from './helper/setRequestHeaders';
import { userRouter } from './routers/userRouter';
import { Application } from './server/server';

const PORT: string | number = process.env.PORT || 3000;

const app: Application = new Application();
app.use(setRequestHeaders);
app.route(userRouter);

const start = async () => {
    app.listen(PORT, (): void => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
};

try {
    start();
} catch (error) {
    console.log('Something is going wrohg! ' + error);
}
