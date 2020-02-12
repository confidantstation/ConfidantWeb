/**
 * @interface IAccountCreate
 */
export interface IAccountCreate {
    privKey: string;
    pubKey: string;
}

/**
 * @interface IAccountNewAccounts
 */
export interface IAccountNewAccounts {
    seed: string;
    privateKey: string;
    publicKey: string;
    address: string;
}

/**
 * @interface IDpkiGetPublishBlockRequest
 */
export interface IDpkiGetPublishBlockRequest {
    account: string;
    type: string;
    id: string;
    pubKey: string;
    fee: string;
    verifiers: string[];
}

/**
 * @interface IDpkiGetPublishBlockResponse
 */
export interface IDpkiGetPublishBlockResponse {
    block: any;
    verifiers: any;
}
