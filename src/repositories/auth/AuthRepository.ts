import MockAuthRepository from "./MockAuthRepository";
import IAuthRepository from "./IAuthRepository";
// import APIAuthRepository from "./APIAuthRepository"; // Future Implementation

const ENV : string = "mock";

class AuthRepository {
    private static instance: IAuthRepository;

    static getInstance(): IAuthRepository {
        if (!AuthRepository.instance) {
            if (ENV === "api") {
                // AuthRepository.instance = new APIAuthRepository(); // Future Implementation
            } else {
                AuthRepository.instance = new MockAuthRepository();
            }
        }
        console.log("Returning an instance of AuthRepository...");
        return AuthRepository.instance;
    }
}

export default AuthRepository;
