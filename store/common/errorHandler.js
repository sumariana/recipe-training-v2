import { Alert } from "react-native";

export const getErrorMessage = (err) => {
    console.log(err.response.data);
    if (err.response) {
        const errorData = err.response.data;
        const errorMessage = errorData.error.errors[0].message 
        console.log(errorMessage);
        switch (errorMessage) {
            case "Unauthenticated": 
                throw Error("Data Anda Belum Terdaftar");
            case "The email has already been taken.":
                throw Error("Email yang anda gunakan telah terdaftar");
            case "The phone has already been taken.":
                throw Error("Nomor Handphone yang anda gunakan telah terdaftar");
            case "Unauthenticated.": 
                throw Error("Anda Tidak Memiliki Akses, Silahkan Login Ulang");
            case "Wrong password": 
                throw Error("Kata Sandi Lama Salah. Pastikan Kata Sandi Lama Anda Benar");
            case "Password anda salah": 
                throw Error("Kata Sandi Anda Salah");
            default: 
                throw Error(errorMessage);
        }
    } else if (err.message === "Network Error") {
        throw new Error("Periksa Koneksi Internet Anda");
    } else {
        throw new Error("Terjadi Kesalahan Pada Internal Server")
    }
};  

export const showErrorAlert = (message) => {
    setTimeout(() => {
            Alert.alert( "Terjadi Kesalahan", message, [
                { 
                    text: "OK",
                }
            ]);
    }, 200)
}