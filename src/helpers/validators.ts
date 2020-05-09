export const passwordValid = (password: string) => {
    return new Promise((resolve, reject) => {
        if(password.length < 7){
            reject("Password need to be at least 7 characters");
        }

        if(password.length > 35){
            reject("Password cant be greater than 35 characters");
        }

        if(!(/[a-z]/).test(password)){
            reject("Password must have a lower case character");
        }

        if(!(/[A-Z]/).test(password)){
            reject("Password must have an upper case character");
        }

        if(!(/[0-9!@#$%^&*(),.?":'{}|<>]/).test(password)){
            reject("Password must have a number or special character");
        }

        if(password.toLowerCase().includes("password")){
            reject("Password cant contain the word password");
        }

        resolve("success");
    })
}

export const usernameValid = (username: string) => {
    return new Promise((resolve, reject) => {
        if(/\s/g.test(username)){
            reject("Username cant contain whitespace");
        }

        if(username.length > 100){
            reject("Username cant be greater than 100 characters");
        }

        if((/[^0-9a-zA-Z$_.!]/).test(username)){
            reject("Username contains unauthorized character");
        }

        if(username.length <= 0){
            reject("Username cant be empty");
        }

        resolve("success");
    })
}

export const statusValid = (username: string) => {
    return new Promise((resolve, reject) => {
        if(username.length > 140){
            reject("Status cant be greater than 140 characters");
        }

        resolve("success");
    })
}