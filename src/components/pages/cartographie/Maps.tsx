import Header from './components/Header';
import MapView from './components/MapView';
import Sidebar from './components/Sidebar';
import {useMapStore} from "@/store/mapStore.ts";

function Maps() {
    const { sidebarOpen } = useMapStore();

    return (
        <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 overflow-hidden">
            {/* Header */}
            <Header />

            {/* Main content */}
            <div className="flex-1 relative overflow-hidden">
                {/* Map */}
                <div className={`h-full transition-all duration-500 ease-in-out ${sidebarOpen ? 'mr-0' : 'mr-0'}`}>
                    <MapView />
                </div>

                {/* Sidebar */}
                <div>
                    <Sidebar />
                </div>

            </div>
        </div>
    );
}

export default Maps;