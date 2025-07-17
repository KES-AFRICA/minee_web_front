import Header from './components/Header';
import MapView from './components/MapView';
import Sidebar from './components/Sidebar';

function Maps() {

    return (
        <div className="min-h-[90vh] bg-gray-50 flex flex-col p-0">
            <Header />
            <div className="flex-1 flex relative">
                <div >
                    <Sidebar />
                </div>

                <div>
                    <MapView />
                </div>

            </div>
        </div>
    );
}

export default Maps;