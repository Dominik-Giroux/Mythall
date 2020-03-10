export class Error {

  constructor(code: number, message: string){
    this.code = code;
    this.message = message;
    this.isError = true;
  }

  code: number;
  message: string;
  isError: boolean;

}

// Add Customs error codes here
export const ErrorCodes = {

  badRequest: 0,
  firebaseAuth: 1,
  firestore: 2

}