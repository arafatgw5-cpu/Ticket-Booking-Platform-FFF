import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { MongoClient, ServerApiVersion } from 'mongodb';
import dns from 'dns';

// 💡 Node.js 18+ এর 'querySrv ECONNREFUSED' এরর ফিক্স
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}
     
const options = {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
};


let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

async function getDb() {
    const mongoClient = await clientPromise;
    return mongoClient.db('ticketbari');
}

const db = await getDb();

// ==========================================
// Better Auth Config
// ==========================================
export const auth = betterAuth({
    database: mongodbAdapter(db),
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.NEXT_PUBLIC_APP_URL,
    trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL || ''],

    emailAndPassword: {
        enabled: true,
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        },
    },

    user: {
        modelName: 'users',
        additionalFields: {
            role: {
                type: 'string',
                defaultValue: 'user',
                input: true,
            },
            isFraud: {
                type: 'boolean',
                defaultValue: false,
                input: false,
            },
        },
    },

    databaseHooks: {
        user: {
            create: {
                before: async (user, ctx) => {
                    const path = ctx?.path || '';
                    const isSocialSignup = path.includes('callback') || path.includes('oauth');

                    if (isSocialSignup) {
                        return { data: { ...user, role: 'user', isFraud: false } };
                    }

                    const requestedRole = user.role || 'user';

                    if (requestedRole === 'admin') {
                        return { data: { ...user, role: 'admin', isFraud: false } };
                    }

                    if (requestedRole === 'vendor') {
                        return { data: { ...user, role: 'vendor', isFraud: false } };
                    }

                    return { data: { ...user, role: 'user', isFraud: false } };
                },
            },
        },
    },
});