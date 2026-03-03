import React, { type ReactNode, type CSSProperties } from 'react';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
    onClick?: () => void;
}

/**
 * A reusable glassmorphism card component.
 * Provides a semi-transparent blurred background and standardized padding.
 * 
 * @param props - Component props including children, className, and optional style/onClick.
 */
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

