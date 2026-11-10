import Menu from '../components/Menu'

import '../Styles/style.css'; 
export default function App ({Component, pageProps}){
    return(
        <>
        <Menu />
        <Component {...pageProps}/>
        
        </>
    )
}