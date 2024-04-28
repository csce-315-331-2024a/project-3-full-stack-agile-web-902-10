import { io } from "./socket";
import { setupListen } from "./routes";

setupListen();

try {
    if (process.env.PORT) {
        io.listen(parseInt(process.env.PORT));
        console.log("Listening on port" + process.env.PORT);
    }
    else {
        io.listen(5000);
        console.log("Listening on port 5000");
    }
} catch (error) {
    console.error(error);
}