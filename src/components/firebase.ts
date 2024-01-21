import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyDZ5bqlnWfJlHtTBHe3fHbf50R3g5IJNOY",
    authDomain: "admin-dashboard-83aa1.firebaseapp.com",
    databaseURL: "https://admin-dashboard-83aa1-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "admin-dashboard-83aa1",
    storageBucket: "admin-dashboard-83aa1.appspot.com",
    messagingSenderId: "336097490048",
    appId: "1:336097490048:web:d92918d085c38ec21de265",
    measurementId: "G-PD7WJYZLY9"
};


const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;