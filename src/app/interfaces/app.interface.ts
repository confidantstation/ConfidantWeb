/**
 * @interface IAccount
 */
export interface IAccount {
    seed: string;
    privateKey: string;
    publicKey: string;
    address: string;
    social?: ISocial;
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
