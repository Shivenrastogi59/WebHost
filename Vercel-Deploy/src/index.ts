import dotenv from 'dotenv';
dotenv.config();
import { createClient, commandOptions } from 'redis';
import { downloadS3File } from './aws';

const subscriber = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.HOST,
        port: 15577 
    }
});
subscriber.on('error', err => console.log('Redis Client Error', err));
(async () => {
    await subscriber.connect();
})();

async function main(){
    while(1){
        const response = await subscriber.brPop(
            commandOptions({ isolated: true }),
            'build-queue',
            0
        );
        console.log(response);
        if (response) {
            const { element } = response;
            await downloadS3File(`output/${element}`);
        }
    }
}
main();