import * as crypto from 'crypto'

/**
 * Interface representing a signed JSON package.
 */
export interface SignedPackage<T> {
  data: T
  signature: string
}

/**
 * Signs a JSON package using HMAC-SHA256.
 *
 * @param data - The object to sign (will be converted to JSON).
 * @param secretKey - The secret key used for signing.
 * @returns An object containing the original data and the HMAC signature.
 *
 * @example
 * ```typescript
 * const packageToSign = { id: '123', message: 'Hello World' };
 * const secret = 'my-secret-key';
 * const signedPackage = signJsonPackage(packageToSign, secret);
 * // { data: { id: '123', message: 'Hello World', _issuedAt: datetime, _dataVerstion: number }, signature: '...' }
 * ```
 */
export function signJsonPackage<T> (data: T, secretKey: string): SignedPackage<T> {
  const jsonString = JSON.stringify(data)
  const signature = createHmacSignature(jsonString, secretKey)

  return {
    data,
    signature
  }
}

/**
 * Verifies the signature of a signed JSON package.
 *
 * @param signedPackage - The signed package to verify.
 * @param secretKey - The secret key used for verification.
 * @returns True if the signature is valid, false otherwise.
 *
 * @example
 * ```typescript
 * const isValid = verifyJsonPackage(signedPackage, 'my-secret-key');
 * ```
 */
export function verifySignedJsonPackage<T> (signedPackage: SignedPackage<T>, secretKey: string): boolean {
  try {
    const jsonString = JSON.stringify(signedPackage.data)
    const expectedSignature = createHmacSignature(jsonString, secretKey)

    // Use timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(signedPackage.signature, 'hex')
    )
  } catch {
    return false
  }
}

/**
 * Creates an HMAC-SHA256 signature for a given message.
 *
 * @param message - The message to sign (typically a JSON string).
 * @param secretKey - The secret key used for signing.
 * @returns The hexadecimal representation of the HMAC signature.
 */
function createHmacSignature (message: string, secretKey: string): string {
  const hmac = crypto.createHmac('sha256', secretKey)
  hmac.update(message)
  return hmac.digest('hex')
}
