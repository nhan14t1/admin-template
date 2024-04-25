import AdminSidebar from './Sidebar/AdminSidebar';
import { AuthContextProvider } from '../../shared/contexts/AuthContext';
import { AppContextProvider } from '../../shared/contexts/AppContext';

const AdminLayout = ({ children }) => {
  return (
    <AuthContextProvider>
      <AppContextProvider>
        <div className='admin-layout'>
          <AdminSidebar sidebarOpen={true} openSidebar={() => { }} >
            {children}
          </AdminSidebar>
        </div>
      </AppContextProvider>
    </AuthContextProvider>
  );
}

export default AdminLayout;
