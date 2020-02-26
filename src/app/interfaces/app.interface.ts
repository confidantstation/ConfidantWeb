/**
 * @interface IAccount
 */
export interface IAccount {
    seed: string;
    privateKey: string;
    publicKey: string;
    address: string;
    social?: ISocial;
    encryption?: IEncryption;
}

/**
 * @interface ISocial
 */
export interface ISocial {
    email?: {
        id: string;
        code: number;
        validated: boolean;
    },
    weChat?: {
        id: string;
    }
}

/**
 * @interface IEncryption
 */
export interface IEncryption {
    keyPair: {
        publicKey: string;
        privateKey: string;
    },
    keyPairTemp: {
        publicKey: string;
        privateKey: string;
    },
    friend: {
        keyPair: {
            publicKey: string;
            privateKey: string;
        },
        keyPairTemp: {
            publicKey: string;
            privateKey: string;
        }
    }
}
