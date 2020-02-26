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

/**
 * @interface IDpkiGetOracleInfosByTypeAndIdRequest
 */
export interface IDpkiGetOracleInfosByTypeAndIdRequest {
    type: string;
    id: string;
}

/**
 * @interface IDpkiGetOracleBlockRequest
 */
export interface IDpkiGetOracleBlockRequest {
    account: string;
    type: string;
    id: string;
    pk: string;
    code: string;
    hash: string;
}

/**
 * @interface IDpkiGetPublishInfosByAccountAndTypeRequest
 */
export interface IDpkiGetPublishInfosByAccountAndTypeRequest {
    account: string;
    type: string;
}
