import { auth } from "@/lib/auth"; // Import the server setup from Step 3
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);