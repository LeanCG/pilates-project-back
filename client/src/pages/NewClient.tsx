import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClientForm } from '../components/ClientForm';

/**
 * NewClient page component.
 * Provides a high-level wrapper for the ClientForm.
 * Handles the integrated creation of personal data, user credentials, and initial turn.
 */
export const NewClient: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = async (data: any) => {
        try {
            // API integration point
            console.log("Submit data to API:", data);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Success redirection
            alert("Cliente registrado y turno asignado");
            navigate('/clients');
        } catch (err: any) {
            console.error(err);
            alert("Hubo un error al registrar al cliente: " + err.message);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <header className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-2xl font-bold">Nuevo Cliente</h1>
                    <p className="text-[var(--text-secondary)]">Alta integrada de datos, credenciales y turno</p>
                </div>
                <button className="btn btn-secondary" onClick={() => navigate('/clients')}>
                    Volver
                </button>
            </header>

            <ClientForm onSubmit={handleSubmit} />
        </div>
    );
};
