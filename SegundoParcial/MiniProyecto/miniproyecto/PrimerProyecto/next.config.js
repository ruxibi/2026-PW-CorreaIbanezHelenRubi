const MINI_SERVIDOR_URL = 'https://localhost:3000'; 
const BACKEND URL =  'https://localhost:3306'; 

/** @type{import('next').NextConfig}*/


    export const reactStrictMode = true; 
    export async function rewrites(){
    return[
        {source: '/mini/:path*', },
        
    ] 
}