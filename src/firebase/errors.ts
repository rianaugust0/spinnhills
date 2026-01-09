// Defines a custom error type for Firestore permission issues.

export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
  public context: SecurityRuleContext;

  constructor(context: SecurityRuleContext) {
    const prettyContext = JSON.stringify(context, null, 2);
    super(
      `FirestoreError: Missing or insufficient permissions: The following request was denied by Firestore Security Rules:\n${prettyContext}`
    );
    this.name = 'FirestorePermissionError';
    this.context = context;

    // This is necessary for custom errors to work correctly in modern JavaScript.
    Object.setPrototypeOf(this, FirestorePermissionError.prototype);
  }
}
