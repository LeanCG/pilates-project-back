import React, { type ReactNode, type CSSProperties } from 'react';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
    onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', style, onClick }) => {
    return (
        <div
            className={`glass-card ${className}`}
            onClick={onClick}
            style={{ cursor: onClick ? 'pointer' : 'default', ...style }}
        >
            {children}
        </div>
    );
};

