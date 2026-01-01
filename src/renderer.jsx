import { createRoot } from 'react-dom/client';
import ECGPlot from "./component/ECGPlot";
import { createMockECGSource } from "./component/mockECG";

const ecgSource = createMockECGSource();

function App() {
    return (
        <div>
            <h2>Live ECG</h2>
            <ECGPlot ecgSampleSource={ecgSource} />
        </div>
    );
}

export default App;


const container = document.getElementById("root")
const root = createRoot(container);
root.render(<App/>);
