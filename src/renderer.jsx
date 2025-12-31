import { createRoot } from 'react-dom/client';
import Profile from "./component/profile";
import Chart from "./component/chart";


const App=()=>{
    return(
        <>
        <Chart/>
        </>
    )
}

const container = document.getElementById("root")
const root = createRoot(container);
root.render(<App/>);
