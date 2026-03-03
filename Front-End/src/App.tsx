import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AuthGuard } from './components/AuthGuard';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Clients } from './pages/Clients';
import { ClientDetail } from './pages/ClientDetail';
import { NewClient } from './pages/NewClient';
import { Routines } from './pages/Routines';
import { RoutineDetail } from './pages/RoutineDetail';
import { RoutineBuilder } from './pages/RoutineBuilder';
import { Exercises } from './pages/Exercises';
import { ExerciseForm } from './pages/ExerciseForm';
import { Accounting } from './pages/Accounting';
import { AccountingForm } from './pages/AccountingForm';
import { Employees } from './pages/Employees';
import { EmployeeForm } from './pages/EmployeeForm';
import { Shifts } from './pages/Shifts';
import { ShiftForm } from './pages/ShiftForm';
import { Reservations } from './pages/Reservations';
import { MyProgress } from './pages/MyProgress';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<AuthGuard><Layout /></AuthGuard>}>
            {/* Dashboard */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Navigate to="/" replace />} />

            {/* Clients */}
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/new" element={<NewClient />} />
            <Route path="/clients/:id" element={<ClientDetail />} />

            {/* Routines */}
            <Route path="/routines" element={<Routines />} />
            <Route path="/routines/new" element={<RoutineBuilder mode="create" />} />
            <Route path="/routines/:id" element={<RoutineDetail />} />
            <Route path="/routines/:id/edit" element={<RoutineBuilder mode="edit" />} />

            {/* Exercises */}
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/exercises/new" element={<ExerciseForm mode="create" />} />
            <Route path="/exercises/:id/edit" element={<ExerciseForm mode="edit" />} />

            {/* Accounting */}
            <Route path="/accounting" element={<Accounting />} />
            <Route path="/accounting/new" element={<AccountingForm />} />

            {/* Employees */}
            <Route path="/employees" element={<Employees />} />
            <Route path="/employees/new" element={<EmployeeForm />} />
            <Route path="/employees/:id/edit" element={<EmployeeForm />} />

            {/* Shifts */}
            <Route path="/shifts" element={<Shifts />} />
            <Route path="/shifts/new" element={<ShiftForm />} />
            <Route path="/shifts/:id/edit" element={<ShiftForm />} />

            {/* Self service */}
            <Route path="/my-reservations" element={<Reservations />} />
            <Route path="/my-progress" element={<MyProgress />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
