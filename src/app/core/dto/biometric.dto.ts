import { UserDto } from "./user.dto";

export interface PublicKeyCredentialCreationOptionsJSON {
    challenge: string;
    rp: {
        name: string;
        id?: string
    };
    user: {
        id: string;
        name: string;
        displayName: string
    };
    pubKeyCredParams: Array<{
        alg: number;
        type: 'public-key'
    }>;
    timeout?: number;
    excludeCredentials?: Array<{
        id: string;
        type: 'public-key';
        transports?: string[];
    }>;
    authenticatorSelection?: {
        authenticatorAttachment?: 'platform' | 'cross-platform';
        requireResidentKey?: boolean;
        userVerification: 'required' | 'preferred' | 'discouraged';
    };
    attestation?: 'none' | 'indirect' | 'direct';
}

export interface PublicKeyCredentialRequestOptionsJSON {
    challenge: string;
    timeout?: number;
    userVerification: 'required' | 'preferred' | 'discouraged';
    allowCredentials?: Array<{
        id: string;
        type: 'public-key';
        transports?: string[];
    }>;
}

export interface BiometricRegisterRequest {
    email: string;
    credential: PublicKeyCredentialJson;
}

export interface BiometricLoginRequest {
    email: string;
    assertion: PublicKeyCredentialJson;
}

export interface PublicKeyCredentialJson {
    id: string;
    rawId: string;
    type: 'public-key';
    response: {
        clientDataJSON: string;
        attestationObject?: string;
        authenticatorData?: string;
        signature?: string;
        userHandle?: string;
    }
}

export interface BiometricResponse {
    success: boolean;
    token: string;
    user: UserDto;
}